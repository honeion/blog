import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form, FormGroup, Input, Label, Progress } from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react'
//import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import { editorConfiguration } from '../../components/editor/EditorConfig'
import MyCustomUploadAdapterPlugin from '../../components/editor/UploadAdapter';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const PostWrite = () => {
    //CkEditor5
    const { isAuthenticated } = useSelector((state) => state.auth)
    const [form, setValues] = useState({ title: "", category: "", contents: "", fileUrl: "" })
    const dispatch = useDispatch()
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
    const getDataFromCKEditor = (event, editor) => {
        console.log("editor")
    }
    // <CKEditor
    //     editor={ClassicEditor}
    //     config={editorConfiguration}
    //     onInit={MyCustomUploadAdapterPlugin}
    //     onBlur={getDataFromCKEditor}
    // />
    return (
        <div>
            {isAuthenticated ? (
                <Form>
                    <FormGroup className="mb-3">
                        <Label for="title">Title</Label>
                        <Input type="text" name="title" id="title" className="form-control" onChange={onChange} />
                        <Label for="category">Category</Label>
                        <Input type="text" name="category" id="category" className="form-control" onChange={onChange} />
                        <Label for="contents">contents</Label>
                        <CKEditor
                            editor={ClassicEditor}
                            data="<p>Hello from CKEditor 5!</p>"
                            onReady={editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log('Editor is ready to use!', editor);
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                console.log({ event, editor, data });
                            }}
                            onBlur={(event, editor) => {
                                console.log('Blur.', editor);
                            }}
                            onFocus={(event, editor) => {
                                console.log('Focus.', editor);
                            }}
                        />

                        <Button color="success" clock className="mt-3 col-md-2 offset-md-10 mb-3">작성하기</Button>
                    </FormGroup>
                </Form>
            ) : (<Col width={50} className="p-5 m-5">
                <Progress animated color="info" value={100} />
            </Col>
                )}
        </div>
    )
};

export default PostWrite;