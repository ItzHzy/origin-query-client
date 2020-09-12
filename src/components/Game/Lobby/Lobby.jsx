import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux'
import { client } from '../../../api/socket'
import DeckList from './DeckList'
import PlayerList from './PlayerList'
import PrimaryButton from '../../General/PrimaryButton'

const { dialog } = require('electron').remote
const path = require('path')
const fs = require('fs')
const { ipcRenderer } = require('electron')

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
    justify-content: flex-end;


    &>:first-child{
        margin-right: 15px;
        margin-left: auto;
    }

    &>:last-child{
        margin-right: 30px;
        margin-left: 10px;
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

const Lobby = (props) => {
    const deck = useSelector(state => state.currentDeck)
    const dispatch = useDispatch()

    const ready = () => {
        client.emit("Choose Deck", deck.contents)

        client.emit("Ready")
    }

    const loadDeck = () => {
        var filePath = dialog.showOpenDialogSync({
            title: "Load Deck",
            defaultPath: path.join(__dirname, "deck"),
            buttonLabel: "Load Deck",
            filters: [{ name: 'Cardname Studio Deck', extensions: ['dck'] }, { name: 'All Files', extensions: ['*'] }]
        })[0]

        dispatch({
            type: "LOAD_DECK",
            deck: JSON.parse(fs.readFileSync(path.resolve(filePath)))
        })
    }

    return (
        <Container>
            <Header>
                <PrimaryButton label={"Load"} onClick={loadDeck} />
                <PrimaryButton label={"Ready"} onClick={ready} />
            </Header>
            <Content>
                <DeckList />
                <PlayerList gameID={props.gameID} />
            </Content>
        </Container>
    );
}

export default Lobby;