import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { CLEAR_ERROR_REQUEST, REGISTER_REQUEST } from '../../redux/types'

const RegisterModal = () => {
    //modal 여부를 정해줄 useState 선언
    const [modal, setModal] = useState(false)
    //input 값을 저장해줄 useState 선언
    const [form, setValue] = useState({
        name: "",
        email: "",
        password : ""
    })
    //메세지 저장할 useState
    const [localMsg, setLocalMsg] = useState('')
    //index.js에 있는 authReducer에서 errorMsg를 가져옴
    const {errorMsg} = useSelector((state)=>state.auth)
    //useDispatch를 가져오고
    const dispatch = useDispatch()
    //error를 제거하기 위함
    const handleToggle = () => {
        //toggle에 x버튼을 누르면 error를 날려줄 것
        dispatch({
            type : CLEAR_ERROR_REQUEST,
        })
        setModal(!modal) //isOpen에 따라 모달 상태 변경
    }

    useEffect(() => {
        try{
            setLocalMsg(errorMsg)
        } catch(e){
            console.error(e);
        }
    }, [errorMsg]) // 이 의존값이 변하면 다시 렌더링을 해주는 것
    
    const onChange = (e) => {
        setValue({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault() //새로고침 막아주고
        const {name, email, password} = form; //form에서 분리해오고
        const newUser = {name, email, password}
        console.log(newUser,"newUser")
        dispatch({ //만들었던 store로 payload에 담아 보냄 
            type: REGISTER_REQUEST,
            payload : newUser
        })
    }
    //보여줄 것 presenter
    //react를 구조화하는 방식을 함수부분을 따로 떼서(Container라고 함) 보여지는 부분을 presenter라고 하여 따로 나눠서 작성하는 방식이 있음
    //재사용이 가능하기때문(처음 입문시에는 까먹기 쉬워서 묶어서 하고 있음)
    //NavLink가 따로 가는 곳은 없어서 #으로 충분
    return (
        <div className="mt-2">
            <NavLink onClick={handleToggle} to="#" className ="text-white text-decoration-none">
                Sign Up
            </NavLink>
            <Modal isOpen={modal} toggle={handleToggle}>
                <ModalHeader toggle={handleToggle}>
                    Sign Up
                </ModalHeader>
                <ModalBody>
                    {localMsg ? <Alert color="danger">{localMsg}</Alert> : null}
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input type="text" name="name" id="name" placeholder="Name" onChange={onChange}/>
                            <Label for="email">Email</Label>
                            <Input type="text" name="email" id="email" placeholder="Email" onChange={onChange}/>
                            <Label for="password">Password</Label>
                            <Input type="text" name="password" id="password" placeholder="Password" onChange={onChange}/>
                            <Button color="dark" className="mt-2">Sign Up</Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default RegisterModal