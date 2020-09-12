import io from 'socket.io-client';
import { initializeServerHandlers } from './serverActions'
import { initializeGameHandlers } from './gameActions'
import config from '../config'

export let client = io.connect(config.get("serverAddress"), {
    transports: ['websocket']
})

export const connectToServer = (serverAddress) => {
    client = io.connect(serverAddress)
};

client.on('connect', () => {
    console.log("Connected");
    initializeServerHandlers(client)
    initializeGameHandlers(client)
    client.emit("Login", { user: "user", pass: "pass" })
})