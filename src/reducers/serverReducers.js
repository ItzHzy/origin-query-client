import { createReducer } from '@reduxjs/toolkit'

const testGameListings = [
    {
        gameID: "1",
        title: "Test",
        creator: "Test",
        numPlayers: "34",
        status: "OPEN"
    },
    {
        gameID: "2",
        title: "Test2",
        creator: "Test2",
        numPlayers: "4",
        status: "OPEN"
    },
    {
        gameID: "3",
        title: "Test3",
        creator: "Test3",
        numPlayers: "23",
        status: "OPEN"
    }
]

export const updateGameListings = createReducer(testGameListings, {
    "ALL_LISTINGS": (state, action) => {
        return action.games
    },
    "NEW_GAME": (state, action) => {
        return state.concat(action.game)
    }
})

export const showCreateGamePrompt = createReducer(false, {
    "SHOW_PROMPT": (state, action) => {
        return true;
    },
    "CLOSE_PROMPT": (state, action) => {
        return false;
    }
})