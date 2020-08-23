import { dispatch } from 'redux'

export const initializeServerHandlers = (socket) => {
    socket.on('connect', () => {
        console.log("Connected");
        socket.emit('Show Games')
    })

    socket.on('disconnect', () => {
        console.log("Disconnected");
    })

    socket.on("Show Games", (data) => {
        dispatch({
            type: "ALL_LISTINGS",
            games: data
        })
    })
}