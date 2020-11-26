import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {} from 'react-helmet' // 상단 이름 바꿔줌
import { POST_DETAIL_LOADING_REQUEST , POST_DELETE_REQUEST, USER_LOADING_REQUEST } from '../../redux/types'
import { Button, Col, Row } from 'reactstrap'
import {} from '@ckeditor/ckeditor5-react'
import { Link } from 'react-router-dom'
const PostDetail = (req) => {
    const dispatch = useDispatch()
    const { postDetail, creatorId, title, loading } = useSelector((state)=>state.post) //reducer
    const { userId, userName } = useSelector((state)=>state.auth)
    console.log(req)
    useEffect(()=>{
        dispatch({
            type: POST_DETAIL_LOADING_REQUEST,
            payload : req.match.params.id,
        });
        //글쓴 user만 지울 수 있도록 유저정보도 가져옴
        //localStorage는 f12 application에 storage에 있음
        dispatch({
            type : USER_LOADING_REQUEST,
            payload : localStorage.getItem("token"),
        });
    }, []); //의존성 빈배열을 넣지 않으면 무한 반복
    //type을 dispatch로 날리면 saga에서 server측에 요청을 하고
    //react 작성할 때 container, presenter 나눠서 하는 방이 있는데
    //이런 위의 정보들은 container로 아래 return 하는 내용은 presenter로 나눌 수 있음


    //creator만 지울 수 있어야함
    const onDeleteClick = () => {
        dispatch({
            type: POST_DELETE_REQUEST,
            payload : {
                id : req.match.params.id,
                token : localStorage.getItem("token")
            }
        })
    }

    const EditButton = (
        <Fragment>
            <Row className = "d-flex justify-content-center pb-3">
                <Col className ="col-md-3 mr-md-3">
                    <Link to="/" className="btn btn-primary btn-block">
                        Home
                    </Link>
                </Col>
                <Col className ="col-md-3 mr-md-3">
                    <Link to={`/post/${req.match.params.id}/edit`} className="btn btn-success btn-block">
                        Edit Post
                    </Link>
                </Col>
                <Col className ="col-md-3">
                    <Button className="btn-danger btn-block" onClick={onDeleteClick}>
                        Delete
                    </Button>
                </Col>
            </Row>
        </Fragment>
    )
    //ckeditor때문에 detail, edit, write 다 따로 처리(거의 유사하지만)

    //인증 안된 경우
    const HomeButton = (
        <Fragment>
            <Row className="d-flex justify-content-center pb-3">
                <Col className="col-sm-12 col-md-3">
                    <Link to="/" className="btn btn-primary btn-block">
                        Home
                    </Link>
                </Col>
            </Row>
        </Fragment>
    )

    console.log(title);
    return <h1>PostDetail</h1>;
}

export default PostDetail;