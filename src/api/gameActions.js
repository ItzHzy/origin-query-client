import { store } from '../reducers/store'

export const initializeGameHandlers = (socket) => {
    socket.on("You Joined Game", (data) => {

        store.dispatch({
            type: "JOIN_GAME",
            payload: {
                gameID: data.gameID,
                playerID: data.playerID,
                players: data.players
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

    socket.on("Another Joined Game", (data) => {
        store.dispatch({
            type: "ADD_PLAYER",
            payload: {
                gameID: data.gameID,
                playerID: data.playerID,
                name: data.name
            }
        })
    })

    socket.on("Ready", (data) => {
        store.dispatch({
            type: "PLAYER_READY",
            payload: data
        })
    })

    socket.on("Not Ready", (data) => {
        store.dispatch({
            type: "PLAYER_NOT_READY",
            payload: data

        })
    })

    socket.on("Start Game", (data) => {
        console.log(data)
        store.dispatch({
            type: "START_GAME",
            payload: data
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

    socket.on("Take Action", (data) => {
        store.dispatch({
            type: "TAKING_ACTION",
            payload: {
                gameID: data
            }
        })
    })

    socket.on("Binary Question", (data) => {
        store.dispatch({
            type: "ASK_BINARY_QUESTION",
            payload: {
                gameID: data.gameID,
                question: data.msg
            }
        })
    })

    socket.on("Tap", (data) => {
        store.dispatch({
            type: "TAP_CARD",
            payload: {
                gameID: data.gameID,
                controller: data.controller,
                instanceID: data.instanceID
            }
        })
    })

    socket.on("Choose Attacks", (data) => {
        store.dispatch({
            type: "CHOOSING_ATTACKS",
            payload: {
                gameID: data
            }
        })
    })

    socket.on("Choose Blocks", (data) => {
        store.dispatch({
            type: "CHOOSING_BLOCKS",
            payload: {
                gameID: data
            }
        })
    })

}