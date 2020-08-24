import React from 'react';
import styled from 'styled-components';
import { client } from '../../../api/socket'
import DeckList from './DeckList'
import PlayerList from './PlayerList'
import PrimaryButton from '../../General/PrimaryButton'

const Container = styled.div`
    height: 100%;
    width: 100%;
`
const Header = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    width: 100%;
    height: 40px;

    &>:last-child{
        margin-right: 10px;
        margin-left: auto;
    }
`

const Content = styled.div`
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    height: 93%;
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const Lobby = () => {

    const ready = () => {
        client.emit("Ready")
    }

    return (
        <Container>
            <Header>
                <PrimaryButton label={"Ready"} onCLick={ready} />
            </Header>
            <Content>
                <DeckList />
                <PlayerList />
            </Content>
        </Container>
    );
}

export default Lobby;