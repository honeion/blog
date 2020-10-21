//유저 관련 모델
import mongoose from 'mongoose'
import moment from 'moment'

//Create Schema
const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ["Developer" , "Collaborator", "User"],
        default : "User",
    },
    register_date : {
        type : Date,
        default : moment().format("YYYY-MM-DD hh:mm:ss"),
    },
    comments: [
        {
            post_id : { //관련된것 모두 지우기위함
                type: mongoose.Schema.Types.ObjectId,
                ref : "post",
            },
            comment_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref : "comment",
            }
        }
    ],
    posts: [
        {
            post_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref : "post",
            },
        }
    ],
});

const User = mongoose.model("user", UserSchema);

export default User;