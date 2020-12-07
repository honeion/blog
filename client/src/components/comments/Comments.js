import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Input, Row } from 'reactstrap';
import { COMMENT_LOADING_REQUEST, COMMENT_UPLOADING_REQUEST } from '../../redux/types';

const Comments = ({id, userId, userName}) => {
    //구조분해해서 받고
    const dispatch = useDispatch()
    const [form, setValues] = useState({contents:""})
    const onChange = (e) => {
        setValues({
            ...form,
            [e.target.name] : e.target.value
        })
        console.log(form.contents)
    }
    const onSubmit = async(e) => {
        await e.preventDefault() //refresh 막고
        const { contents } = form
        const token = localStorage.getItem("token")
        const body = {
            contents, token, id, userId, userName
        }
        console.log("###", body," form",form)
        dispatch({
            type: COMMENT_UPLOADING_REQUEST,
            payload : body
        })
        resetValue.current.value = ""
        setValues("");
    }
    //comment를 달고 나서 state를 초기화해주기 위함
    const resetValue = useRef(null);
    /*
     useRef
      .current 프로퍼티로 전달된 인자(initialValue)로 초기화된 변경가능한 ref 객체를 반환
      반환된 객체는 컴포넌트 전 생애주기를 통해 유지됨
      일반적으로 자식에게 명령적으로 접근하는데 사용 
      ref 속성보다 useRef()를 사용하면 순수 js 객체를 생성하여 매번 렌더링시 동일한 ref 객체를 제공
      .current 프로퍼티를 변형하는 것이 리렌더링을 발생시키지 않음(내용 변경시 알려주지 않음)
      직접 DOM에 접근(생애주기에 관계없이)
      useEffect()는 바깥의 변수로 접근할때 일반적으로 할 수 없는데 안에 반영해주기위해서 useRef가 필요
    */
   useEffect(()=>{
       dispatch({
           type:COMMENT_LOADING_REQUEST,
           payload: id,
       });
   },[dispatch, id]) //바뀔때마다 어떤 값을 useEffect 사용할지 의존성값 추가
    return (
        <Fragment>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Row className="p-2">
                        <div className="font-weight-bold m-1"> Make Comment </div>
                        <div className="my-1"/>
                        <Input
                            innerRef={resetValue}
                            type="textarea"
                            name="contents"
                            id="contents"
                            onChange={onChange}
                            placeholder="Comment"
                        />
                        <Button
                            color="primary"
                            block
                            className="mt-2 offset-md-10 col-md-2">
                         댓글달기   
                        </Button>
                    </Row>
                </FormGroup>
            </Form>
        </Fragment>
    )
}

export default Comments;