import React from 'react';
import { Field } from 'redux-form'

const textBoxStyles = {
    display: "flex",
    width: "90%",
    background: '#ffffff17',
    color: '#d9d9d9',
    outline: 'none',
    border: 'none',
    borderRadius: '10px',
    fontSize: 'x-large',
    textIndent: '10px'
}

const TextBox = (props) => {
    return (
        <Field type="text" width={props.width} component="input" style={textBoxStyles} placeholder={props.placeholder} name={props.name}></Field>
    );
}

export default TextBox;
