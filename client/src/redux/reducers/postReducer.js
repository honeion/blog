import { CATEGORY_FIND_FAILURE, CATEGORY_FIND_REQUEST, CATEGORY_FIND_SUCCESS, POST_DETAIL_LOADING_FAILURE, POST_DETAIL_LOADING_REQUEST, POST_DETAIL_LOADING_SUCCESS, POST_EDIT_LOADING_FAILURE, POST_EDIT_LOADING_REQUEST, POST_EDIT_LOADING_SUCCESS, POST_EDIT_UPLOADING_FAILURE, POST_EDIT_UPLOADING_REQUEST, POST_EDIT_UPLOADING_SUCCESS, POST_LOADING_FAILURE, POST_LOADING_REQUEST, POST_LOADING_SUCCESS, POST_UPLOADING_FAILURE, POST_UPLOADING_REQUEST, POST_UPLOADING_SUCCESS, SEARCH_FAILURE, SEARCH_REQUEST, SEARCH_SUCCESS } from "../types";

const initialState = {
    isAuthenticated: null, //인증이 된 사람만 글을 써야함
    posts: [],
    postDetail: "",
    postCount: "", // 추후에 inifity scroll 만들때 post 개수
    loading: false,
    error: "",
    creatorId: "",
    categoryFindResult: "",
    title: "",
    searchBy: "", // 검색기능
    searchResult: ""

}

const postReducer = (state = initialState, action) => {
    //초기값은 initialState
    switch (action.type) {
        //LOADING
        case POST_LOADING_REQUEST:
            return {
                ...state, //초기값 복사해오고, react는 비교해야하니까
                //posts: [], 이제는 누적시켜야함
                loading: true,
            }
        case POST_LOADING_SUCCESS:
            return {
                ...state,
                posts: [...state.posts, ...action.payload.postFindResult], //기존 포스트 있으면 가져오고, 추가값은 뒤에 붙여줌
                categoryFindResult : action.payload.categoryFindResult,
                postCount : action.payload.postCount, //infinity scroll에서 추가
                loading: false,
            }
        case POST_LOADING_FAILURE:
            return {
                ...state,
                loading: false,
            }
        //UPLOADING
        case POST_UPLOADING_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case POST_UPLOADING_SUCCESS:
            return {
                ...state,
                posts : action.payload,
                isAuthenticated : true,
                loading: false,
            };
        case POST_UPLOADING_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        //DETAIL LOADING
        case POST_DETAIL_LOADING_REQUEST:
            return {
                ...state,
                posts: [],
                loading: true,
            };
        case POST_DETAIL_LOADING_SUCCESS:
            return {
                ...state,
                postDetail: action.payload,
                creatorId: action.payload.creator._id,
                title: action.payload.title,
                loading: false,
            };
        case POST_DETAIL_LOADING_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        //EDIT LOADING
        case POST_EDIT_LOADING_REQUEST:
            return {
                ...state,
                posts: [], //모든 포스트 불러올때 저장해놓는 배열
                loading: true,
            };
        case POST_EDIT_LOADING_SUCCESS:
            return {
                ...state,
                postDetail: action.payload,
                loading: false,
            };
        case POST_EDIT_LOADING_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        //EDIT UPLOADING
        case POST_EDIT_UPLOADING_REQUEST:
            return {
                ...state, //기존 상태 그대로
                loading: true,
            };
        case POST_EDIT_UPLOADING_SUCCESS:
            return {
                ...state,
                posts: action.payload, //uploading 성공했을때 인증된 사람만 해야하고
                isAuthenticated : true,
                loading: false,
            };
        case POST_EDIT_UPLOADING_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        //CATEGORY FIND
        case CATEGORY_FIND_REQUEST:
            return {
                ...state, 
                posts: [], //카테고리 찾고 홈으로 넘어가면 홈의 포스트랑 겹쳐서 일단 날려줘야함
                loading: true,
            };
        case CATEGORY_FIND_SUCCESS:
            return {
                ...state,
                categoryFindResult : action.payload,
                loading: false,
            };
        case CATEGORY_FIND_FAILURE:
            return {
                ...state,
                categoryFindResult : action.payload,
                loading: false,
            };
        //SEARCH FIND
        case SEARCH_REQUEST:
            return {
                ...state, 
                posts: [], 
                searchBy : action.payload, //인풋창에서 사용할 state
                loading: true,
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                searchBy : action.payload, //검색된 화면에서 보여줄 화면
                searchResult : action.payload,
                loading: false,
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                searchResult : action.payload,
                loading: false,
            };
        default:
            return state
    };

}

export default postReducer;
//server->reducer,saga->front식으로 개발
//reducer에서 상태부분 이상생길 수 있음(saga나 server에 비해 명확하지 않음)