import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { POST_LOADING_REQUEST } from '../../redux/types';
import { Helmet } from 'react-helmet'
import { Alert, Row } from 'reactstrap'
import { GrowingSpinner } from '../../components/spinner/Spinner';
import PostCardOne from '../../components/post/PostCardOne';
import Category from '../../components/post/Category';

const PostCardList = () => {
    const { posts, categoryFindResult, loading, postCount } = useSelector((state) => state.post) //postReducers
    const dispatch = useDispatch()
    //효과가 일어났을 때 이 작업을 함
    useEffect(() => {
        dispatch({
            type: POST_LOADING_REQUEST,
            payload : 0
        })
    }, [dispatch]) //의존성값을 넣어줘서 1번만 하고 끝나지 않도록

    ////////////////////////
    //6개씩
    const skipNumberRef = useRef(0) //전 생애주기에서 살아남을 수 있는 유일한 것
    //useEffect나 useCallback 안에서도 변수값에 접근하기위해서
    const postCountRef = useRef(0)
    const endMsg = useRef(false)

    postCountRef.current = postCount - 6;

    const useOnScreen = (options) => {
        const lastPostElementRef = useRef();
        const [visible, setVisible] = useState(false);
        useEffect(()=>{
            const observer = new IntersectionObserver(([entry])=>{
                setVisible(entry.isIntersecting);

                if(entry.isIntersecting) {
                    let remainPostCount = postCountRef.current - skipNumberRef.current
                    if(remainPostCount >= 0) {
                        skipNumberRef.current +=6
                        dispatch({
                            type: POST_LOADING_REQUEST,
                            payload : skipNumberRef.current
                        })
                    }else {
                        endMsg.current= true;
                        console.log(endMsg.current);
                    }
                }
            },options);
            if(lastPostElementRef.current){
                observer.observe(lastPostElementRef.current);
            }

            const LastElementReturnFunc = () => {
                if(lastPostElementRef.current){
                    observer.unobserve(lastPostElementRef.current);
                }
            };

            return LastElementReturnFunc;
            /* 
                return() => {
                    if(lastPostElementRef.current){
                        observer.unobserve(lastPostElementRef.current);
                    } 
                }
            */
        }, [ lastPostElementRef, options]);

        return [lastPostElementRef, visible];
    };

    const [lastPostElementRef, visible ] = useOnScreen({
        threshold:"0.9",
    })
    console.log(visible, "visible", skipNumberRef.current, "skipNum");
    // const observer = useRef()

    // const lastPostElementRef = useCallback((node)=>{
    //     if(loading) return
    //     //observer가 작동되는 곳에 들어오는 entries가 있는데
    //     observer.current = new IntersectionObserver((entries)=>{
    //         // console.log(entries)
    //         if(entries[0].isIntersecting){
    //             let remainPostCount = postCountRef.current - skipNumberRef.current
    //             if(remainPostCount >= 0) {
    //                 dispatch({
    //                     type: POST_LOADING_REQUEST,
    //                     payload : skipNumberRef.current+6
    //                 })
    //                 skipNumberRef.current +=6
    //             }else{
    //                 endMsg.current= true;
    //             }
    //         }
    //     })
    //     if(observer.current) observer.current.disconnect() //작동하면 일단 끊고, 다시 감시
    //     if(node){
    //         console.log(node, "node")
    //         observer.current.observe(node);
    //     }
    // },
    // [dispatch,loading]
    // )
    //Infinity Method : intersactionObserver - chrome, safari, firefox 같은 브라우저에서 가능 (익스플로러는 안 됨 - 바벨로도 안됨)
    //익스플로러에서는 스크롤 방식으로 값의 차이를 비교하는 전통적 방식을 사용해야함
    //광고가 노출되었는지 아닌지 등에 사용하는 메소드임(감지되는 칸을 만들어서 dom에 달아줌)
    //lastPostElementRef가 감지가 되면 post를 서버에 요청하고 loading 및 growingspinner가 돌아감
    //threshold 값을 넣지 않으면 화면이 크게 축소된 경우 div값이 맨 밑에서 측정되지 못하는 경우때문에 필요함
    ////////////////////////

    return (
        <Fragment>
            <Helmet title="Home" />
            <Row className="border-bottom border-top border-primary py-2 mb-3">
                <Category posts = {categoryFindResult} />
            </Row>
            <Row>
                {posts ? <PostCardOne posts={posts} /> : GrowingSpinner}
            </Row>
            <div ref={lastPostElementRef}>
                {loading && GrowingSpinner}
            </div>
            {loading ? 
                "" : endMsg ? 
                        <div>
                            <Alert color="danger" className="text-center font-weight-bolder">
                                더 이상의 포스트는 없습니다.
                            </Alert>
                        </div> : ""
            }
        </Fragment>
    )
}
//아래 div가 1픽셀이라도 보이면 인피니티 스크롤 되도록
export default PostCardList;