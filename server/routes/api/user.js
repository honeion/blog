import express from 'express'
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'
import config from "../../config/index"
const {JWT_SECRET } = config.parsed;
// Model
import User from '../../models/user'

const router = express.Router()

// 수업에서는 로그인 후 바로 프로필을 수정할 수 없고 새로고침을 한번 해야 프로필 수정하는 화면으로 넘어갑니다. 

// 이것을 수정하기 위해서는 어떻게 해야할까요?

// <Hint1> 로그인 후 프로필 화면으로 바로 넘어가지 않고, 새로고침해야 넘어가야 한다는 것은 어떤 값이 안들어와서 그렇다

// <Hint2> AppNavBar, authReducer를 수정필요

// @routes  GET api/user
// @desc    Get all user
// @access  public

router.get('/', async(req, res) => {
    try{
        const users = await User.find()
        if(!users) throw Error("No users")
        res.status(200).json(users)
    } catch (e) {
        console.log(e)
        res.status(400).json({msg : e.message})
    }
})

// @routes  POST api/user
// @desc    Register user
// @access  public

router.post('/', (req, res) => {
    console.log(req);
    const {name, email, password} = req.body;

    // Simple validation
    if(!name || !email || !password) {
        return res.status(400).json({msg : "모든 필드를 채워주세요"})
    }

    // Check for existing user
    //const user = User.findOne({email})
    //function(user){ ... } 와 동일

    User.findOne({email}).then((user=>{
        if(user) return res.status(400).json({msg : "이미 가입된 유저가 존재합니다"})
        const newUser = new User({
            name, email, password
        })

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save().then((user)=>{
                    //web token에 등록
                    //id, Secret key, 만기일
                    jwt.sign( 
                        {id : user.id},
                        JWT_SECRET,
                        {expiresIn: 3600}, //"10h, 10d" 가능
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                token,
                                user : {
                                    id      : user.id,
                                    name    : user.name,
                                    email   : user.email
                                }
                            })
                        }
                    )
                })
            })
        }) //2^10 돌려서 만든값
        //newUser의 패스워드와 위에서 만든 2^10 돌려 만든 salt값을 만든 해쉬값
    }))
})

// @router  POST    api/user/:username/profile
// @desc    POST    Edit Password
// @access  Private
router.post("/:userName/profile", async(req, res) => {
    try {
        const { previousPwd, newPwd, rePwd, userId } = req.body
        console.log(req.body, "userName Profile")
        const result = await User.findById( userId, 'password')
        bcrypt.compare(previousPwd, result.password)
              .then((isMatch)=>{
                  if(!isMatch){
                      return res.status(400).json({
                          match_msg : "기존 비밀번호와 일치하지 않습니다."
                      })
                  } else {
                      if( newPwd === rePwd ){ 
                          //2^10번 계산해서 err와 salt가 나오면 salt를 보내서 hash값을 만듦
                          bcrypt.genSalt(10, (err, salt) => {
                              bcrypt.hash(newPwd, salt, (err, hash) => {
                                  if(err) throw err;
                                  result.password = hash
                                  result.save()
                              })
                          })
                          res.status(200).json({success_msg:"비밀번호 업데이트에 성공했습니다."})
                      } else {
                          res.status(400).json({fail_msg : "새로운 비밀번호가 일치하지 않습니다."})
                      }
                  }
              })
    } catch (error) {
        console.log(error)
    }
})


export default router;