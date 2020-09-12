import { createReducer } from '@reduxjs/toolkit'

export const editDeck = createReducer({ title: "Untitled", contents: {} }, {
    ADD_TO_DECK: (state, action) => {
        if (action.card in state.contents) {
            state.contents[action.card] += 1
            return state
        }
        state.contents[action.card] = 1
        return state
    },
    REMOVE_FROM_DECK: (state, action) => {
        if (action.card in state.contents) {
            if (state.contents[action.card] == 1) {
                delete state.contents[action.card]
            } else {
                state.contents[action.card] -= 1
            }
        }
        return state
    },
    LOAD_DECK: (state, action) => {
        return action.deck
    },
    SET_DECK_NAME: (state, action) => {
        state.title = action.title
        return state
    }
})

export const updateSearchResults = createReducer([], {
    "SEARCH_RESULTS": (state, action) => {
        return action.results
    }
})