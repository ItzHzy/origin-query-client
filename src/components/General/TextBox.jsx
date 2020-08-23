import React from 'react';
import styled from 'styled-components';

const Container = styled.input`
    display: flex;
    width: ${props => props.width};
    background: #ffffff17;
    color: #d9d9d9;
    outline: none;
    border: none;
    border-radius: 10px;
    font-size: x-large;
    text-indent: 10px;
`

const TextBox = (props) => {
    return (
        <Container type="text" width={props.width} placeholder={props.placeholder}></Container>
    );
}

export default TextBox;
