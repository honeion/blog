import express from 'express'
import auth from '../../middleware/auth';

// Model
import Post from '../../models/post'
import Category from '../../models/category'
import User from '../../models/user'

const router = express.Router()

import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'
import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import moment from "moment"
import { isNullOrUndefined } from 'util';
dotenv.config()

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY
})
const uploadS3 = multer({
    storage: multerS3({
        s3,
        bucket: "s3-myblog/upload",
        key(req, file, cb) {
            const ext = path.extname(file.originalname)
            const basename = path.basename(file.originalname, ext)
            cb(null, basename + new Date().valueOf() + ext) //callback
        }
    }), limits: { fileSize: 100 * 1024 * 1024 }, //100mb
});
// region: "ap-northeast-2",

// @route   POST api/post/image
// @desc    Create a Post
// @access  Private
router.post("/image", uploadS3.array("upload", 5), async (req, res, next) => { //next : 에러가 나면 다음으로 넘김
    try {
        res.json({ uploaded: true, url: req.files.map((v) => v.location) });
    } catch (e) {
        console.error(e)
        res.json({ uploaded: false, url: null })
    }
})

// api/post
router.get('/', async (req, res) => {
    const postFindResult = await Post.find(); //몽고디비에서 모든 것 가져옴
    console.log(postFindResult, "ALL Post Get");
    res.json(postFindResult) //마지막 줄에 응답이 나가야함
})

// @route   POST api/post
// @desc    Create a Post
// @access  Private
// express는 middleware가 차례대로 수행됨
// 이미지는 이미 올라가있으므로 
router.post('/', auth, uiploadS3.none(), async (req, res) => {
    try {
        console.log(req, "req");
        const { title, contents, fileUrl, creator, category } = req.body;
        //req.body.title, req.body.contents ...
        const newPost = await Post.create({
            title: title,
            contents, 
            fileUrl, 
            creator, // 똑같으면 생략도 가능
            data : moment().format("YYYY-MM-DD hh:mm:ss")
        }); //async await 안쓰고 .exec() 붙여서 실행해도 가능

        const findResult = await Category.findOne({
            categoryName : category
        })
        // 카테고리

        console.log(findResult, "Find Result")
        //isNullOrUndefined is deprecated
        if(findResult === undefined || findResult === null){ 
            const newCategory = await Category.create({
                categoryName : category
            })
            // Post 모델에 category에 넣어둠 (post - category Id)
            // 배열로 바꾸면 해시태그처럼 사용가능
            await Post.findByIdAndUpdate(newPost._id,{
                $push: {category: newCategory._id}
            }) 
            // Category 모델에 Post 연결 (category - post)
            await Category.findByIdAndUpdate(newCategory._id, {
                $push: {posts : newPost._id}
            })
            // User 모델에 post 추가
            await User.findByIdAndUpdate(req.user.id, {
                $push: { posts : newPost._id }
            })
        } else {
            //카테고리가 이미 존재하면
            await Post.findByIdAndUpdate(newPost._id,{
                $push: {category: findResult._id}
            }) 
            await Category.findByIdAndUpdate(findResult._id, {
                $push : { posts: newPost._id }
            })
            await User.findByIdAndUpdate(req.user.id, {
                $push: { posts : newPost._id }
            })
        }
        //글을 다 쓰면 쓴 글로 이동
        return res.redirect(`/api/post/${newPost._id}`)
        //res.json(newPost);

    } catch (e) {
        console.log(e);
    }
})

// @route   POST api/post/:id
// @desc    Detail Post
// @access  Public

router.get("/:id", async(req, res, next)=>{
    try{
        //objectid로 연결된 것들로 넘어가서 만들어줄 것
        const post = await (await Post.findById(req.params.id)).populate("creator", "name").populate({path: "category" , select : "categoryName"})

    }catch(e){
        console.error(e);
        next(e)
    }
})

//한 개만 내보낼 수 있음. 괄호 없이 불러올 수 있음
export default router
//export const name = () => {} 이름을 정해서 모듈 내보낼 수 있음(import 시 이름 고정), 괄호안에 적어줘야함