//redux-saga 관련 파일 저장
import { all, fork } from 'redux-saga/effects'
import axios from 'axios'
import authSaga from './authSaga'
import dotenv from 'dotenv'
import postSaga from './postSaga'
import commentSaga from './commentSaga'
dotenv.config()
axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL

export default function* rootSaga() {
    yield all([
        fork(authSaga), //찍어서 불러옴
        fork(postSaga),
        fork(commentSaga),
    ]);
}
//function* 이 함수는 generator 함수(여러값을 반환할 수 있음)
//[] 안에 필요할 때마다 여러 값을 불러올 수 있도록 함
