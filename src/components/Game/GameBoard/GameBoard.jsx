import React, { Profiler } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Hand from './Hand'
import BoardSide from './BoardSide'
import Stack from './Stack'
import Profile from './Profile/Profile'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`

const Section = styled.div`
    display: flex;
    flex-direction: row;
    height: ${(props) => 200 / (1 + (2 * props.numPlayers))}%;
    width: 100%;
`
const Profiles = styled.div`
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    width: 
`

const PublicZone = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 350px;
    border-left: solid 2px black;
    justify-content: flex-start;

    &>:nth-child(1n){
        height: 300px;
        margin-bottom: -250px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 0px;
    }
`

const Fields = styled.div`
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    width: 100%;
`

const GameBoard = (props) => {
    const myPlayerID = useSelector(state => state.gameStates[props.gameID].playerID)
    const opponents = useSelector(state => state.gameStates[props.gameID].opponents)
    const ZoneBeingShown = useSelector(state => state.gameStates[props.gameID].zoneBeingShown)
    const numPlayers = 1 + opponents.length

    return (
        <Container>
            <Section numPlayers={numPlayers}>
                <PublicZone>{stack.map(instanceID => {
                    return <CardInstance key={instanceID} gameID={props.gameID} instanceID={instanceID} />
                })}</PublicZone>
                <Profiles>
                    <Profile playerID={myPlayerID} gameID={props.gameID} isYours={true} />
                    {opponents.map((player) =>
                        <Profile playerID={player.playerID} gameID={props.gameID} isYours={false} />
                    )}
                </Profiles>
                <Fields>
                    <BoardSide key={myPlayerID + "-Board"} numPlayers={numPlayers} gameID={props.gameID} playerID={myPlayerID} />
                    {opponents.map((player) => {
                        return <BoardSide key={player + "-Board"} numPlayers={numPlayers} gameID={props.gameID} playerID={player} />
                    })}
                </Fields>
                <Stack gameID={props.gameID} />
            </Section>
            <Hand numPlayers={numPlayers} playerID={myPlayerID} gameID={props.gameID} />
        </Container>
    );
}

export default GameBoard;
