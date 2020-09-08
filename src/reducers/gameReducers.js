import { createReducer } from '@reduxjs/toolkit'
import { enableMapSet } from 'immer'

enableMapSet() // Non-serializable objects should not be in the store, but... ¯\_(ツ)_/¯-

export const updateGameState = createReducer({}, {
    "PLAYER_JOINED_GAME": (state, action) => {

        action.payload.isJoiningPlayer
            ? state[action.payload.gameID] = {
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
                opponents: [], // list of opponent player IDs and names
                status: null,
                hasPriority: false,
                question: null,
                answer: null,
                legalTargets: []
            } : null

        action.payload.playerInfo.map((player) => {
            state[action.payload.gameID].players[player.playerID] = {
                ready: action.payload.isReady,
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

        action.payload.orderedPlayerList.length > 1
            ? state[action.payload.gameID].opponents = action.payload.orderedPlayerList.slice(1) : null

    },
    "PLAYER_READY": (state, action) => {
        state[action.payload.gameID].players[action.payload.playerID].isReady = true
    },
    "PLAYER_NOT_READY": (state, action) => {
        state[action.payload.gameID].players[action.payload.playerID].isReady = false
    },
    "START_GAME": (state, action) => {
        state[action.payload.gameID].inProgress = true
    },
    "SET_QUESTION": (state, action) => {
        state[action.payload.gameID].question = action.payload.question
    },
    "CHANGE_PLAYER_STATUS": (state, action) => {
        state[action.payload.gameID].question = null

        action.payload.status == "CHOOSING_ATTACKS" || action.payload.status == "CHOOSING_BLOCKS"
            ? state[action.payload.gameID].answer = {}
            : state[action.payload.gameID].answer = null

        action.payload.status == "CHOOSING_ATTACKS" || action.payload.status == "CHOOSING_BLOCKS"
            ? state[action.payload.gameID].legalTargets = action.payload.legalTargets
            : null

        state[action.payload.gameID].status = action.payload.status
    },
    "GAIN_PRIORITY": (state, action) => {
        state[action.payload.gameID].hasPriority = true
    },
    "LOSE_PRIORITY": (state, action) => {
        state[action.payload.gameID].hasPriority = false
    },
    "DECLARE_ATTACK": (state, action) => {
        state[action.payload.gameID].answer[action.payload.attacker] = action.payload.defender
    },
    "DECLARE_BLOCK": (state, action) => {
        action.payload.blocker in state[action.payload.gameID].declaredBlocks
            ? state[action.payload.gameID].answer[action.payload.blocker].push(action.payload.attacker)
            : state[action.payload.gameID].answer[action.payload.blocker] = [action.payload.attacker]
    },
    "NEW_OBJECT": (state, action) => {
        state[action.payload.gameID].cards[action.payload.instanceID] = {
            ...action.payload,
            canAttack: false
        }

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

    // Card updates
    "TAP_CARD": (state, action) => {
        state[action.payload.gameID].cards[action.payload.instanceID].tapped = true
    }
})