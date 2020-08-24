import { store } from '../reducers/store'

export const initializeServerHandlers = (socket) => {
    socket.on('disconnect', () => {
        console.log("Disconnected");
    })

    socket.on("Login Success", (data) => {
        socket.emit("Show Games")
    })

    socket.on("Login Failed", (data) => { })

    socket.on("Show Games", (data) => {
        store.dispatch({
            type: "ALL_LISTINGS",
            games: data
        })
    })

    socket.on("Game Created", (data) => {
        store.dispatch({
            type: "NEW_GAME",
            game: data
        })
        if (data.creator == "user") {
            socket.emit("Join Game", data.gameID)
        }
    })

    socket.on("Joined Game", (data) => {
        store.dispatch({
            type: "SET_PLAYERS",
            payload: data.players
        })

        store.dispatch({
            type: "SET_GAME_STATUS",
            payload: "In Lobby"
        })

        store.dispatch({
            type: "CLOSE_PROMPT"
        })

        store.dispatch({
            type: "game"
        })
    })

    socket.on("Start Game", (data) => {
        store.dispatch({
            type: "SET_GAME_STATUS",
            payload: "In Progress"
        })
    })
}