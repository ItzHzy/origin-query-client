import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'

const Container = styled.div`
    width: 250px;
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-radius: 7px;
    height: fit-content;
`

const Entry = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: white;
    font-size: large;
    height: 20px; 
    width: 96%;
    padding: 2%;
    border-radius: 7px;
    
    &:hover {
        cursor: pointer;
        background-color: #737373;
    }
`

const PlayerList = () => {
    const players = useSelector((state) => state.players)

    return (
        <Container>
            {players.map((player) => {
                return <Entry key={player.name}>{player.name}</Entry>
            })}
        </Container>
    );
}

export default PlayerList;