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

const GameBoard = (props) => {
    const players = useSelector(state => state.gameStates[props.gameID].relativePlayerList)

    return (
        <Container>
            <SubContainer>
                <Hand numPlayers={players.length} playerID={players[0]} gameID={props.gameID} />
                {players.map((player) => {
                    return <BoardSide key={player + "-Board"} numPlayers={players.length} gameID={props.gameID} playerID={player} />
                })}
            </SubContainer>
            <Stack gameID={props.gameID} />
        </Container>
    );
}

export default GameBoard;
