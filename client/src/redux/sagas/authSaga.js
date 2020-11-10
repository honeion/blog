import axios from 'axios'
import { all, call, put, takeEvery, fork } from 'redux-saga/effects'
import { CLEAR_ERROR_FAILURE, CLEAR_ERROR_REQUEST, CLEAR_ERROR_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from '../types'

// Login

const loginUserAPI = (loginData) => {
    console.log(loginData, "loginData")
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    return axios.post('api/auth', loginData, config)
}

function* loginUser(rq_action) {
    try {
        const result = yield call(loginUserAPI, rq_action.payload)
        console.log(result)
        yield put({
            type: LOGIN_SUCCESS,
            payload: result.data
        })
    } catch (e) {
        yield put({
            type: LOGIN_FAILURE,
            payload: e.response
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
            type: LOGOUT_SUCCESS,
        })
    } catch (e) {
        yield put({
            type: LOGOUT_FAILURE,
        });
        console.log(e);
    }
}

function* watchLogout() {
    //항상 logout 요청을 보고 있다가 작동시켜줌
    yield takeEvery(LOGOUT_REQUEST, logout)
}


// Register

const registerUserAPI = (req) => {
    console.log("req", req)
    return axios.post('api/user', req)
}

function* registerUser(rq_action) {
    try {
        const result = yield call(registerUserAPI, rq_action.payload)
        console.log(result, "Register User Data")
        yield put({
            type: REGISTER_SUCCESS,
            payload: result.data
        })
    } catch (e) {
        yield put({
            type: REGISTER_FAILURE,
            payload: e.response
        })
    }
}

function* watchRegisterUser() {
    //매번 감시
    yield takeEvery(REGISTER_REQUEST, registerUser)
}

// clear error

function* clearError() {
    try {
        yield put({
            type: CLEAR_ERROR_SUCCESS,
        })
    } catch (e) {
        yield put({
            type: CLEAR_ERROR_FAILURE,
        })
    }
}

function* watchClearError() {
    //매번 감시
    yield takeEvery(CLEAR_ERROR_REQUEST, clearError)
}

export default function* authSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogout),
        fork(watchRegisterUser),
        fork(watchClearError)
    ])
}
