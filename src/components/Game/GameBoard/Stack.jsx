import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import CardInstance from './CardInstance'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 350px;
    border-left: solid 2px black;
    justify-content: flex-start;

    &>:nth-child(1n){
        display: flex;
        height: 300px;
        margin-bottom: -250px;
        margin-left: auto;
        margin-right: auto;
    }
`

const Stack = (props) => {
    const stack = useSelector(state => state.gameStates[props.gameID].stack)

    return (
        <Container>
            {stack.map(instanceID => {
                return <CardInstance key={instanceID} gameID={props.gameID} instanceID={instanceID} />
            })}
        </Container>
    );
}

export default Stack;