import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Profile from './Profile'
import Field from './Field'
import Land from './Land'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: ${(props) => { return 200 / (1 + 2 * (props.numPlayers)) }}%;
    width: 100%;
    border: solid 2px black;
    border-left: none;
`

const SubContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`


const BoardSide = (props) => {
    const numPlayers = useSelector(state => state.gameStatus.numPlayers)

    return (
        <Container numPlayers={numPlayers}>
            <Profile playerID={props.playerID} />
            <SubContainer>
                <Field playerID={props.playerID} />
                <Land playerID={props.playerID} />
            </SubContainer>
        </Container>
    );
}

export default BoardSide;