import { createReducer } from '@reduxjs/toolkit'
import { enableMapSet } from 'immer'

enableMapSet() // Non-serializable objects should not be in the store, but... ¯\_(ツ)_/¯-

export const updateGameState = createReducer({}, {
    "JOIN_GAME": (state, action) => {

        state[action.payload.gameID] = {
            title: action.payload.title,
            playerID: action.payload.playerID,
            takingAction: false,
            declaringAttacks: false,
            declaringBlocks: false,
            binaryQuestion: null,
            inProgress: false,
            stack: [],
            players: new Map(),
            relativePlayerList: [],
            opponentsList: [],
            declaredAttacks: [],
            declaredBlocks: []
        }

        action.payload.players.map((player) => {
            state[action.payload.gameID].players.set(player.playerID, {
                ready: player.isReady,
                manaPool: 0,
                life: 20,
                name: player.name,
                field: [],
                hand: [],
                handCount: 0,
                deck: [],
                deckCount: 0,
                grave: [],
                graveCount: 0,
                exile: [],
                exileCount: 0
            })
        })

    },
    "ADD_PLAYER": (state, action) => {
        state[action.payload.gameID].players.set(action.payload.playerID, {
            ready: false,
            manaPool: 0,
            life: 20,
            name: action.payload.name,
            field: [],
            hand: [],
            handCount: 0,
            deck: [],
            deckCount: 0,
            grave: [],
            graveCount: 0,
            exile: [],
            exileCount: 0
        })
    },
    "PLAYER_READY": (state, action) => {
        state[action.payload.gameID].players.get(action.payload.playerID).isReady = true
    },
    "PLAYER_NOT_READY": (state, action) => {
        state[action.payload.gameID].players.get(action.payload.playerID).isReady = false
    },
    "START_GAME": (state, action) => {
        state[action.payload.gameID].inProgress = true
        state[action.payload.gameID].relativePlayerList = action.payload.relativePlayerList
        state[action.payload.gameID].opponentsList = action.payload.opponentsList
    },
    "ASK_BINARY_QUESTION": (state, action) => {
        state[action.payload.gameID].binaryQuestion = action.payload.question
        return state
    },
    "TAKING_ACTION": (state, action) => {
        state[action.payload.gameID].takingAction = true
        return state
    },
    "NEW_OBJECT": (state, action) => {
        action.payload.zone == "Zone.HAND"
            ? state[action.payload.gameID].players.get(action.payload.controller).hand.push(action.payload)
            : action.payload.zone == "Zone.STACK"
                ? state[action.payload.gameID].stack.push(action.payload)
                : action.payload.zone == "Zone.FIELD"
                    ? state[action.payload.gameID].players.get(action.payload.controller).field.push(action.payload)
                    : action.payload.zone == "Zone.GRAVE"
                        ? state[action.payload.gameID].players.get(action.payload.controller).grave.push(action.payload)
                        : action.payload.zone == "Zone.EXILE"
                            ? state[action.payload.gameID].players.get(action.payload.controller).exile.push(action.payload)
                            : state[action.payload.gameID].players.get(action.payload.controller).deck.push(action.payload)
    },
    "REMOVE_OBJECT": (state, action) => {
        switch (action.payload.zone) {
            case "Zone.HAND":
                state[action.payload.gameID].players.get(action.payload.controller).hand = state[action.payload.gameID].players.get(action.payload.controller).hand.filter(card => card.instanceID != action.payload.instanceID)
            case "Zone.STACK":
                state[action.payload.gameID].stack = state[action.payload.gameID].stack.filter(card => card.instanceID != action.payload.instanceID)
            case "Zone.FIELD":
                state[action.payload.gameID].players.get(action.payload.controller).field = state[action.payload.gameID].players.get(action.payload.controller).field.filter(card => card.instanceID != action.payload.instanceID)
            case "Zone.GRAVE":
                state[action.payload.gameID].players.get(action.payload.controller).grave = state[action.payload.gameID].players.get(action.payload.controller).grave.filter(card => card.instanceID != action.payload.instanceID)
            case "Zone.EXILE":
                state[action.payload.gameID].players.get(action.payload.controller).exile = state[action.payload.gameID].players.get(action.payload.controller).exile.filter(card => card.instanceID != action.payload.instanceID)
            case "Zone.DECK":
                state[action.payload.gameID].players.get(action.payload.controller).deck = state[action.payload.gameID].players.get(action.payload.controller).deck.filter(card => card.instanceID != action.payload.instanceID)
        }
    },
    "TAP_CARD": (state, action) => {
        state[action.payload.gameID].players.get(action.payload.controller).field = state[action.payload.gameID].players.get(action.payload.controller).field.map(card => card.instanceID == action.payload.instanceID ? { ...card, tapped: true } : card)
    },
    "CHOOSING_ATTACKS": (state, action) => { state[action.payload.gameID].declaringAttacks = true },
    "FINISH_DECLARING_ATTACKS": (state, action) => { state[action.payload.gameID].declaringAttacks = false },
    "CHOOSING_BLOCKS": (state, action) => { state[action.payload.gameID].declaringBlocks = true },
    "FINISH_DECLARING_BLOCKS": (state, action) => { state[action.payload.gameID].declaringBlocks = false }
})