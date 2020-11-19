import axios from 'axios'
import { all, call, put, takeEvery, fork } from 'redux-saga/effects'
import { CLEAR_ERROR_FAILURE, CLEAR_ERROR_REQUEST, CLEAR_ERROR_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, USER_LOADING_FAILURE, USER_LOADING_REQUEST, USER_LOADING_SUCCESS } from '../types'

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

// User Loading
// login과 유사, 매번 로그인 하는 것(뭔가 바뀌었을때)
// 토큰만 있으면 로딩 여부를 파악할 수 있음(토큰 값만 넘겨주면 됨)
const userLoadingAPI= (token) => {
    console.log(token);
    const config = {
        headers : {
            "Content-Type" : "application/json"
        }
    }
    if(token) {
        config.headers["x-auth-token"] = token
    }
    return axios.get('api/auth/user', config)
}

function* userLoading(rq_action) {
    try {
        console.log(rq_action, " userLoading");
        const result = yield call(userLoadingAPI, rq_action.payload)
        yield put({ 
            type : USER_LOADING_SUCCESS,
            payload : result.data
        })
    } catch(e) {
        yield put({
            type : USER_LOADING_FAILURE,
            payload : e.response
        })
    }
}
 
function* watchUserLoading() {
    //매번 감시
    yield takeEvery(USER_LOADING_REQUEST, userLoading)
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
        fork(watchUserLoading),
        fork(watchRegisterUser),
        fork(watchClearError)
    ])
}
