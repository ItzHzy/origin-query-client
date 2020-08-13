import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Builder from './Builder'
import Statistics from './Statistics'
import PageContext from './context/PageContext';


const Container = styled.div`
    height: 100%;
    width: 100%;
    background-color: #3b3f46;
`

const Activity = () => {
    const { page } = useContext(PageContext) 

    return ( 
    <Container>
        {(function() {
            switch (page) {
                case 'builder':
                    return <Builder />;
                case 'stats':
                    return <Statistics />
                default:
                    return <Builder />;
            }
        })()}
    </Container>
    );
}
 
export default Activity;
 