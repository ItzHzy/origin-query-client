import { createReducer } from '@reduxjs/toolkit'
import { enableMapSet } from 'immer'

enableMapSet() // Non-serializable objects should not be in the store, but... ¯\_(ツ)_/¯-

export const updateGameState = createReducer({}, {
    "JOIN_GAME": (state, action) => {

        state[action.payload.gameID] = {
            // general game information
            title: action.payload.title,
            activePlayer: null,
            phase: null,
            stack: [],
            players: {},
            cards: {}, // stores all card data
            inProgress: false,
            combatMatrix: null, // currently unused 

            //Client specific
            playerID: action.payload.playerID, // personal player ID
            opponents: [], // list of opponent player IDs
            takingAction: false,
            declaringAttacks: false,
            declaringBlocks: false,
            binaryQuestion: null,
            chosenAttacks: [],
            chosenBlocks: []
        }

        action.payload.players.map((player) => {
            state[action.payload.gameID].players[player.playerID] = {
                ready: false,
                manaPool: 0,
                life: 20,
                name: action.payload.name,
                "Zone.FIELD": {},
                "Zone.HAND": [],
                "Zone.DECK": [],
                "Zone.GRAVE": [],
                "Zone.EXILE": [],
                handCount: 0,
                deckCount: 0,
                graveCount: 0,
                exileCount: 0
            }
        })

    },
    "ADD_PLAYER": (state, action) => {
        state[action.payload.gameID].players[action.payload.playerID] = {
            ready: false,
            manaPool: 0,
            life: 20,
            name: action.payload.name,
            "Zone.FIELD": {},
            "Zone.HAND": [],
            "Zone.DECK": [],
            "Zone.GRAVE": [],
            "Zone.EXILE": [],
            handCount: 0,
            deckCount: 0,
            graveCount: 0,
            exileCount: 0
        }
    },
    "PLAYER_READY": (state, action) => {
        state[action.payload.gameID].players[action.payload.playerID].isReady = true
    },
    "PLAYER_NOT_READY": (state, action) => {
        state[action.payload.gameID].players[action.payload.playerID].isReady = false
    },
    "START_GAME": (state, action) => {
        state[action.payload.gameID].inProgress = true
        state[action.payload.gameID].playerID = action.payload.playerList[0]

        action.payload.playerList.length > 1
            ? state[action.payload.gameID].opponents = action.payload.playerList.slice(1) : null
    },
    "ASK_BINARY_QUESTION": (state, action) => {
        state[action.payload.gameID].binaryQuestion = action.payload.question
    },
    "TAKING_ACTION": (state, action) => {
        state[action.payload.gameID].takingAction = true
    },
    "NEW_OBJECT": (state, action) => {
        state[action.payload.gameID].cards[action.payload.instanceID] = action.payload

        action.payload.zone == "Zone.STACK"
            ? state[action.payload.gameID].stack.push(action.payload.instanceID)
            : action.payload.zone == "Zone.FIELD"
                ? state[action.payload.gameID].players[action.payload.controller][action.payload.zone][action.payload.instanceID] = action.payload.types.includes("Type.LAND")
                : state[action.payload.gameID].players[action.payload.controller][action.payload.zone].push(action.payload.instanceID)

    },
    "REMOVE_OBJECT": (state, action) => {
        action.payload.zone == "Zone.STACK"
            ? state[action.payload.gameID].stack = state[action.payload.gameID].stack.filter(instanceID => instanceID != action.payload.instanceID)
            : action.payload.zone == "Zone.FIELD"
                ? delete state[action.payload.gameID].players[action.payload.controller][action.payload.zone][action.payload.instanceID]
                : state[action.payload.gameID].players[action.payload.controller][action.payload.zone] = state[action.payload.gameID].players[action.payload.controller][action.payload.zone].filter(instanceID => instanceID != action.payload.instanceID)

        delete state[action.payload.gameID].cards[action.payload.instanceID]
    },
    "CHOOSING_ATTACKS": (state, action) => { state[action.payload.gameID].declaringAttacks = true },
    "FINISH_DECLARING_ATTACKS": (state, action) => { state[action.payload.gameID].declaringAttacks = false },
    "CHOOSING_BLOCKS": (state, action) => { state[action.payload.gameID].declaringBlocks = true },
    "FINISH_DECLARING_BLOCKS": (state, action) => { state[action.payload.gameID].declaringBlocks = false },

    // Card updates
    "TAP_CARD": (state, action) => {
        state[action.payload.gameID].cards[action.payload.instanceID].tapped = true
    },
})