//reducer 만 저장


import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import authReducer from './authReducer'
import postReducer from './postReducer';
import commentReducer from './commentReducer';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    post: postReducer,
    comment : commentReducer,
});
//connectRouter를 router로 명명하고, 
//향후에 reducer 관련 된것을 불러올때는 
//router라 이름 지은 것을 불러올것이고 이것을 계속 불러오겠다는 것
//reducer를 불러올때마다 이걸로 프론트에서 불러오도록 연결
export default createRootReducer;