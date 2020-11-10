//기본 상위 라우터
//normal - public 접근
//protected - private 접근
import React, { Fragment } from "react";
import Header from '../components/Header'
import Footer from '../components/Footer'
import AppNavbar from '../components/AppNavbar'
import { Container } from "reactstrap";
import { Redirect, Route, Switch } from "react-router-dom";
import PostCardList from "./normalRoute/PostCardList";
import PostWrite from "./normalRoute/PostWrite";
import PostDetail from "./normalRoute/PostDetail";
import Search from "./normalRoute/Search";
import CategoryResult from "./normalRoute/CategoryResult";
//위에 적은 주소 외 다른 주소는 다 홈으로 <Redirect from ="*" to="/" />
const MyRouter = () => (
    <Fragment>
        <AppNavbar />
        <Header />
        <Container id="main-body">
            <Switch>
                <Route path="/" exact component={PostCardList} />
                <Route path="/posts" exact component={PostWrite} />
                <Route path="/posts/:id" exact component={PostDetail} />
                <Route path="/posts/category/:categoryName" exact component={CategoryResult} />
                <Route path="/search/:searchTerm" exact component={Search} />
                <Redirect from="*" to="/" />
            </Switch>
        </Container>
        <Footer />
    </Fragment>
);// ()만 써서 {return ()} 생략 가능
//<Fragment></Fragment> = <></> 원래는 1개 컴포넌트만 가능했었음
export default MyRouter;