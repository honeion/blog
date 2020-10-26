//러닝커브가 redux 덕분에 높음

import {createStore, compose, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {createBrowserHistory} from 'history'
import {routerMiddleware} from 'connected-react-router'

import createRootReducer from './redux/reducers/index'
import rootSaga from './redux/sagas'

export const history = createBrowserHistory()

const sagaMiddleware = createSagaMiddleware()

const initialState = {}

const middlewares = [sagaMiddleware, routerMiddleware(history)] //미들웨어 필요하면 더 추가
const devtools = windows.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__//chrome같은 곳에서 어떻게 상태가 진행되는지 볼 수 있는 것

const composeEnhancer = process.env.NODE_ENV ==='production' ? compose : devtools || compose; 
//개발자 도구를 배포환경에서는 안보이도록

const store = createStore(
    createRootReducer(history),
    initialState, 
    //web의 모든 상태를 담고있는 초기값. 대규모의 웹에서는 위에서부터 아래로 값을 가져와야해서 
    //리덕스를 통해 리듀서 한곳에서 모든 상태값을 저장해서 필요한 곳에서 상태값을 끄집어내서 사용
    composeEnhancer(applyMiddleware(...middlewares)) //복사해오고
)
sagaMiddleware.run(rootSaga) //작동

export default store