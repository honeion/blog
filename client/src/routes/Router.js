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
import { EditProtectedRoute, ProfileProtectedRoute } from "./protectedRoute/ProtectedRoute";
import PostEdit from "./normalRoute/PostEdit";
import Profile from "./normalRoute/Profile";
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
                {/* <Route path="/posts/:id/edit" exact component={PostEdit} /> */}
                <EditProtectedRoute path="/posts/:id/edit" exact component={PostEdit}/>
                <ProfileProtectedRoute path="/user/:userName/profile" exact component={Profile}/>
                <Redirect from="*" to="/" />
            </Switch>
        </Container>
        <Footer />
    </Fragment>
);// ()만 써서 {return ()} 생략 가능
//<Fragment></Fragment> = <></> 원래는 1개 컴포넌트만 가능했었음
//edit은 기존 주소 뒤에 /edit만 붙여서 수정가능하면 보안적 문제가 있기때문에 protected
//실제로 로그아웃 후 edit을 붙여서 들어가보았으나 401떴었음
//그때 새로 로그인을 하니, postDetail을 제대로 읽어오지 못해서 새로고침해도 계속 에러가 있었고 페이지 갱신이 안되었음(강제로는 가능)
//EditProtectedRoute로 똑같은 테스트를 해보니 바로 홈으로 이동되었음
export default MyRouter;