import axios from 'axios'
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { POST_DETAIL_LOADING_FAILURE, POST_DETAIL_LOADING_REQUEST, POST_DETAIL_LOADING_SUCCESS, POST_LOADING_FAILURE, POST_LOADING_REQUEST, POST_LOADING_SUCCESS, POST_UPLOADING_FAILURE, POST_UPLOADING_REQUEST, POST_UPLOADING_SUCCESS } from '../types'

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
        yield put(push("/"));
    }
}
function* watchLoadPost() {
    yield takeEvery(POST_LOADING_REQUEST, loadPosts)
}

// Post Upload 

const uploadPostAPI = (payload) => {
    const token = payload.token;
    console.log(payload);
    const config = {
        headers : {
            "Content-Type" : "application/json"
        }
    }
    if(token) {
        config.headers["x-auth-token"] = token
    }
    return axios.post('api/post', payload, config)
}
//action이 넘어옴
function* uploadPosts(action) { 
    try {
        console.log(action, "uploadPosts function"); 
        const result = yield call(uploadPostAPI, action.payload) 
        console.log(result, "uploadPostAPI, aciton.payload")
        yield put({
            type: POST_UPLOADING_SUCCESS,
            payload: result.data,
        });
        //front에 작성된 글로 넘어가도록 함
        yield put(push(`/posts/${result.data._id}`))

    } catch (e) {
        console.log(action);
        yield put({
            type: POST_UPLOADING_FAILURE,
            payload: e
        }) 
        yield put(push("/"));
    }
}
function* watchUploadPost() {
    yield takeEvery(POST_UPLOADING_REQUEST, uploadPosts)
}


// Post Detail
const loadPostDetailAPI = (payload) => {
    console.log(payload, "id")
    return axios.get(`api/post/${payload}`);
}
//action이 넘어옴
function* loadPostDetails(action) { 
    try {
        const result = yield call(loadPostDetailAPI, action.payload) 
        console.log(result, "post detail_saga data")
        yield put({
            type: POST_DETAIL_LOADING_SUCCESS,
            payload: result.data,
        });

    } catch (e) {
        yield put({
            type: POST_DETAIL_LOADING_FAILURE,
            payload: e,
        }) 
        yield put(push("/"));
    }
}
function* watchloadPostDetail() {
    yield takeEvery(POST_DETAIL_LOADING_REQUEST, loadPostDetails)
}


export default function* postSaga() {
    yield all([
        fork(watchLoadPost),
        fork(watchUploadPost),
        fork(watchloadPostDetail),
    ]);
}