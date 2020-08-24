import React, { useContext } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Builder from '../Builder/Builder'
import Statistics from '../Statistics/Statistics'
import Server from '../Server/Server'
import Settings from '../Settings/Settings'
import Game from '../Game/Game'


const Container = styled.div`
    height: 100%;
    width: 100%;
    background-color: #3b3f46;
`

const Activity = () => {
    const activity = useSelector((state) => state.currentActivity)
    const currentGame = useSelector((state) => state.currentGame)

    const returnActivity = () => {
        switch (activity) {
            case 'builder':
                return <Builder />;
            case 'stats':
                return <Statistics />
            case 'server':
                return <Server />
            case 'settings':
                return <Settings />
            case 'game':
                return <Game currentGame={currentGame} />
            default:
                return <Builder />;
        }
    }

    return (
        <Container>
            {returnActivity()}
        </Container>
    );
}

export default Activity;
