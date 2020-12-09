//검색 창
import React, { Fragment, useRef, useState } from 'react'
import { Form, FormGroup, Input } from 'reactstrap'
import { useDispatch } from 'react-redux'
import { SEARCH_REQUEST } from '../../redux/types'

const SearchInput = () => {
    const dispatch = useDispatch()
    const [form, setValues] = useState({searchBy : ""}) //여기서 searchBy가 들어가므로 reducer에서 request에서 searchBy 필요
    const onChange = (e) => {
        setValues({
            ...form,
            [e.target.name] : e.target.value
        })
        console.log(form)
    }
    const onSubmit = async(e) => {
        await e.preventDefault();
        const {searchBy} = form

        dispatch({ 
            type: SEARCH_REQUEST,
            payload : searchBy
        })
        console.log(searchBy, "Submit Body")
        resetValue.current.value = "";
    }

    const resetValue = useRef(null); //innerRef에 있는 것

    return (
        <Fragment>
            <Form onSubmit = {onSubmit} className="col mt-2">
                <Input
                    name="searchBy"
                    onChange={onChange}
                    innerRef={resetValue}
                />
            </Form>
        </Fragment>
    )
}

export default SearchInput;