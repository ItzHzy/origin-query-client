import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import CardInstance from './CardInstance'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: ${(props) => { return (100 / (1 + (2 * props.numPlayers))) }}%;
    width: 100%;
    justify-content: space-evenly;
    border-top: 2px solid black;

    &>:nth-child(1n){
        margin-left: -250px;
        margin-right: -250px;
    }
`

const Hand = (props) => {
    const hand = useSelector(state => state.gameStates[props.gameID].players[props.playerID]["Zone.HAND"])

    return (
        <Container numPlayers={props.numPlayers}>{hand.map(instanceID => {
            return <CardInstance key={instanceID} gameID={props.gameID} instanceID={instanceID} />
        })}</Container>
    );
}

export default Hand;