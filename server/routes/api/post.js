import express from 'express'

// Model
import Post from '../../models/post'

const router = express.Router()

// api/post
router.get('/' , async(req, res)=> {
    const postFindResult = await Post.find(); //몽고디비에서 모든 것 가져옴
    console.log(postFindResult, "ALL Post Get");
    res.json(postFindResult) //마지막 줄에 응답이 나가야함
})

router.post('/' , async(req, res) => {
    try{
        console.log(req, "req");
        const { title , contents, fileUrl, creator } = req.body;
        //req.body.title, req.body.contents ...
        const newPost = await Post.create({
            title : title, 
            contents, fileUrl, creator // 똑같으면 생략도 가능
        }); //async await 안쓰고 .exec() 붙여서 실행해도 가능
        res.json(newPost);
    } catch(e){
        console.log(e);
    }
})
//한 개만 내보낼 수 있음. 괄호 없이 불러올 수 있음
export default router
//export const name = () => {} 이름을 정해서 모듈 내보낼 수 있음(import 시 이름 고정), 괄호안에 적어줘야함