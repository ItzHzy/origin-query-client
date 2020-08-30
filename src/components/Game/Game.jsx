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
    const gameState = useSelector((state) => state.gameStates[props.gameID])

    return (
        <Container>
            {gameState.inProgress ? <GameBoard gameID={props.gameID} /> : <Lobby gameID={props.gameID} />}
        </Container>
    );
}

export default Game;