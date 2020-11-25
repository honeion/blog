import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, FormGroup, Input, Label, Progress } from "reactstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import { editorConfiguration } from '../../components/editor/EditorConfig'
import MyCustomUploadAdapterPlugin from '../../components/editor/UploadAdapter'
import dotenv from "dotenv";
dotenv.config();

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
        console.log("#data : ",data)
        //img의 시작과 끝을 찾고 url을 출력
        if(data && data.match("<img src=")){
            const whereImg_start = data.indexOf("<img src=")
            
            let whereImg_end = ""
            let ext_name_find =  ""
            let result_Img_Url = ""
            const ext_name = ["jpeg", "png", "jpg", "gif"]

            for (let i = 0; i < ext_name.length; ++i){
                if(data.match(ext_name[i])){
                    console.log(data.indexOf(`${ext_name[i]}`))
                    ext_name_find = ext_name[i];
                    whereImg_end = data.indexOf(`${ext_name[i]}`)
                }
            }
            
            if(ext_name_find === "jpeg"){
                result_Img_Url = data.substring(whereImg_start+10,whereImg_end+4)
            }else{
                result_Img_Url = data.substring(whereImg_start + 10, whereImg_end + 3)
            }
            console.log("#start : ", whereImg_start)
            console.log("#ext_index : ", ext_name_find)
            console.log("#end : ", whereImg_end)
            console.log("#result : ", result_Img_Url)

            setValues({
                ...form,
                fileUrl : result_Img_Url,
                contents : data,
            })
        }else{
            setValues({
                ...form,
                fileUrl: process.env.REACT_APP_BASUC_IMAGE_URL,
                contents : data,
            })
        }
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