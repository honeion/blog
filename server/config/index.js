import dotenv from "dotenv"
const config = dotenv.config({
    MONGO_URL : process.env.MONGO_URL,
    JWT_SECRET : process.env.JWT_SECRET,
    PORT : process.env.PORT,
})
//이렇게 모듈화해서 가능
export default config;