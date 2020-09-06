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
    const myPlayerID = useSelector(state => state.gameStates[props.gameID].playerID)
    const opponents = useSelector(state => state.gameStates[props.gameID].opponents)
    const numPlayers = 1 + opponents.length

    return (
        <Container>
            <SubContainer>
                <Hand numPlayers={numPlayers} playerID={myPlayerID} gameID={props.gameID} />
                <BoardSide key={myPlayerID + "-Board"} numPlayers={numPlayers} gameID={props.gameID} playerID={myPlayerID} isYours={true} />
                {opponents.map((player) => {
                    return <BoardSide key={player + "-Board"} numPlayers={numPlayers} gameID={props.gameID} playerID={player} isYours={false} />
                })}
            </SubContainer>
            <Stack gameID={props.gameID} />
        </Container>
    );
}

export default GameBoard;
