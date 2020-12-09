import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, CLEAR_ERROR_REQUEST, CLEAR_ERROR_SUCCESS, CLEAR_ERROR_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE, USER_LOADING_REQUEST, USER_LOADING_SUCCESS, USER_LOADING_FAILURE, REGISTER_FAILURE, REGISTER_SUCCESS, REGISTER_REQUEST, PASSWORD_EDIT_UPLOADING_SUCCESS, PASSWORD_EDIT_UPLOADING_FAILURE, PASSWORD_EDIT_UPLOADING_REQUEST } from '../types'
//초기값 - store에 있는 것과 동일하게 선언해야함
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: "",
    userId: "",
    userName: "",
    userRole: "",
    errorMsg: "",
    successMsg: "",
    previousMatchMsg : "" //이전 것과 맞는지
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case LOGOUT_REQUEST: //로그아웃 request는 동일
            return {
                ...state, //리덕스 쓸 때 기존 상태 복사(얕은복사) 해줘야함
                isLoading: true,
                errorMsg: ""
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem("token", action.payload.token); //백에서 가져온 페이로드에서 토큰값을 세팅해줌
            return {
                ...state,
                ...action.payload,
                user: action.payload.user,
                userId: action.payload.user.id,
                userRole: action.payload.user.role,
                isAuthenticated: true,
                isLoading: false,
                errorMsg: ""
            }
        case LOGOUT_SUCCESS:
            localStorage.removeItem("token");
            return {
                token: null,
                user: null,
                userId: null,
                userRole: null,
                isAuthenticated: false,
                isLoading: false,
                errorMsg: ""
            }
        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case LOGOUT_FAILURE:
            localStorage.removeItem("token");
            return {
                ...state,
                ...action.payload,
                token: null,
                user: null,
                userId: null,
                userRole: null,
                isAuthenticated: false,
                isLoading: false,
                errorMsg: action.payload.data.msg
            }
        
        case USER_LOADING_REQUEST :
            return {
                ...state, 
                isLoading : true,
            }
        case USER_LOADING_SUCCESS :
            return {
                ...state, 
                isAuthenticated : true,
                isLoading : false,
                user : action.payload, //하나에서 뽑아도 되지만 그냥 따로 빼서 쉽게 처리
                userId : action.payload._id,
                userName : action.payload.name,
                userRole : action.payload.role,
            }
        case USER_LOADING_FAILURE :
            return {
                ...state, 
                isAuthenticated : false,
                isLoading : false,
                user : null,
                userRole : "",
            }
        case PASSWORD_EDIT_UPLOADING_REQUEST :
            return {
                ...state, 
                isLoading : true,
            }
        case PASSWORD_EDIT_UPLOADING_SUCCESS :
            return {
                ...state, 
                isLoading : false,
                successMsg : action.payload.success_msg,
                errorMsg: "",
                previousMatchMsg : ""
            }
        case PASSWORD_EDIT_UPLOADING_FAILURE :
            return {
                ...state, 
                isLoading   : false,
                successMsg  : "",
                errorMsg    : action.payload.fail_msg,
                previousMatchMsg : action.payload.match_msg
            }
        // submit 버튼을 눌렀을때 에러를 모두 날려줄 것
        case CLEAR_ERROR_REQUEST:
            return {
                ...state,
            }
        case CLEAR_ERROR_SUCCESS: //에러를 모두 날린다.
            return {
                ...state,
                errorMsg: "",
                previousMatchMsg : "",
            }
        case CLEAR_ERROR_FAILURE:
            return {
                ...state,
                errorMsg: "Clear Error Fail(em)",
                previousMatchMsg: "Clear Error Fail (pmm)",
            }
        default:
            return state
    }
}

export default authReducer;