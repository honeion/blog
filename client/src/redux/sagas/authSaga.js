import axios from 'axios'
import { all, call, put, takeEvery, fork } from 'redux-saga/effects'
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS } from '../types'

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


//logout

function* logout(rq_action) {
    try {
        yield put({ 
            type : LOGOUT_SUCCESS,
        })
    } catch(e) {
        yield put({
            type : LOGOUT_FAILURE,
        });
        console.log(e);
    }
}
 
function* watchLogout() {
    //항상 logout 요청을 보고 있다가 작동시켜줌
    yield takeEvery(LOGOUT_REQUEST, logout)
}

export default function* authSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogout)
    ])
}