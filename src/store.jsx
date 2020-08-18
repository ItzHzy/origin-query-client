import { createStore, combineReducers } from 'redux'

export const searchResults = (results) => {
    return {
        type: "SEARCH_RESULTS",
        results: results
    }
}

const searchResultsReducer = (state = [], action) => {
    if (action.type == "SEARCH_RESULTS") {
        return action.results
    }
    return state
}

const rootReducer = combineReducers({ searchResults: searchResultsReducer })

export const Store = createStore(rootReducer)