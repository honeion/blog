import React from 'react'
import { useSelector } from 'react-redux'
import {Route, Redirect} from 'react-router-dom'

export const EditProtectedRoute = ({ component:Component, ...rest})=>{
    const {userId} = useSelector((state)=>state.auth)
    const {creatorId} = useSelector((state)=> state.post)
    //로그인한 유저아이디와 작성자(creator) 아이디가 같을때만 주소 뒤에 /edit을 붙여서 접속이 가능함 
    return(
        <Route
            {...rest}
            render = {(props)=>{
                if(userId === creatorId){
                    return <Component {...props}/> 
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname:"/",
                                state: {
                                    from: props.location,
                                }
                            }}
                        />
                    )
                }
            }}        
        />

    )
}
//...rest는 나머지 것들 그 자체
//물려받은것을 그대로 돌려주고
//아니면 홈으로 보내고 상태는 위치 상태 그대로 가져간다는데
//redux에서 주소를 변환하는 것은 
//location이나 redux history에서 주소를 받아오는 것 spa(주소변경없이 바꿔주는게 가능)

export const ProfileProtectedRoute = ({component: Component, ...rest}) => {
    const {userName} = useSelector((state)=>state.auth);
    console.log(userName)
    return (
        <Route
            {...rest}
            render={(props)=> {
                if(props.match.params.userName === userName) {
                    return <Component {...props} />;
                } else {
                    return (
                        <Redirect 
                            to={{
                                pathname: "/",
                                state: {
                                    from: props.location,
                                },
                            }}
                        />
                    );
                }
            }}
        />
    )
}
// 주소창에서 임의로 주소를 입력했을때 해당하는 사람 외에는 접근을 못하도록 만든 라우터
