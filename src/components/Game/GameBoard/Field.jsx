import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import CardInstance from './CardInstance'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 50%;
    width: 100%;
    border-bottom: solid 2px black;
    justify-content: space-evenly;

    &>:nth-child(1n){
        display: flex;
        height: 90%;
        width: fit-content;
        margin-top: auto;
        margin-bottom: auto;
    }
    
`

const Field = (props) => {
    const declaredAttacks = useSelector(state => state.gameStates[props.gameID].declaredAttacks)
    const declaredBlocks = useSelector(state => state.gameStates[props.gameID].declaredBlocks)
    const opponents = useSelector(state => state.gameStates[props.gameID].opponentsList)
    const field = useSelector(state => state.gameStates[props.gameID].players.get(props.playerID).field)

    return (
        <Container>
            {field.filter(card => !(card.types.includes("Type.LAND")))
                .map(card => {
                    return <CardInstance src={card.src} key={card.instanceID} card={card} tapped={card.tapped} opponents={opponents} declaredAsAttacker={card.instanceID in declarations} />
                })}
        </Container>
    );
}

export default Field;