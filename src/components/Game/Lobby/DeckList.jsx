import React from 'react';
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import DeckEntry from './DeckEntry'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    height: 98%;
    width: 500px;
    border-style: solid;
    border-radius: 7px;
`

const DeckList = (props) => {
    const deck = useSelector((state) => state.currentDeck)

    const enumDeck = (contents) => {
        var entries = []
        Object.keys(deck.contents).forEach((card) => {
            entries.push(<DeckEntry key={card + 'Lobby'} name={card} num={deck.contents[card]} />)
        })
        return entries
    }

    return (
        <Container>
            {enumDeck(deck.contents).map((entry) => {
                return entry
            })}
        </Container>
    );
}

export default DeckList;