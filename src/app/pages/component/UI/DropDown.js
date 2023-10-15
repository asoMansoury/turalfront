import React from 'react';
import {Form,Card,CardColumns} from 'react-bootstrap';

export const DropDown =(props)=>{
    return (
        <div>
            <Form.Label>{props.children}</Form.Label>
                <Form.Control disabled={props.disabled}  aria-required={true} className={props.className} as="select" value={props.SelectedID} onChange={props.onChange}>
                {
                props.source!==undefined? props.source.map((item,index)=>{
                    return <option value={item.id} rowCode={item.code} key={index}>{item.title}</option>
                    }) : <div></div>
                
                }
            </Form.Control>
        </div>
    )
}

export default DropDown;
