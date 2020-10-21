import express from 'express'
import mongoose from 'mongoose'
import config from './config/index'
import hpp from 'hpp'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
//Routes
import postsRoutes from './routes/api/post'
import userRoutes from './routes/api/user'
import authRoutes from './routes/api/auth'

const app = express()
const {MONGO_URL} = config.parsed;


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
    })
    .then(()=>console.log("MongoDB connection Success!"))
    .catch((e)=>console.log(e));

//Use routes
//모든 신호 받음
app.get('/');
app.use('/api/post', postsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

export default app;