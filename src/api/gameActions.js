import { store } from '../reducers/store'

export const initializeGameHandlers = (socket) => {
    socket.on("Player Joined Game", (data) => {

        store.dispatch({
            type: "PLAYER_JOINED_GAME",
            payload: {
                gameID: data.gameID,
                title: data.title,
                isJoiningPlayer: data.isJoiningPlayer,
                playerID: data.playerID,
                name: data.name,
                playerInfo: data.playerInfo,
                orderedPlayerList: data.orderedPlayerList
            }
        })

        store.dispatch({
            type: "CLOSE_PROMPT"
        })

        store.dispatch({
            type: "CHANGE_ACTIVITY",
            payload: {
                activityName: "GAME",
                activityID: data.gameID
            }
        })

    })

    socket.on("Ready", (data) => {
        store.dispatch({
            type: "PLAYER_READY",
            payload: {
                gameID: data.gameID,
                playerID: data.playerID
            }
        })
    })

    socket.on("Not Ready", (data) => {
        store.dispatch({
            type: "PLAYER_NOT_READY",
            payload: {
                gameID: data.gameID,
                playerID: data.playerID
            }
        })
    })

    socket.on("Start Game", (gameID) => {
        store.dispatch({
            type: "START_GAME",
            payload: {
                gameID: gameID,
            }
        })
    })

    socket.on("New Object", (data) => {
        fetch("https://api.scryfall.com/cards/search?" + new URLSearchParams({
            q: "!\"" + data.name + "\""
        }))
            .then(response => response.json())
            .then(response => {
                var datum = { ...data, src: response.data[0].image_uris.png }

                store.dispatch({
                    type: "NEW_OBJECT",
                    payload: datum
                })
            });
    })

    socket.on("Remove Object", (data) => {
        store.dispatch({
            type: "REMOVE_OBJECT",
            payload: {
                gameID: data.gameID,
                controller: data.controller,
                instanceID: data.instanceID,
                zone: data.zone
            }
        })
    })

    socket.on("Give Priority", (data) => {
        store.dispatch({
            type: "GAIN_PRIORITY",
            payload: {
                gameID: data.gameID
            }
        })
    })

    socket.on("Lose Priority", (data) => {
        store.dispatch({
            type: "LOSE_PRIORITY",
            payload: {
                gameID: data.gameID
            }
        })
    })

    socket.on("Binary Question", (data) => {
        store.dispatch({
            type: "SET_QUESTION",
            payload: {
                gameID: data.gameID,
                question: data.msg
            }
        })

        store.dispatch({
            type: "CHANGE_PLAYER_STATUS",
            payload: {
                gameID: data.gameID,
                status: "ANSWERING_BINARY_QUESTION"
            }
        })
    })

    socket.on("Choose Attacks", (data) => {
        store.dispatch({
            type: "CHANGE_PLAYER_STATUS",
            payload: {
                gameID: data.gameID,
                legalTargets: data.legalTargets,
                status: "CHOOSING_ATTACKS"
            }
        })
    })

    socket.on("Choose Blocks", (data) => {
        store.dispatch({
            type: "CHANGE_PLAYER_STATUS",
            payload: {
                gameID: data.gameID,
                legalTargets: data.legalTargets,
                status: "CHOOSING_BLOCKS"
            }
        })
    })

    socket.on("Tap", (data) => {
        store.dispatch({
            type: "TAP_CARD",
            payload: {
                gameID: data.gameID,
                instanceID: data.instanceID
            }
        })
    })

}