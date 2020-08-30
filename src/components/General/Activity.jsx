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

    const returnActivity = () => {
        switch (activity.activityName) {
            case 'BUILDER':
                return <Builder />;
            case 'STATISTICS':
                return <Statistics />
            case 'SERVER':
                return <Server />
            case 'SETTINGS':
                return <Settings />
            case 'GAME':
                return <Game gameID={activity.activityID} />
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
