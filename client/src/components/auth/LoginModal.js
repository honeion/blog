import React , { useEffect, useState } from 'react'
import { Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, NavLink } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { CLEAR_ERROR_REQUEST, LOGIN_REQUEST } from '../../redux/types';

const LoginModal = () => {
    const [modal, setModel] = useState(false) //react에서 변수와 함수를 묶어줘서 상태를 관리하도록 함
    const [localMsg, setLocalMsg] = useState('')
    const [form, setValues] = useState({
        email: "",
        password : ""
    })
    const dispatch = useDispatch()
    const {errorMsg} = useSelector((state) => state.auth) //authReducer에서 작성한 값 하나씩 가져올 수 있음
    useEffect(() => { //effect 변화가 있으면 그 때 내부의 것을 작동시키는 것
        try {
            setLocalMsg(errorMsg)
        } catch(e){
            console.log(e)
        }
    }, [errorMsg]) //[] 이렇게 하면 1번이지만 errorMsg의 변화가 있을때마다 작동함

    const handleToggle = () => {
        dispatch({ //redux에 있는 타입을 보낼 것
            type : CLEAR_ERROR_REQUEST
        })
        setModel(!modal) //모달 닫음
    }
    
    const onChange = (e) => { //react에서 input 다룰 때 onChange로 씀
        setValues({
            ...form, //기존 폼
            [e.target.name] : e.target.value //input에 있는 것
        })
    }

    const onSubmit = (event) => {
        event.preventDefault() //새로 고침 없이 변화된 것만 되어야하므로 막아줌
        const {email, password} = form
        const user = {email, password}
        console.log(user);
        dispatch({
            type : LOGIN_REQUEST,
            payload : user
        })
    }
    //isOpen 여부는 modal로 판별
    //toggle이 모달 닫히고 열리는 것 포함

    //form에서 name이 target.name과 동일, 위의 변수랑도 동일
    //style={{marginTop:"2rem"}} = className="mt-2"
    return (
        <div>
            <NavLink onClick={handleToggle} href="#">
                Login
            </NavLink>
            <Modal isOpen={modal} toggle={handleToggle}>
                <ModalHeader toggle={handleToggle}>Login</ModalHeader>
                <ModalBody>
                    {localMsg ? <Alert color ="danger">{localMsg}</Alert> : null}
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email" placeholder="Email" onChange={onChange}/>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" id="password" placeholder="Password" onChange={onChange}/>
                            <Button color='dark' style={{marginTop:"2rem"} }>Login</Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
};

export default LoginModal;