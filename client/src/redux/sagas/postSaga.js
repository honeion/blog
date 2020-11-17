import axios from 'axios'
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { POST_LOADING_FAILURE, POST_LOADING_REQUEST, POST_LOADING_SUCCESS } from '../types'

// All Posts load

const loadPostAPI = () => {
    return axios.get("/api/post")
}

function* loadPosts() {
    try {
        const result = yield call(loadPostAPI) //api에서 불러온것
        console.log(result, "loadPosts")
        yield put({
            type: POST_LOADING_SUCCESS,
            payload: result.data
        })
    } catch (e) {
        yield put({
            type: POST_LOADING_FAILURE,
            payload: e
        }) // 로딩실패했으면 에러 넘기고 홈으로 보내기
        yield push("/")
    }
}
function* watchLoadPost() {
    yield takeEvery(POST_LOADING_REQUEST, loadPosts)
}

export default function* postSaga() {
    yield all([
        fork(watchLoadPost),
    ]);
}