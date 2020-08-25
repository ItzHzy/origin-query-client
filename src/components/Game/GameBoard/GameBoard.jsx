import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Hand from './Hand'
import BoardSide from './BoardSide'

const Container = styled.div`
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    width: 100%;
`

const GameBoard = () => {
    const players = useSelector(state => state.players)

    return (
        <Container>
            <Hand playerID={players[0].playerID} />
            {players.map((player) => {
                return <BoardSide key={player.playerID} player={player} />
            })}
        </Container>
    );
}

export default GameBoard;
