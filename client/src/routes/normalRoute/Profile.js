import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { CLEAR_ERROR_REQUEST, PASSWORD_EDIT_UPLOADING_REQUEST } from '../../redux/types';
import Helmet from 'react-helmet'
import { Alert, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label } from 'reactstrap';

const Profile = () => {
    const { userId, errorMsg, successMsg, previousMatchMsg} = useSelector((state)=>state.auth)
    const { userName } = useParams();
    const [form, setValues] = useState({
        previousPwd : "",
        newPwd : "",
        rePwd : ""
    })
    const dispatch = useDispatch();

    const onChange = (e) => {
        setValues({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const onSubmit = async(e)=> {
        await e.preventDefault()
        const {previousPwd, newPwd, rePwd} = form
        const token = localStorage.getItem("token")

        const body = {
            newPwd, token, previousPwd, rePwd, userId, userName
        }
        //에러 초기화
        dispatch({
            type : CLEAR_ERROR_REQUEST
        })
        dispatch({
            type : PASSWORD_EDIT_UPLOADING_REQUEST,
            payload : body
        })
    }
    //sm 모바일화면(제일 작으면 12칸)
    //reactstrap은 한 화면을 12칸으로 나누고 offset 3칸부터 시작
    return (
        <Fragment>
            <Helmet title={`Profile | ${userName}님의 프로필`} />
            <Col sm="12" md={{size: 6, offset: 3}}>
                <Card>
                    <CardHeader>
                        <strong>Edit Password</strong>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={onSubmit}>
                            <FormGroup>
                                <Label for="title">기존 비밀번호</Label>
                                <Input 
                                    type="password"
                                    name="previousPwd"
                                    id="previousPwd"
                                    className="form-control mb-2"
                                    onChange={onChange}
                                />
                                { //기존 비밀번호와 일치하는지에 관한 서버에서 온 메세지
                                    previousMatchMsg ? <Alert color="danger">{previousMatchMsg}</Alert> : ""
                                }
                                <Label for="title">새로운 비밀번호</Label>
                                <Input 
                                    type="password"
                                    name="newPwd"
                                    id="newPwd"
                                    className="form-control mb-2"
                                    onChange={onChange}
                                />
                                <Label for="title">비밀번호 확인</Label>
                                <Input 
                                    type="password"
                                    name="rePwd"
                                    id="rePwd"
                                    className="form-control mb-2"
                                    onChange={onChange}
                                />
                                {
                                    errorMsg ? <Alert color="danger">{errorMsg}</Alert> : ""
                                }
                                <Button color="success" block className="mt-4 mb-4 col-md-3 offset-9">
                                    수정하기
                                </Button>
                                {
                                    successMsg ? <Alert color="danger">{successMsg}</Alert> : ""
                                }
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
            </Col>

        </Fragment>
    )
}

export default Profile;