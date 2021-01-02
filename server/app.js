import express from 'express'
import mongoose from 'mongoose'
import config from './config/index'
import hpp from 'hpp'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path' //절대경로

//Routes
import postsRoutes from './routes/api/post'
import userRoutes from './routes/api/user'
import authRoutes from './routes/api/auth'
import searchRoutes from './routes/api/search'


const app = express()
const {MONGO_URL} = config.parsed;

const prod = process.env.NODE_ENV === "production";
console.log(prod)
//서버 보안 보완
app.use(hpp());
app.use(helmet());

//cors
//origin : ture 전부 허락, credentials cors 설정한 브라우저 헤더에 추가
app.use(cors({origin : true, credentials : true}));

//log
//개발시에 로그를 볼 수 있도록 하는 것인데 dev 개발환경에서 보도록함
app.use(morgan("dev"));

//json 형태로 브라우저에서 보내면 express에서 json 형태로 해석
app.use(express.json());




//몽고 디비 연결
mongoose
    .connect(MONGO_URL, {
            useNewUrlParser : true, //options
            useUnifiedTopology : true,
            useCreateIndex : true,
            useFindAndModify : false,
    })
    .then(()=>console.log("MongoDB connection Success!"))
    .catch((e)=>console.log(e));

//Use routes
//모든 신호 받음
// app.get('/');
app.use('/api/post', postsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

//production상태면 빌드되어있는 파일을 사용하고, express server에서 위 주소 제외하고 나머지 주소를 다 받음
//백엔드 서버 1개만 갖는데, 리액트를 빌드한 파일들을 불러와서 서버를 통해서 작동을 시킬것
if(prod) { //product상태
    app.use(express.static(path.join(__dirname,"../client/build")))
    app.get("*", (req,res)=>{
        res.sendFile(path.resolve(__dirname, "../client/build", "index.html")) //index.html 파일을 보내줌
    }) //이렇게 해줘야 라우터문제 때문에 특정주소(북마크로 저장된 것 같은)로 보내줄수 있음
}
export default app;