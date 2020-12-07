import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, FormGroup, Input, Label, Progress } from "reactstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import { editorConfiguration } from '../../components/editor/EditorConfig'
import MyCustomUploadAdapterPlugin from '../../components/editor/UploadAdapter'
import { POST_EDIT_UPLOADING_REQUEST } from "../../redux/types";


const PostEdit = () => {
    const { isAuthenticated } = useSelector((state) => state.auth)
    const [form, setValues] = useState({ title: "", category: "", contents: "", fileUrl: "" })
    const dispatch = useDispatch() 
    const {postDetail} = useSelector((state)=>state.post)
    console.log(postDetail,"postDetail")
    if(postDetail == null){
        
    }
    const onChange = (event) => {
        setValues({
            ...form,
            [event.target.name]: event.target.value
        })
    }
    //얘네가 달라지면 저장을 하라
    useEffect(()=>{
        /* dispatch({
            type: POST_EDIT_LOADING_REQUEST,
            payload: req.match.params.id,
        });
        */
       setValues({
           title : postDetail.title,
           category : postDetail.category,
           contents : postDetail.contents,
           fileUrl : postDetail.fileUrl,
       });
    }, [postDetail.title, postDetail.category, postDetail.contents, postDetail.fileUrl]);

    const onSubmit = async (event) => {
        await event.preventDefault()
        const { title, category, contents, fileUrl } = form;
        const token = localStorage.getItem("token");
        const id = postDetail._id;
        const body = {title, category, contents, fileUrl, token, id};
        dispatch({
            type : POST_EDIT_UPLOADING_REQUEST,
            payload : body,
        });
    };

    const getDataFromCKEditor = (event, editor) => {
        const data = editor.getData()
        console.log("#data : ",data)
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
    }
    return (
        <div>
            {isAuthenticated ? (
                <Form onSubmit={onSubmit}>
                    <FormGroup className="mb-3">
                        <Label for="title">Title</Label>
                        <Input defaultValue={postDetail.title}
                               type="text" 
                               name="title" 
                               id="title" 
                               className="form-control" 
                               onChange={onChange} />
                        <Label for="category">Category</Label>
                        <Input defaultValue= {postDetail.category.categoryName}
                               type="text" 
                               name="category" 
                               id="category" 
                               className="form-control" 
                               onChange={onChange} />
                        <Label for="contents">Contents</Label>
                        <CKEditor
                            data = {postDetail.contents}
                            editor ={ClassicEditor}
                            config ={editorConfiguration}
                            onReady={MyCustomUploadAdapterPlugin}
                            onBlur ={getDataFromCKEditor}
                        />
                        <Button 
                            color="success" 
                            block 
                            className="mt-3 col-md-2 offset-md-10 mb-3">수정하기</Button>
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

export default PostEdit;