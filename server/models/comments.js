import mongoose from "mongoose";
import moment from "moment";

const CommentSchema = new mongoose.Schema({
    contents : {
        type: String,
        required: true //내용이 있는 댓글만 허용하겠음
    },
    date : {
        type : String,
        default : moment().format("YYYY-MM-DD hh:mm:ss"),
    },
    post: {
        type:mongoose.Schema.Types.ObjectId,
        ref : "post",
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user",
    },
    creatorName: {type:String}, //작성자 이름 둬서 따로 호출안해도 되도록
});

const Comment = mongoose.model("comment",CommentSchema);

export default Comment;