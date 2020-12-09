import React, { Fragment, useCallback, useEffect, useState } from "react"
import { Collapse, Container, Navbar, NavbarToggler, Nav, NavItem, Form, Button } from "reactstrap"
import { Link } from "react-router-dom"
import LoginModal from "../components/auth/LoginModal"
import { useDispatch, useSelector } from "react-redux"
import { LOGOUT_REQUEST } from "../redux/types"
import RegisterModal from "./auth/RegisterModal"
import SearchInput from "./search/SearchInput"
const AppNavbar = () => {
    //인증되었을때 변화
    const [isOpen, setIsOpen] = useState(false);//처음엔 닫아진 상태
    const { isAuthenticated, user, userRole } = useSelector((state) => state.auth) //authReducer에 정의한 값

    //babel plugin으로 배포단계에서 console.log 제거할 것
    //console.log(isAuthenticated, "isAuthenicated", user, "user", userRole, "UserRole");
    //로그아웃
    const dispatch = useDispatch()

    const onLogout = useCallback(() => { //useEffect랑 구조적으로 유사하지만 메모이제이션된 콜백을 반환함([a,b] 이러한 의존성값을 변화될때만 새로 그려주는 형태)
        dispatch({
            type: LOGOUT_REQUEST
        })
    }, [dispatch]) //dispatch가 변할때마다 다시 그려줌

    useEffect(() => {
        setIsOpen(false)
    }, [user]) //user가 변했을때 Open을 변화시켜줌(collection을 여닫을때 사용)
    //모바일 화면에서 로그인하고 나서는 햄버거 버튼이 다시 닫히게 하고자.

    const handleToggle = () => {
        setIsOpen(!isOpen) //열렸든 닫혔든 토글이 되도록 함수 달아줌
    }
    //isOpen 변수를 통해 Collapse를 여닫는데 isAuthenticated 따라 되도록함

    const addPostClick = () => {

    }
    //Link 버튼은 화면에서 바로 이동하므로 react-router-dom 사용함
    //store auth의 user를 가져왔는데 
    //처음에 react는 빈값으로 렌더링하고, 이후 react가 값을 가져왔는데 
    //조건식으로 달아주면 undefined라고 가져오는 경우 찾기 좋다
    //뒤에 block은 꽉채우는 방식
    const authLink = (
        <Fragment>
            <NavItem>
                {userRole === "Developer" ? (
                    <Form className="col mt-2">
                        <Link to="/posts" className="btn btn-success block text-white px-3" onClick={addPostClick}>
                            Add Post
                        </Link>
                    </Form>
                ) : ""}
            </NavItem>
            <NavItem className="d-flex justify-content-center">
                <Form className="col mt-2">
                    {user && user.name ? (
                        <Link to="#">
                            <Button outline color="light" className="px-3" block>
                                <strong>{user ? `Welcome ${user.name}` : ""}</strong>
                            </Button>
                        </Link>
                    ) :
                        <Button outline color="light" className="px-3" block>
                            <strong>No User</strong>
                        </Button>
                    }
                </Form>
            </NavItem>
            <NavItem>
                <Form className="col">
                    <Link onClick={onLogout} to="#">
                        <Button outline color="light" className="mt-2" block>
                            Sign out
                        </Button>
                    </Link>
                </Form>
            </NavItem>
        </Fragment>
    )
    const guestLink = (
        <Fragment>
            <NavItem >
                <RegisterModal />
            </NavItem>
            <NavItem >
                <LoginModal />
            </NavItem>
        </Fragment>
    )
    return (
        <Fragment>
            <Navbar id="navbar" expand="lg" className="sticky-top">
                <Container>
                    <Link to="/" className="text-white text-decoration-none">
                        Side Project's Blog(Honeion Blog)
                    </Link>
                    <NavbarToggler onClick={handleToggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <SearchInput isOpen={isOpen}/>
                        <Nav className="ml-auto d-flex justify-content-around" navbar>
                            {isAuthenticated ? authLink : guestLink}
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </Fragment>
    )
}

export default AppNavbar;