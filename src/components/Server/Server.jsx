import React from 'react';
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import PrimaryButton from '../General/PrimaryButton'
import GameListing from './GameListing'
import CreateGamePrompt from './CreateGamePrompt'

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
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 5px;
    height: 92%;
    width: 98%;
    border: solid 3px black;
`
const Hekma = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: black;
    opacity: 30%;
`

const Server = () => {
    const dispatch = useDispatch()
    const isCreateGamePromptShowing = useSelector(state => state.isCreateGamePromptShowing)
    const gameListings = useSelector((state) => state.gameListings)

    const showCreateGamePrompt = () => {
        dispatch({
            type: "SHOW_PROMPT"
        })
    }

    const closeCreateGamePrompt = () => {
        dispatch({
            type: "CLOSE_PROMPT"
        })
    }

    return (
        <Container>
            {isCreateGamePromptShowing ? <><Hekma onClick={closeCreateGamePrompt}></Hekma><CreateGamePrompt></CreateGamePrompt></> : []}
            <Header>
                <PrimaryButton label="+ CREATE" onClick={showCreateGamePrompt} />
            </Header>
            <GameListings>
                {gameListings.map((game) => {
                    return <GameListing key={game.gameID + "-Listing"} title={game.title} creator={game.creator} numPlayers={game.numPlayers} status={game.status} gameID={game.gameID} />
                })}
            </GameListings>
        </Container>
    );
}

export default Server;