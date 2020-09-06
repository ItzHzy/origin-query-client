import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import CardInstance from './CardInstance'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 50%;
    width: 100%;
    justify-content: space-evenly;

    &>:nth-child(1n){
        display: flex;
        height: 90%;
        width: fit-content;
        margin-top: auto;
        margin-bottom: auto;
    }
`

const Land = (props) => {
    const field = useSelector(state => state.gameStates[props.gameID].players[props.playerID]["Zone.FIELD"])

    const isLand = (instanceID) => {
        return field[instanceID]
    }

    return (
        <Container>
            {Object.getOwnPropertyNames(field)
                .filter(instanceID => isLand(instanceID))
                .map(instanceID => {
                    return <CardInstance key={instanceID} gameID={props.gameID} instanceID={instanceID} />
                })}
        </Container>
    );
}

export default Land;