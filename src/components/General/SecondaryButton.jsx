import React from 'react';
const { default: styled } = require("styled-components")

const Container = styled.button`
height: 100%;
width: 100px;
margin-left: auto;
margin-right: 20px;
border-radius: 20px;
color: #f294cb;
background: none;
border: solid 2px #f294cb94;
font-size: large;
font-family: Roboto;

&:hover{
    cursor: pointer;
}

&:focus{
    outline: none;
}

&:active{
    border: solid 2px;
}
`

const SecondaryButton = (props) => {
    return (
        <Container onClick={props.onClick}>{props.label}</Container>
    );
}

export default SecondaryButton;