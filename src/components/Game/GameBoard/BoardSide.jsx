import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Profile from './Profile/Profile'
import Field from './Field'
import Land from './Land'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    border: solid 2px black;
    border-left: none;
    border-bottom: none;
    border-top: none;
`

const BoardSide = (props) => {
    return (
        <Container numPlayers={props.numPlayers}>
            <Field playerID={props.playerID} gameID={props.gameID} />
            <Land playerID={props.playerID} gameID={props.gameID} />
        </Container>
    );
}

export default BoardSide;