import axios from 'axios'
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { CATEGORY_FIND_FAILURE, CATEGORY_FIND_REQUEST, CATEGORY_FIND_SUCCESS, POST_DELETE_FAILURE, POST_DELETE_REQUEST, POST_DELETE_SUCCESS, POST_DETAIL_LOADING_FAILURE, POST_DETAIL_LOADING_REQUEST, POST_DETAIL_LOADING_SUCCESS, POST_EDIT_LOADING_FAILURE, POST_EDIT_LOADING_REQUEST, POST_EDIT_LOADING_SUCCESS, POST_EDIT_UPLOADING_FAILURE, POST_EDIT_UPLOADING_REQUEST, POST_EDIT_UPLOADING_SUCCESS, POST_LOADING_FAILURE, POST_LOADING_REQUEST, POST_LOADING_SUCCESS, POST_UPLOADING_FAILURE, POST_UPLOADING_REQUEST, POST_UPLOADING_SUCCESS, SEARCH_FAILURE, SEARCH_REQUEST, SEARCH_SUCCESS } from '../types'

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

// Post Delete
const deletePostAPI = (payload) => {
    const config = {
        headers: {
            "Content-Type" : "application/json"
        }
    }
    const token = payload.token
    if(token){
        config.headers["x-auth-token"] = token
    }
    return axios.delete(`/api/post/${payload.id}`,config);
}
//action이 넘어옴
function* deletePosts(action) { 
    try {
        const result = yield call(deletePostAPI, action.payload) 
        yield put({
            type: POST_DELETE_SUCCESS,
            payload: result.data,
        });
        yield put(push("/"));
    } catch (e) {
        yield put({
            type: POST_DELETE_FAILURE,
            payload: e,
        }) 
    }
}
function* watchDeletePost() {
    yield takeEvery(POST_DELETE_REQUEST, deletePosts)
}

// Post Edit Load 
const loadEditPostAPI = (payload) => {
    const config = {
        headers: {
            "Content-Type" : "application/json"
        }
    }
    const token = payload.token
    if(token){
        config.headers["x-auth-token"] = token
    }
    return axios.get(`/api/post/${payload.id}/edit`,config);
}

function* loadEditPosts(action) { 
    try {
        const result = yield call(loadEditPostAPI, action.payload) 
        yield put({
            type: POST_EDIT_LOADING_SUCCESS,
            payload: result.data,
        });
    } catch (e) {
        yield put({
            type: POST_EDIT_LOADING_FAILURE,
            payload: e,
        }) 
        yield put(push("/"));
    }
}
function* watchLoadEditPost() {
    yield takeEvery(POST_EDIT_LOADING_REQUEST, loadEditPosts)
}

// Post Edit UpLoad 
const uploadEditPostAPI = (payload) => {
    const config = {
        headers: {
            "Content-Type" : "application/json"
        }
    }
    const token = payload.token
    if(token){
        config.headers["x-auth-token"] = token
    }
    //config 앞에 payload가 있어야 const token = payload.token 가능
    return axios.post(`/api/post/${payload.id}/edit`, payload, config);
}

function* uploadEditPosts(action) { 
    try {
        const result = yield call(uploadEditPostAPI, action.payload) 
        yield put({
            type: POST_EDIT_UPLOADING_SUCCESS,
            payload: result.data,
        });
        yield put(push(`/posts/${result.data._id}`));
    } catch (e) {
        yield put({
            type: POST_EDIT_UPLOADING_FAILURE,
            payload: e,
        }) 
    }
    
}
function* watchUploadEditPost() {
    yield takeEvery(POST_EDIT_UPLOADING_REQUEST, uploadEditPosts)
}

// Category Find
const categoryFindAPI = (payload) => {
    console.log(payload)
    //utf-8
    return axios.get(`/api/post/category/${encodeURIComponent(payload)}`);
}

function* categoryFind(action) { 
    try {
        const result = yield call(categoryFindAPI, action.payload) 
        yield put({
            type: CATEGORY_FIND_SUCCESS,
            payload: result.data,
        });
    } catch (error) {
        yield put({
            type: CATEGORY_FIND_FAILURE,
            payload: error,
        }) 
    }
    
}
function* watchCategoryFindPost() {
    yield takeEvery(CATEGORY_FIND_REQUEST, categoryFind)
}

// Search
const searchResultAPI = (payload) => {
    console.log(payload)
    //utf-8
    return axios.get(`/api/search/${encodeURIComponent(payload)}`);
}

function* searchResult(action) { 
    try {
        const result = yield call(searchResultAPI, action.payload) 
        yield put({
            type: SEARCH_SUCCESS,
            payload: result.data,
        });
        //바로 넘어가도록
        yield put(push(`/search/${encodeURIComponent(action.payload)}`))
    } catch (error) {
        yield put({
            type: SEARCH_FAILURE,
            payload: error,
        }) 
        yield put(push('/'));
    }
    
}
function* watchSearchResult() {
    yield takeEvery(SEARCH_REQUEST, searchResult)
}

export default function* postSaga() {
    yield all([
        fork(watchLoadPost),
        fork(watchUploadPost),
        fork(watchloadPostDetail),
        fork(watchDeletePost),
        fork(watchLoadEditPost),
        fork(watchUploadEditPost),
        fork(watchCategoryFindPost),
        fork(watchSearchResult)
    ]);
}