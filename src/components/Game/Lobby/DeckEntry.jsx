import React from 'react';
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: white;
    font-size: large;
    height: 20px; 
    width: 96%;
    padding: 2%;
    border-radius: 7px;
    
    &:hover {
        cursor: pointer;
        background-color: #737373;
    }
`
const P = styled.div`
    height: 100%;
`

const DeckEntry = (props) => {
    return (
        <Container>
            <P>{props.name}</P>
            <P>{props.num}</P>
        </Container>
    );
}

export default DeckEntry;