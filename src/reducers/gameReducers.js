import { createReducer } from '@reduxjs/toolkit'

// {
//     title: data.title,
//     started: false,
//     numPlayers: data.players.length,
//     players: data.players
// }
export const updateGameStatus = createReducer(null, {
    "SET_INTIAL_GAME_STATE": (state, action) => { return action.payload },
    "READY": (state, action) => {
        state.players[state.players.findIndex((player) => (player.playerID == action.payload))].ready = true
    },
    "NOT_READY": (state, action) => {
        state.players[state.players.findIndex((player) => (player.playerID == action.payload))].ready = false
    }
})

// {
//     binaryQuestion: null,
//     takingAction: false
// }
export const setPlayerStatus = createReducer(null, {
    "SET_INITIAL_PLAYER_STATE": (state, action) => { state ? null : action.payload },
    "SET_BINARY_QUESTION": (state, action) => {
        state.binaryQuestion = action.payload
        return state
    },
    "TAKING_ACTION": (state, action) => {
        state.takingAction = action.payload
        return state
    }
})

// [{
//     "playerID": p.playerID,
//     "name": p.name,
//     "lifeTotal": p.lifeTotal,
//     "flavorText": p.flavorText,
//     "profilePic": p.pfp,
//     "totalMana": 0,
//     "handCount": len(p.hand),
//     "exileCount": len(p.exile),
//     "graveCount": len(p.grave),
//     "deckCount": len(p.deck)
// }]

export const playerUpdate = createReducer([], {
    "SET_PLAYERS": (state, action) => { return action.payload },
    "ADD_PLAYER": (state, action) => { return state.concat(action.payload) },
    "REMOVE_PLAYER": (state, action) => { return state.remove(action.payload) }
})

export const updateGameBoard = createReducer([], {
    "ADD_CARD": (state, action) => {
        return state.concat(action.payload)
    },
    "REMOVE_CARD": (state, action) => { return state.filter(card => (card.instanceID != action.payload)) },
    "SET_STATE": (state, action) => { return action.payload },
    "TAP_CARD": (state, action) => {
        state[state.findIndex(card => (card.instanceID == action.payload))].tapped = true
    }
})