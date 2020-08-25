import React from 'react';
import styled from 'styled-components';

const Container = styled.img`
    display: flex;
    width: 5%;
    height: auto;
`

const CardInstance = (props) => {
    return (
        <Container src={props.src} />
    );
}

export default CardInstance;