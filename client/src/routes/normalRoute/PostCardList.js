import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { POST_LOADING_REQUEST } from '../../redux/types';
import { Helmet } from 'react-helmet'
import { Row } from 'reactstrap'
import { GrowingSpinner } from '../../components/spinner/Spinner';
import PostCardOne from '../../components/post/PostCardOne';
import Category from '../../components/post/Category';

const PostCardList = () => {
    const { posts, categoryFindResult, loading, postCount } = useSelector((state) => state.post) //postReducers
    const dispatch = useDispatch()
    //효과가 일어났을 때 이 작업을 함
    useEffect(() => {
        dispatch({
            type: POST_LOADING_REQUEST
        })
    }, [dispatch]) //의존성값을 넣어줘서 1번만 하고 끝나지 않도록
    return (
        <Fragment>
            <Helmet title="Home" />
            <Row className="border-bottom border-top border-primary py-2 mb-3">
                <Category posts = {categoryFindResult} />
            </Row>
            <Row>
                {posts ? <PostCardOne posts={posts} /> : GrowingSpinner}
            </Row>
        </Fragment>
    )
}

export default PostCardList;