import express from 'express'
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'
import config from "../../config/index"
const {JWT_SECRET } = config.parsed;
// Model
import User from '../../models/user'

const router = express.Router()

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

export default router;