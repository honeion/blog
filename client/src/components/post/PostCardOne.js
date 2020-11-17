import React, { Fragment } from 'react'
import { Badge, Button, Card, CardBody, CardImg, CardTitle, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMouse } from '@fortawesome/free-solid-svg-icons'

//재사용할 수 있는 Container presenter 구조를 쓰는게 좋음
//구조분해로 posts만 꺼내옴
// 카드 전체를 링크로 감쌈
// truncate 길면 ...으로 표시
// d-flex justify-content-between 양 사이드로 값을 넣음
const PostCardOne = ({ posts }) => {
    return (
        <Fragment>
            {Array.isArray(posts) ?
                posts.map(({ _id, title, fileUrl, comments, views }) => {
                    return (
                        <div key={_id} className="col-md-4">
                            <Link to={`/posts/${_id}`} className="text-dark text-decoration-none">
                                <Card className="mb-3">
                                    <CardImg top alt="카드 이미지" src={fileUrl} />
                                    <CardBody>
                                        <CardTitle className="text-truncate d-flex justify-content-between">
                                            <span className="text-truncate">{title}</span>
                                            <span>
                                                <FontAwesomeIcon icon={faMouse} />
                                        &nbsp;&nbsp;
                                        <span>{views}</span>
                                            </span>
                                        </CardTitle>
                                        <Row>
                                            <Button color="primary" className="p-2 btn-block">
                                                More <Badge color="light">{comments.length}</Badge>
                                            </Button>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Link>
                        </div>
                    );
                })
                : <div></div>}
        </Fragment>
    )
}

export default PostCardOne;