import { combineReducers } from 'redux'
import { Stats } from 'webpack'

const searchResultsReducer = (state = [], action) => {
    if (action.type == "SEARCH_RESULTS") {
        return action.results
    }
    return state
}

const deckReducer = (state = { title: "Untitled", contents: {} }, action) => {
    var newState = {};
    Object.assign(newState, state)

    switch (action.type) {
        case "ADD_TO_DECK":
            if (action.card in newState.contents) {
                newState.contents[action.card] += 1
            } else {
                newState.contents[action.card] = 1
            }
            return newState

        case "REMOVE_FROM_DECK":
            if (action.card in newState.contents) {
                if (newState.contents[action.card] == 1) {
                    delete newState.contents[action.card]
                } else {
                    newState.contents[action.card] -= 1
                }
            }
            return newState

        case "LOAD_DECK":
            return action.deck

        case "SET_DECK_NAME":
            newState.title = action.title
            return newState

        default:
            return state
    }
}

const changePage = (state = "settings", action) => {
    switch (action.type) {
        case "builder":
            return "builder"
        case "stats":
            return "stats"
        case "server":
            return "server"
        case "settings":
            return "settings"
        default:
            return "settings"
    }
}



export const rootReducer = combineReducers({
    searchResults: searchResultsReducer,
    currentDeck: deckReducer,
    currentPage: changePage
})