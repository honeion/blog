import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, FormGroup, Input, Label, Progress } from "reactstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import { editorConfiguration } from '../../components/editor/EditorConfig'
import MyCustomUploadAdapterPlugin from '../../components/editor/UploadAdapter'

const PostWrite = () => {
    const { isAuthenticated } = useSelector((state) => state.auth)
    const [form, setValues] = useState({ title: "", category: "", contents: "", fileUrl: "" })
    const dispatch = useDispatch() //redux는 dispatch를 항시 가져와야
    const onChange = (event) => {
        setValues({
            ...form,
            [event.target.name]: event.target.value
        })
    }
    const onSubmit = async (event) => {
        await event.preventDefault() //새로고침 시
        const { title, category, contents, fileUrl } = form
    }
    // The editor event callbacks (onChange, onBlur, onFocus) receive two arguments:
    //  An EventInfo object.
    //  An Editor instance.
    const getDataFromCKEditor = (event, editor) => {
        //Editor의 call back은 onChange, onBlur, onFocus
        //event의 info값과 editor의 instance를 editor가 메모리상에 올라와서 
        //저장하고 있는 내용을 어떻게 활용할지 도와주는 파라미터를 2개로 갖고 있고 3개의 콜백에서 사용가능
        //포커싱을 입력에서 밖으로 나갈때 blur 처리가 된 것이므로 editor에서 저장하고 있던 내용을 submit할때 추출되는 셈
        //일반적으로 리액트 인풋값에 setState(useState 사용)하여 입력과 동시에 값이 저장 되도록 하는데 에디터는 기존부터 사용하던거라 조금 다름
        const data = editor.getData()
        console.log(data);
        // if(data)
        // 글과 글 사이의 첫번째 이미지를 분리
    }
    return (
        <div>
            {isAuthenticated ? (
                <Form>
                    <FormGroup className="mb-3">
                        <Label for="title">Title</Label>
                        <Input type="text" 
                               name="title" 
                               id="title" 
                               className="form-control" 
                               onChange={onChange} />
                        <Label for="category">Category</Label>
                        <Input type="text" 
                               name="category" 
                               id="category" 
                               className="form-control" 
                               onChange={onChange} />
                        <Label for="contents">Contents</Label>
                        
                        <CKEditor
                            editor ={ClassicEditor}
                            config ={editorConfiguration}
                            onReady={MyCustomUploadAdapterPlugin}
                            onBlur ={getDataFromCKEditor}
                        />
                        <Button 
                            color="success" 
                            block 
                            className="mt-3 col-md-2 offset-md-10 mb-3">작성하기</Button>
                    </FormGroup>
                </Form>
            ) : (
                <Col width={50} className="p-5 m-5">
                <Progress animated color="info" value={100} />
                </Col>
                )}
        </div>
    )
        
    
};

export default PostWrite;