import { createInjectStore } from 'redux-injector'
import { editDeck, updateSearchResults } from './builderReducers'
import { changeActivity } from './generalReducers'
import { updateGameListings, showCreateGamePrompt } from './serverReducers'

export const reducersObject = {
    searchResults: updateSearchResults,
    currentDeck: editDeck,
    currentActivity: changeActivity,
    gameListings: updateGameListings,
    isCreateGamePromptShowing: showCreateGamePrompt
}

export const store = createInjectStore(reducersObject)