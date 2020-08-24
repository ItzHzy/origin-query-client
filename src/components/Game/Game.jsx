import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Lobby from './Lobby/Lobby'
import GameBoard from './GameBoard/GameBoard'

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
`

const Game = (props) => {
    const gameStatus = useSelector((state) => state.gameStatus)

    return (
        <Container>
            {gameStatus == "In Lobby" ? <Lobby /> : <GameBoard />}
        </Container>
    );
}

export default Game;