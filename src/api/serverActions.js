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
    })

    socket.on("Force Join Game", (data) => {
        socket.emit("Join Game", data)
    })
}