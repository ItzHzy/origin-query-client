import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import CardInstance from './CardInstance'

const Container = styled.div`
    height: ${(props) => { return (100 / (1 + (2 * props.numPlayers))) }}%;
    width: 100%;
`

const Hand = (props) => {
    const cards = useSelector(state => state.gameState)
    const players = useSelector(state => state.players)

    return (
        <Container numPlayers={players.length}>{cards.filter(card => ((card.controller == props.playerID) && (card.zone == "Zone.HAND"))).map(card => {
            return <CardInstance src={card.src} key={card.instanceID} />
        })}</Container>
    );
}

export default Hand;