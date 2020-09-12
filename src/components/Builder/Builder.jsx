import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux'
import SearchBar from './Search/SearchBar';
import SearchResults from './Search/SearchResults'
import DeckList from './Deck/DeskList'
import PrimaryButton from '../General/PrimaryButton'
import SecondaryButton from '../General/SecondaryButton'

const { dialog } = require('electron').remote
const path = require('path')
const fs = require('fs')
const { ipcRenderer } = require('electron')

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`
const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    margin-right: auto;
    margin-left: auto;
    height: 95%;
    width: 100%;
`

const Header = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    width: 100%;
    height: 40px;
`

const DeckTitle = styled.input`
    margin-top: 0px;
    margin-left: 300px;
    height: 100%;
    width: ${props => props.value.length * 20}px;
    font-size: xx-large;
    font-weight: bold;
    color: #d9d9d9;
    background: none;
    border: none;
`

const Builder = () => {
    const deck = useSelector((state) => state.currentDeck)
    const dispatch = useDispatch()

    const loadDeck = (event) => {
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

    const saveDeck = (event) => {
        var filePath = dialog.showSaveDialogSync({
            title: "Save Deck",
            defaultPath: path.join(__dirname, deck.title),
            buttonLabel: "Save Deck",
            filters: [{ name: 'Cardname Studio Deck', extensions: ['dck'] }, { name: 'All Files', extensions: ['*'] }]
        })

        ipcRenderer.send("Create File", filePath, JSON.stringify(deck))

    }

    const setDeckName = (event) => {
        dispatch({
            type: "SET_DECK_NAME",
            title: event.target.value
        })
    }

    return (
        <Container>
            <Header>
                <SearchBar />
                <DeckTitle type="text" value={deck.title} onChange={setDeckName}></DeckTitle>
                <SecondaryButton type="button" onClick={loadDeck} label="+ LOAD" />
                <PrimaryButton type="button" onClick={saveDeck} label="✔ SAVE" />
            </Header>
            <FlexRow>
                <SearchResults />
                <DeckList />
            </FlexRow>
        </Container>
    );
}

export default Builder;