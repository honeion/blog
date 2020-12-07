import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet' // 상단 이름 바꿔줌
import { POST_DETAIL_LOADING_REQUEST , POST_DELETE_REQUEST, USER_LOADING_REQUEST } from '../../redux/types'
import { Button, Col, Container, Row } from 'reactstrap'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Link } from 'react-router-dom'
import { GrowingSpinner } from '../../components/spinner/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faCommentDots, faMouse} from '@fortawesome/free-solid-svg-icons'
import BallonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor'
import { editorConfiguration } from '../../components/editor/EditorConfig'
import Comments from '../../components/comments/Comments'


const PostDetail = (req) => {
    const dispatch = useDispatch()
    const { postDetail, creatorId, title, loading } = useSelector((state)=>state.post) //reducer
    const { userId, userName } = useSelector((state)=>state.auth)
    const { comments } = useSelector((state)=>state.comment)
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
    }, [dispatch, req.match.params.id]); //의존성 빈배열을 넣지 않으면 무한 반복
    //type을 dispatch로 날리면 saga에서 server측에 요청을 하고
    //react 작성할 때 container, presenter 나눠서 하는 방이 있는데
    //이런 위의 정보들은 container로 아래 return 하는 내용은 presenter로 나눌 수 있음


    //creator만 지울 수 있어야함
    //delete 같은경우는 reducer말고 saga만 필요(딱히 상태변화가 없기때문)
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
                    <Link to={`/posts/${req.match.params.id}/edit`} className="btn btn-success btn-block">
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
    console.log(userId," == ", creatorId, userId === creatorId)
    const Body = (
        <>
        {userId === creatorId ? EditButton : HomeButton}
        <Row className="border-bottom border-top border-primary p-2 mb-3 d-flex justify-content-between">
            {(()=>{
                if(postDetail && postDetail.creator){
                    return(
                        <Fragment>
                            <div className="font-weight-bold text-big">
                                <span className="mr-3">
                                    <Button color="info">
                                        {postDetail.category.categoryName}
                                    </Button>
                                </span>
                                <span>{postDetail.title}</span>
                            </div>
                            <div className="align-self-end">
                            {postDetail.creator.name}
                            </div>
                        </Fragment>
                    );
                }
            })()}
        </Row>
        {postDetail && postDetail.comments ? (
            <Fragment>
                <div className= "d-flex justify-content-end align-items-baseline small">
                    <FontAwesomeIcon icon={faPencilAlt}/>
                    &nbsp;
                    <span> {postDetail.date} </span>
                    &nbsp; &nbsp;
                    <FontAwesomeIcon icon={faCommentDots}/>
                    &nbsp;
                    <span>{postDetail.comments.length}</span>
                    &nbsp; &nbsp;
                    <FontAwesomeIcon icon={faMouse}/>
                    <span>{postDetail.views}</span>
                </div>
                <Row className = "mb-3">
                    <CKEditor
                        editor={BallonEditor}
                        data={postDetail.contents}
                        config={editorConfiguration}
                        disabled="true"
                    />
                </Row>
                <Row>
                    <Container className="mb-3 border border-blue rounded">
                        {
                            Array.isArray(comments) ? comments.map(
                                ({contents, creator, date, _id, creatorName})=> (
                                    <div key={_id}>
                                        <Row className ="justify-content-between p-2">
                                            <div className="font-weight-bold">
                                                {creatorName ? creatorName : creator}
                                            </div>
                                            <div className="text-small">
                                                <span className="font-weight-bold">
                                                    {date.split(" ")[0]}
                                                </span>
                                                <span className="font-weight-light">
                                                    {" "}
                                                    {date.split(" ")[1]}
                                                </span>
                                            </div>
                                        </Row>
                                        <Row className="p-2">
                                            <div>
                                                {contents}
                                            </div>
                                        </Row>
                                        <hr/>
                                    </div>
                                    )
                                ) 
                            : "Creator"
                        }
                        <Comments 
                            id={req.match.params.id}
                            userId={userId}
                            userName={userName}
                        />
                    </Container>
                </Row>
            </Fragment>
        ): <div></div>}
        </>
    ) //Comments는 너무 길어져서 모듈로 뺌. 많이 빼야 리렌더링을 비교적 줄일수 있음. userId는 auth에서 가져오고 있음
    //function()처럼 실행한다는 의미로 (()=>{})() 익명함수 뒤에 ()추가 해줘야함
    //ClassicEditor를 볼 때도 에디터 사용해서 보지않으면 글씨가 작성했던것과 달라서
    // BallonEditor는 테두리 없는 깔끔한 에디터를 사용
    return (
        <div>
            <Helmet title={`Post | ${title}`}/>
            {loading === true ? GrowingSpinner : Body}
        </div>
    );
}

export default PostDetail;