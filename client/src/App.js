import React from "react";
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './store'
import MyRouter from './routes/Router'

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/custom.scss";

const App = () => {
  return (
    //모든 상태관리는 store에서 하므로 최상위에 존재
    //Router를 history이용해서 하고
    //MyRouter에서 스위치을 통해 주소가 들어올때마다 상태를 변화
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MyRouter />
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
