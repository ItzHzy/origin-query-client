import { store } from '../reducers/store'

export const initializeGameHandlers = (socket) => {
    socket.on("Joined Game", (data) => {

        store.dispatch({
            type: 
        })
        store.dispatch({
            type: "SET_INTIAL_GAME_STATE",
            payload: {
                title: data.title,
                started: false,
                numPlayers: data.players.length,
                players: data.players
            }
        })

        store.dispatch({
            type: "CLOSE_PROMPT"
        })

        store.dispatch({
            type: "game"
        })
    })

    socket.on("Ready", (data) => {
        store.dispatch({
            type: "READY",
            payload: data
        })
    })

    socket.on("Not Ready", (data) => {
        store.dispatch({
            type: "NOT_READY",
            payload: data

        })
    })

    socket.on("Start Game", (data) => {
        store.dispatch({
            type: "SET_PLAYERS",
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
                    type: "ADD_CARD",
                    payload: datum
                })
            });
    })

    socket.on("Remove Object", (data) => {
        store.dispatch({
            type: "REMOVE_CARD",
            payload: data
        })
    })

    socket.on("Take Action", (data) => {
        store.dispatch({
            type: "TAKING_ACTION",
            payload: true
        })
    })

    socket.on("Binary Question", (data) => {
        store.dispatch({
            type: "SET_BINARY_QUESTION",
            payload: data
        })
    })

    socket.on("Tap", (data) => {
        store.dispatch({
            type: "TAP_CARD",
            payload: data
        })
    })

}