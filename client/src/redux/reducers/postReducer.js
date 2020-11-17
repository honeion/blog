import { POST_LOADING_FAILURE, POST_LOADING_REQUEST, POST_LOADING_SUCCESS } from "../types";

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
        case POST_LOADING_REQUEST:
            return {
                ...state, //초기값 복사해오고, react는 비교해야하니까
                posts: [],
                loading: true,
            }
        case POST_LOADING_SUCCESS:
            return {
                ...state,
                posts: [...state.posts, ...action.payload], //기존 포스트 있으면 가져오고, 추가값은 뒤에 붙여줌
                loading: false,
            }
        case POST_LOADING_FAILURE:
            return {
                ...state,
                loading: false,
            }
        default:
            return state
    };

}

export default postReducer;