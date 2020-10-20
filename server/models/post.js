//글 관련 모델
import mongoose from 'mongoose'
import moment from 'moment'

const PostSchema = new mongoose.Schema({
    title : {
        type: String,
        required : true,
        index : true // 기본적으로 제목으로 검색
    },
    contents : {
        type : String,
        required : true
    },
    views : {
        type : Number,
        default : -2 // 처음 작성한 사람도 조회수가 조회되서 -2로 두었음
    },
    fileUrl : {
        type : String,
        default : "https://source.unsplash.com/random/301x201" //썸네일을 위한 그림 파일 소스. 디폴트는 랜덤
    },
    date : {
        type : String,
        default : moment().format("YYYY-MM-DD hh:mm:ss")
    },
    category: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "category"
    },
    comments: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "comment"
        }
    ],
    creator : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
})

const Post = mongoose.model("post", PostSchema)

export default Post