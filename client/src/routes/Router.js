//기본 상위 라우터
//normal - public 접근
//protected - private 접근
import React, { Fragment } from "react";
import Header from '../components/Header'
import Footer from '../components/Footer'
import AppNavbar from '../components/AppNavbar'
const MyRouter = () => (
    <Fragment>
        <AppNavbar/>
        <Header/>
        <h1>Hello Body</h1>
        <Footer/>
    </Fragment>
);// ()만 써서 {return ()} 생략 가능
//<Fragment></Fragment> = <></> 원래는 1개 컴포넌트만 가능했었음
export default MyRouter;