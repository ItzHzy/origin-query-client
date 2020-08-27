import { createReducer } from '@reduxjs/toolkit'

export const setGameStatus = createReducer(null, {
    "SET_GAME_STATUS": (state, action) => { return action.payload },
})

export const setPlayers = createReducer([], {
    "SET_PLAYERS": (state, action) => { return action.payload },
    "ADD_PLAYER": (state, action) => { return state.concat(action.payload) },
    "REMOVE_PLAYER": (state, action) => { return state.remove(action.payload) },
    "SET_BINARY_QUESTION": (state, action) => {
        state[0].binaryQuestion = action.payload
        return state
    },
    "TAKING_ACTION": (state, action) => {
        state[0].takingAction = action.payload
        return state
    }
})

export const setGameState = createReducer([], {
    "ADD_CARD": (state, action) => {
        return state.concat(action.payload)
    },
    "REMOVE_CARD": (state, action) => { return state.filter(card => (card.instanceID != action.payload)) },
    "SET_STATE": (state, action) => { return action.payload },
    "TAP_CARD": (state, action) => {
        state[state.findIndex(card => (card.instanceID == action.payload))].tapped = true
    }
})