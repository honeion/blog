//server router에서 sagas와 신호를 주고 받아야함
import axios from 'axios';
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { COMMENT_LOADING_FAILURE, COMMENT_LOADING_REQUEST, COMMENT_LOADING_SUCCESS, COMMENT_UPLOADING_FAILURE, COMMENT_UPLOADING_REQUEST, COMMENT_UPLOADING_SUCCESS } from "../types";
import { push } from 'connected-react-router'
// Load Comment

const loadCommentsAPI = (payload) => {
    console.log(payload, "loadCommentAPI ID")
    //payload = post id
    return axios.get(`/api/post/${payload}/comments`)
}

function* loadComments(action){
    try {
        const result = yield call(loadCommentsAPI, action.payload)
        console.log(result)
        yield put({
            type:COMMENT_LOADING_SUCCESS,
            payload : result.data,
        })
    } catch (error) {
        console.log(error)
        yield put({
            type: COMMENT_LOADING_FAILURE,
            payload : error
        })
        yield put(push('/'))
    }
}

function* watchLoadComments(){
    yield takeEvery(COMMENT_LOADING_REQUEST, loadComments); //loading request를 매번 감시하다 있으면 loadComments를 불러옴
}

// Upload Comment

const uploadCommentsAPI = (payload) => {
    console.log(payload.id, "uploadCommentsAPI ID")
    //upload시에는 넘겨오는 데이터가 댓글관련된 폼 내용이니 id만 추출
    return axios.post(`/api/post/${payload.id}/comments`)
}

function* uploadComments(action){
    try {
        const result = yield call(uploadCommentsAPI, action.payload)
        console.log(result, "Upload Comment")
        yield put({
            type:COMMENT_UPLOADING_SUCCESS,
            payload : result.data,
        })
    } catch (error) {
        console.log(error)
        yield put({
            type: COMMENT_UPLOADING_FAILURE,
            payload : error
        })
        yield put(push('/'))
    }
}

function* watchUploadComments(){
    yield takeEvery(COMMENT_UPLOADING_REQUEST, uploadComments); 
}
export default function* commentSaga() {
    yield all([
        fork(watchLoadComments),
        fork(watchUploadComments),
    ])
}