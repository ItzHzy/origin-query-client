import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'

const Container = styled.div`
    height: ${(props) => { return (100 / (1 + (2 * props.numPlayers))) }}%;
    width: 100%;
    border: solid 2px black;
`

const Hand = (props) => {
    const cards = useSelector(state => state.gameState)
    const players = useSelector(state => state.players)

    return (
        <Container numPlayers={players.length}>{cards.filter(card => card.controller == props.playerID).map(card => {
            return <div></div>
        })}</Container>
    );
}

export default Hand;