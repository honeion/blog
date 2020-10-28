import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, CLEAR_ERROR_REQUEST, CLEAR_ERROR_SUCCESS, CLEAR_ERROR_FAILURE } from '../types'
//초기값 - store에 있는 것과 동일하게 선언해야함
const initialState = {
    token : localStorage.getItem('token'),
    isAuthenticated : null,
    isLoading : false,
    user : "",
    userId : "",
    userName : "",
    userRole : "",
    errorMsg : "",
    successMsg : ""
}

const authReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN_REQUEST :
            return {
                ...state, //리덕스 쓸 때 기존 상태 복사(얕은복사) 해줘야함
                isLoading : true,
                errorMsg: ""
            }
        case LOGIN_SUCCESS :
            localStorage.setItem("token", action.payload.token); //백에서 가져온 페이로드에서 토큰값을 세팅해줌
            return {
                ...state,
                ...action.payload,
                user            : action.payload.user,
                userId          : action.payload.user.id,
                userRole        : action.payload.user.role,
                isAuthenticated : true,
                isLoading       : false,
                errorMsg        : ""
            }
        case LOGIN_FAILURE :
            localStorage.removeItem("token");
            return {
                ...state,
                ...action.payload,
                token           : null,
                user            : null,
                userId          : null,
                userRole        : null,
                isAuthenticated : false,
                isLoading       : false,
                errorMsg        : action.payload.data.msg
            }
        case CLEAR_ERROR_REQUEST :
            return {
                ...state, 
                errorMsg: ""
            }
        case CLEAR_ERROR_SUCCESS :
                return {
                    ...state, 
                    errorMsg: ""
                }
        case CLEAR_ERROR_FAILURE :
            return {
                ...state, 
                errorMsg: ""
            }
        default:
            return state
            
    }
}

export default authReducer;