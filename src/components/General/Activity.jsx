import React, { useContext } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Builder from '../Builder/Builder'
import Statistics from '../Statistics/Statistics'
import Server from '../Server/Server'
import Settings from '../Settings/Settings'


const Container = styled.div`
    height: 100%;
    width: 100%;
    background-color: #3b3f46;
`

const Activity = () => {
    const page = useSelector((state) => state.currentPage)

    return (
        <Container>
            {(function () {
                switch (page) {
                    case 'builder':
                        return <Builder />;
                    case 'stats':
                        return <Statistics />
                    case 'server':
                        return <Server />
                    case 'settings':
                        return <Settings />
                    default:
                        return <Builder />;
                }
            })()}
        </Container>
    );
}

export default Activity;
