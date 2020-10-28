import axios from 'axios'
import { all, call, put, takeEvery, fork } from 'redux-saga/effects'
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from '../types'

// Login

const loginUserAPI= (loginData) => {
    console.log(loginData, "loginData")
    const config = {
        headers : {
            "Content-Type" : "application/json"
        }
    }
    return axios.post('api/auth', loginData, config)
}

function* loginUser(rq_action) {
    try {
        const result = yield call(loginUserAPI, rq_action.payload)
        console.log(result)
        yield put({ 
            type : LOGIN_SUCCESS,
            payload : result.data
        })
    } catch(e) {
        yield put({
            type : LOGIN_FAILURE,
            payload : e.response
        })
    }
}
 
function* watchLoginUser() {
    //매번 감시
    yield takeEvery(LOGIN_REQUEST, loginUser)
}

//3개가 하나의 패턴으로써 작동

export default function* authSaga() {
    yield all([
        fork(watchLoginUser)
    ])
}