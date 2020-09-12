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
    }

    &>p{
        height: fit-content;
        width: fit-content;
        color: white;
        font-size: large;
        margin-top: auto;
        margin-bottom: auto;
    }
`

const PlayerList = (props) => {
    const players = useSelector((state) => state.gameStates[props.gameID].players)

    return (
        <Container>
            {Object.getOwnPropertyNames(players).map((playerID) => {
                return <Entry key={playerID}>

                    <p>{players[playerID].name}</p>

                    {players[playerID].isReady
                        ? <p style={{ color: "green" }}>Ready</p>
                        : <p style={{ color: "red" }}>Not Ready</p>}

                </Entry>
            })}
        </Container>
    );
}

export default PlayerList;