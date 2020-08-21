import React from 'react';
import styled from 'styled-components'
import PrimaryButton from '../General/PrimaryButton'

const Container = styled.div`
    height: 100%;
    width: 100%;
`
const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 10px;
    width: 100%;
    height: 40px;
`
const GameListings = styled.div`
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    height: 92%;
    width: 98%;
    border: solid 3px black;
`

const Server = () => {
    return (
        <Container>
            <Header>
                <PrimaryButton label="+ CREATE" />
            </Header>
            <GameListings></GameListings>
        </Container>
    );
}

export default Server;