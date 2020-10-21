import app from './app'
import config from './config/index'

const { PORT } = config.parsed

//7000포트를 받고 있고
app.listen(PORT,() => {
    // console.log('server running...') ``이용해서 문장에 변수값
    console.log(`Server stated on Port ${PORT}`);
});
