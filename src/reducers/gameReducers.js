import { createReducer } from '@reduxjs/toolkit'

export const setGameStatus = createReducer(null, {
    "SET_GAME_STATUS": (state, action) => { return action.payload }
})

export const setPlayers = createReducer([], {
    "SET_PLAYERS": (state, action) => { return action.payload },
    "ADD_PLAYER": (state, action) => { return state.concat(action.payload) },
    "REMOVE_PLAYER": (state, action) => { return state.remove(action.payload) }
})

export const setGameState = createReducer([], {
    "ADD_CARD": (state, action) => { return state.concat(action.payload) },
    "SET_STATE": (state, action) => { return action.payload }
})