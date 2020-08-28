import { createInjectStore } from 'redux-injector'
import { editDeck, updateSearchResults } from './builderReducers'
import { changeActivity } from './generalReducers'
import { updateGameListings, showCreateGamePrompt } from './serverReducers'
import { reducer as formReducer } from 'redux-form'
import { updateGameBoard, playerUpdate, updateGameStatus, setPlayerStatus } from './gameReducers'

export const reducersObject = {
    searchResults: updateSearchResults,
    currentDeck: editDeck,
    currentActivity: changeActivity,
    gameListings: updateGameListings,
    isCreateGamePromptShowing: showCreateGamePrompt,
    form: formReducer,
    gameStatus: updateGameStatus,
    gameState: updateGameBoard,
    myPlayerStatus: setPlayerStatus,
    allPlayerStates: playerUpdate
}

export const store = createInjectStore(reducersObject)