import dotenv from "dotenv"
const config = dotenv.config({
    MONGO_URL : process.env.MONGO_URL,
})
//이렇게 모듈화해서 가능
export default config;