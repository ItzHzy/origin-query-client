import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Hand from './Hand'
import BoardSide from './BoardSide'
import Stack from './Stack'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
`
const SubContainer = styled.div`
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    width: 100%;
`

const GameBoard = () => {
    const gameStatus = useSelector(state => state.gameStatus)

    return (
        <Container>
            <SubContainer>
                <Hand playerID={players[0].playerID} />
                {gameStatus.players.map((player) => {
                    return <BoardSide key={player.playerID} playerID={player.playerID} />
                })}
            </SubContainer>
            <Stack />
        </Container>
    );
}

export default GameBoard;
