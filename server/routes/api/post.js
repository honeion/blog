import express from 'express'
import auth from '../../middleware/auth';

// Model
import Post from '../../models/post'

const router = express.Router()

import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'
import AWS from 'aws-sdk'
import dotenv from 'dotenv'
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
})
// region: "ap-northeast-2",

// @route   POST api/post/image
// @desc    Create a Post
// @access  Private
router.post("/image", uploadS3.array("upload", 5), async (req, res, next) => { //next : 에러가 나면 다음으로 넘김
    try {
        console.log(req.files.map((v) => v.loaction))
        res.json({ uploaded: true, url: req.files.map((v) => v.loaction) })
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

router.post('/', auth, async (req, res) => {
    try {
        console.log(req, "req");
        const { title, contents, fileUrl, creator } = req.body;
        //req.body.title, req.body.contents ...
        const newPost = await Post.create({
            title: title,
            contents, fileUrl, creator // 똑같으면 생략도 가능
        }); //async await 안쓰고 .exec() 붙여서 실행해도 가능
        res.json(newPost);
    } catch (e) {
        console.log(e);
    }
})
//한 개만 내보낼 수 있음. 괄호 없이 불러올 수 있음
export default router
//export const name = () => {} 이름을 정해서 모듈 내보낼 수 있음(import 시 이름 고정), 괄호안에 적어줘야함