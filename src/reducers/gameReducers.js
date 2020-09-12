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
                legalTargets: [],
                manaPool: {
                    "Color.WHITE": 0,
                    "Color.BLUE": 0,
                    "Color.BLACK": 0,
                    "Color.RED": 0,
                    "Color.GREEN": 0,
                },
                zoneBeingShown: null
            } : null

        action.payload.playerInfo.map((player) => {
            state[action.payload.gameID].players[player.playerID] = {
                ready: action.payload.isReady,
                life: -1,
                name: action.payload.name,
                "Zone.FIELD": {},
                "Zone.HAND": [],
                "Zone.DECK": [],
                "Zone.GRAVE": [],
                "Zone.EXILE": [],
                zoneSizes: {
                    "Zone.HAND": 0,
                    "Zone.DECK": 0,
                    "Zone.GRAVE": 0,
                    "Zone.EXILE": 0,
                }
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
        state[action.payload.gameID].answer = null

        action.payload.status == "CHOOSING_ATTACKS" || action.payload.status == "CHOOSING_BLOCKS"
            ? state[action.payload.gameID].answer = {} : null

        action.payload.status == "CHOOSING_ATTACKS" || action.payload.status == "CHOOSING_BLOCKS"
            ? state[action.payload.gameID].legalTargets = action.payload.legalTargets : null

        action.payload.status == "PAYING_MANA"
            ? state[action.payload.gameID].legalTargets = action.payload.legalTargets : null

        action.payload.status == "PAYING_MANA"
            ? state[action.payload.gameID].answer = {
                "Color.WHITE": 0,
                "Color.BLUE": 0,
                "Color.BLACK": 0,
                "Color.RED": 0,
                "Color.GREEN": 0,
                "Color.COLORLESS": 0
            } : null

        state[action.payload.gameID].status = action.payload.status
    },
    "LIFE_TOTAL_UPDATE": (state, action) => {
        state[action.payload.gameID].players[action.payload.playerID].life = action.payload.life
    },
    "MANA_UPDATE": (state, action) => {
        state[action.payload.gameID].manaPool[action.payload.color] = action.payload.amount
    },
    "SHOW_ZONE": (state, action) => {
        JSON.stringify(state[action.payload.gameID].zoneBeingShown) != JSON.stringify(state[action.payload.gameID].players[action.payload.playerID][action.payload.zone]).toString()
            ? state[action.payload.gameID].zoneBeingShown = state[action.payload.gameID].players[action.payload.playerID][action.payload.zone]
            : state[action.payload.gameID].zoneBeingShown = null
    },
    "GAIN_PRIORITY": (state, action) => {
        state[action.payload.gameID].hasPriority = true
    },
    "LOSE_PRIORITY": (state, action) => {
        state[action.payload.gameID].hasPriority = false
    },
    "ADD_ONE_MANA_TO_PAYMENT": (state, action) => {
        state[action.payload.gameID].manaPool[action.payload.color] - state[action.payload.gameID].answer[action.payload.color] != 0
            ? state[action.payload.gameID].answer[action.payload.color] += 1 : null
    },
    "SUBTRACT_ONE_MANA_FROM_PAYMENT": (state, action) => {
        state[action.payload.gameID].answer[action.payload.color] > 0
            ? state[action.payload.gameID].answer[action.payload.color] -= 1 : null
    },
    "DECLARE_ATTACK": (state, action) => {
        state[action.payload.gameID].answer[action.payload.attacker] = action.payload.defender
    },
    "DECLARE_BLOCK": (state, action) => {
        action.payload.blocker in state[action.payload.gameID].declaredBlocks
            ? state[action.payload.gameID].answer[action.payload.blocker].push(action.payload.attacker)
            : state[action.payload.gameID].answer[action.payload.blocker] = [action.payload.attacker]
    },
    "UPDATE_ZONE_SIZE": (state, action) => {
        state[action.payload.gameID].players[action.payload.playerID].zoneSizes[action.payload.zoneType] = action.payload.num
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