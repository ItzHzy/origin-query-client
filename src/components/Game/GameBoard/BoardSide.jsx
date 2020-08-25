import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Profile from './Profile'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: ${(props) => { return 200 / (1 + 2 * (props.numPlayers)) }}%;
    width: 100%;
    border: solid 2px black;
`

const SubContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`

const Field = styled.div`
    display: flex;
    flex-direction: row;
    height: 50%;
    width: 100%;
    border-bottom: solid 2px black;
`

const Land = styled.div`
    display: flex;
    flex-direction: row;
    height: 50%;
    width: 100%;
`


const BoardSide = (props) => {
    const cards = useSelector(state => state.gameState)
    const players = useSelector(state => state.players)

    return (
        <Container numPlayers={players.length}>
            <Profile player={props.player} />
            <SubContainer>
                <Field />
                <Land />
            </SubContainer>
        </Container>
    );
}

export default BoardSide;