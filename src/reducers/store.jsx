import { createInjectStore } from 'redux-injector'
import { editDeck, updateSearchResults } from './builderReducers'
import { changeActivity } from './generalReducers'
import { updateGameListings, showCreateGamePrompt } from './serverReducers'
import { reducer as formReducer } from 'redux-form'
import { setGameState, setPlayers, setGameStatus } from './gameReducers'

export const reducersObject = {
    searchResults: updateSearchResults,
    currentDeck: editDeck,
    currentActivity: changeActivity,
    gameListings: updateGameListings,
    isCreateGamePromptShowing: showCreateGamePrompt,
    form: formReducer,
    gameStatus: setGameStatus,
    players: setPlayers,
    gameState: setGameState
}

export const store = createInjectStore(reducersObject)