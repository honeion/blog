import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import loadUser from "./components/auth/LoadUser";

loadUser(); //useEffect를 사용해서 할 수도 있는데 맨 앞에 달아주는게 좀 더 빠르다고 함
//useEffect는 렌더링하고 나서 해서 약간 느리다고 함


ReactDOM.render(
  <App />,
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  document.getElementById('root')
);

