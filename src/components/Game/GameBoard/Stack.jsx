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
    const cards = useSelector(state => state.gameState)

    return (
        <Container>
            {cards.filter(card => (card.zone == "Zone.STACK")).map(card => {
                return <CardInstance src={card.src} key={card.instanceID} card={card} />
            })}
        </Container>
    );
}

export default Stack;