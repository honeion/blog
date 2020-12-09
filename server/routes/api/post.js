import express from 'express'
import auth from '../../middleware/auth';

// Model
import Post from '../../models/post'
import Category from '../../models/category'
import User from '../../models/user'
import Comment from '../../models/comments'

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
    const categoryFindResult = await Category.find();
    const result = {postFindResult, categoryFindResult}
    console.log(result, "ALL Post Get");
    res.json(result) //마지막 줄에 응답이 나가야함
})

// @route   POST api/post
// @desc    Create a Post
// @access  Private
// express는 middleware가 차례대로 수행됨
// 이미지는 이미 올라가있으므로 
router.post('/', auth, uploadS3.none(), async (req, res) => {

    try {
        console.log(req, "req");
        const { title, contents, fileUrl, creator, category } = req.body;
        //req.body.title, req.body.contents ...
        const newPost = await Post.create({
            title: title,
            contents, 
            fileUrl, 
            creator : req.user.id, // 똑같으면 생략도 가능
            date : moment().format("YYYY-MM-DD hh:mm:ss")
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

// @route   GET api/post/:id
// @desc    Detail Post
// @access  Public

router.get("/:id", async(req, res, next)=>{
    try{
        //objectid로 연결된 것들로 넘어가서 만들어줄 것
        const post = await Post.findById(req.params.id)
                .populate("creator", "name")
                .populate({path: "category" , select : "categoryName"});
        post.views +=1;
        post.save();
        console.log(post);
        res.json(post);
    }catch(e){
        console.error(e);
        next(e)
    }
})

// [Comments Route]

// @route Get api/post/:id/comments
// @desc Get All Comments
// @access public

router.get('/:id/comments', async(req, res)=>{
    try {
        const comment = await Post.findById(req.params.id).populate({
            path: "comments", //경로가 model에서 참조하는 ref라고 했었는데 아니고 변수명이 맞는듯 Post에서 comments를 타고 들어가야하는듯
        });
        const result = comment.comments;
        console.log(result,"comment load")
        res.json(result);
    } catch (error) {
        console.log(error) //error있을땐 saga에서 redirect처리
        //res.json(error) 해서 front에 줘도 됨
    }
})

// @route Post api/post
router.post("/:id/comments", async(req, res, next)=>{
    console.log(req,"comments")
    const newComment = await Comment.create({
        contents: req.body.contents,
        creator : req.body.userId,
        creatorName : req.body.userName,
        post : req.body.id,
        date : moment().format("YYYY-MM-DD hh:mm:ss")
    })
    console.log(newComment, "newComment")
    try {
        await Post.findByIdAndUpdate(req.body.id,{
            $push: {
                comments : newComment._id,
            }
        })
        await User.findByIdAndUpdate(req.body.userId,{
            $push: {
                comments : {
                    post_id:req.body.id,
                    comment_id:newComment._id,
                }
            }
        })
        res.json(newComment);
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// @route   Delete api/post/:id
// @desc    Delete a Post
// @access  Private
router.delete("/:id", auth, async(req, res)=>{
    await Post.deleteMany({_id:req.params.id})
    await Comment.deleteMany({post:req.params.id})
    await User.findByIdAndUpdate(req.user.id, {
        $pull : { //배열에서 값빼줄때 pull 사용 mongooseArray
            posts : req.params.id,
            comments : { post_id:req.params.id } 
        },
    });
    const CategoryUpdateResult = await Category.findOneAndUpdate(
        {posts: req.params.id},
        {$pull: {posts:req.params.id}},
        {new : true}
    )

    if(CategoryUpdateResult.length === 0 ){
        await Category.deleteMany({_id : CategoryUpdateResult})
    } //배열이 하나도 없으면 카테고리를 지워줌

    return res.json({success:true})
});

// @route   GET api/post/:id/edit
// @desc    Edit Post
// @access  Private
router.get("/:id/edit", auth, async(req, res, next)=> {
    try {
        //populate가 서류에 데이터를 덧붙이다는 의미가 있네
        const post = await Post.findById(req.params.id).populate("creator", "name")       
        res.json(post)
    } catch (error) {
        console.error(error)
    }
})
//미들웨어를 만들어놨기때문에 auth만 적어주면되고 front에서 토큰을 넘겨주는 작업이 필요한 것
router.post("/:id/edit", auth, async(req, res, next)=> {
    console.log(req,"api/post/:id/edit")
    //req의 body안의 것을 뽑아내고
    const {body: {title, contents, fileUrl, id}} = req
    
    try {
        const modified_post = await Post.findByIdAndUpdate(
            id, {
                title, 
                contents, 
                fileUrl, 
                date:moment().format("YYYY-MM-DD hh:mm:ss") //수정날짜
            },
            { new : true } //new를 true로 해야 update가 적용됨
        )    
        console.log(modified_post, "edit modified")
        res.redirect(`/api/post/${modified_post.id}`)
    } catch (error) {
        console.error(error)        
        next(error)
    }
})


//한 개만 내보낼 수 있음. 괄호 없이 불러올 수 있음
export default router
//export const name = () => {} 이름을 정해서 모듈 내보낼 수 있음(import 시 이름 고정), 괄호안에 적어줘야함


