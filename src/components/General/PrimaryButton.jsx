import React from 'react';
import styled from 'styled-components';

const Container = styled.button`
    height: 40px;
    width: 100px;
    justify-self: end;
    margin-right: 20px;
    border-radius: 20px;
    background-color: #f294cbd9;
    border: none;
    font-size: large;
    font-family: Roboto;

    &:hover{
        cursor: pointer;
    }

    &:focus{
        outline: none;
    }

    &:active{
        background-color: #f294cb;
    }
`

const PrimaryButton = (props) => {
    return (
        <Container onClick={props.onClick}>{props.label}</Container>
    );
}

export default PrimaryButton;