import { createReducer } from '@reduxjs/toolkit'

export const updateGameListings = createReducer([], {
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