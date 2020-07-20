const WebSocket = require('ws')
import { settings, writeToConfig } from './config.js'
import { joinGame, ready, notReady, startGame, lobby__readyBtn } from './game-page.js'
import { stateUpdate } from './game-page.js'

var playerName
var serverConn
var loginFailedOnce = false

if (settings.rememberMe == true) {
    document.forms["username"]["username-entry"].value = settings.username
    document.forms["password"]["password-entry"].value = settings.pass
    document.forms["server"]["server-entry"].value = settings.serverAddr
    document.getElementById('remember-me').checked = true
}


/**
 * Connects to specified server and sends a login request. 
 * Server will respond with a "Login Successful" message if successful,
 * otherwise it will send a "Login Failed" message.
 */
function loginRequest() {
    var user = document.forms["username"]["username-entry"].value
    playerName = user
    var pass = document.forms["password"]["password-entry"].value
    var address = document.forms["server"]["server-entry"].value
    try {
        serverConn = new WebSocket("ws://" + address + ":2129", { perMessageDeflate: true })

        var msg = {
            "user": user,
            "pass": pass
        }

        serverConn.on('open', () => {
            serverConn.send(JSON.stringify(msg))
        })
        serverConn.on('message', msg_handler)
        serverConn.on('close', (event) => { document.getElementById("serverMenu").style.display = "none" })
    } catch (error) {
        console.log(error)
    }
}


/**
 * Handles "Login Success" messages.
 * Closes login prompt and sends a "Show Games" message to the server.
 * Server will respond with an array of currently listed games.
 */
function loginSuccess() {
    document.getElementById('login-prompt').classList.remove("prompt")
    document.getElementById("serverMenu").style.display = "flex"
    serverConn.send(JSON.stringify({ "type": "Show Games" }))
}


/**
 * Handles "Login Failed" messages.
 * Adds error message to bottom of login prompt.
 */
function loginFailed() {
    if (!loginFailedOnce) {
        var errorMsg = document.createElement('div')
        errorMsg.style = "margin-left: automargin-right: autoheight: fit-contentwidth: fit-contentcolor: #a83236font-weight: bolderfont-size: largemargin-bottom: 15px"
        errorMsg.appendChild(document.createTextNode("Username or Password is Incorrect!"))
        document.getElementById('login-prompt').appendChild(errorMsg)
    }
}


/**
 * Opens game creation prompt.
 * @param {MouseEvent} event
 */
function gameCreationPrompt(event) {
    document.getElementById("serverMenu").style.filter = "blur(5px)"
    document.getElementById("createGamePrompt").style.display = "flex"

    // timeouts before opening so that styles can update
    window.setTimeout(function() {
        document.getElementById("createGamePrompt").classList.add("prompt")
    }, 100)
}

/**
 * Closes game creation prompt.
 */
function cancelGameCreation() {
    document.getElementById("createGamePrompt").classList.remove("prompt")
    document.getElementById("serverMenu").style.filter = ""
    document.forms["createGame"]["title"].value = ""
    document.forms["numPlayersChosen"]["num"].value = ""
}


/**
 * Sends the details of the game to the server.
 * Server will respond with a "Create Game" message if successful
 * @param {MouseEvent} event
 */
function createGame(event) {
    if (document.forms["createGame"]["title"].value != "" && document.forms["numPlayersChosen"]["num"].value != "") {
        var msg = {
            type: "Create Game",
            data: {
                "title": document.forms["createGame"]["title"].value,
                "numPlayers": document.forms["numPlayersChosen"]["num"].value
            }
        }
        serverConn.send(JSON.stringify(msg))
    }
    cancelGameCreation()
}

/**
 * Handles "Create Game" messages.
 * Updates current game listings on client
 * @param {Object} data 
 */
function gameCreated(data) {
    document.getElementById("gameListings").style.border = "solid black"
    var gameListing = document.createElement("div")
    gameListing.className = "server__game-listing"
    gameListing.setAttribute('data-game-id', data.gameID)

    var gameListing_name = document.createElement("div")
    gameListing_name.appendChild(document.createTextNode(data.title))
    gameListing_name.className = "server__game-listing--name"
    gameListing_name.setAttribute('data-game-id', data.gameID)
    gameListing.appendChild(gameListing_name)

    var gameListing_creator = document.createElement("div")
    gameListing_creator.appendChild(document.createTextNode(data.creator))
    gameListing_creator.className = "server__game-listing--creator"
    gameListing_creator.setAttribute('data-game-id', data.gameID)
    gameListing.appendChild(gameListing_creator)

    var gameListing_num = document.createElement("div")
    gameListing_num.appendChild(document.createTextNode(data.numPlayers))
    gameListing_num.className = "server__game-listing--num"
    gameListing_num.setAttribute('data-game-id', data.gameID)
    gameListing.appendChild(gameListing_num)

    var gameListing_status = document.createElement("div")
    gameListing_status.appendChild(document.createTextNode(data.status))
    gameListing_status.className = "server__game-listing--status"
    gameListing_status.setAttribute('data-game-id', data.gameID)
    gameListing.appendChild(gameListing_status)

    gameListing.addEventListener('dblclick', joinGameButton)
    document.getElementById("gameListings").appendChild(gameListing)
}

/**
 * Sends a "Join Game" message to the server with the game id
 * Server will respond with a "Join Game" message if successful
 * @param {MouseEvent|Object} data 
 */
function joinGameButton(data) {
    var game_id

    if (data instanceof MouseEvent) {
        game_id = data.srcElement.getAttribute('data-game-id')
    } else {
        game_id = data.gameID
    }

    var msg = {
        "type": "Join Game",
        "data": {
            "gameID": game_id
        }
    }
    serverConn.send(JSON.stringify(msg))
}

/**
 * Handles "Show Games" messages.
 * Populates client with all current games on server 
 * @param {Object} data 
 */
function showGames(data) {
    if (data.length != 0) {
        for (const index in data) {
            var game = data[index]
            document.getElementById("gameListings").style.border = "solid black"
            var gameListing = document.createElement("div")
            gameListing.className = "server__game-listing"
            gameListing.setAttribute('data-game-id', game.gameID)

            var gameListing_name = document.createElement("div")
            gameListing_name.appendChild(document.createTextNode(game.title))
            gameListing_name.className = "server__game-listing--name"
            gameListing_name.setAttribute('data-game-id', game.gameID)
            gameListing.appendChild(gameListing_name)

            var gameListing_creator = document.createElement("div")
            gameListing_creator.appendChild(document.createTextNode(game.creator))
            gameListing_creator.className = "server__game-listing--creator"
            gameListing_creator.setAttribute('data-game-id', game.gameID)
            gameListing.appendChild(gameListing_creator)

            var gameListing_num = document.createElement("div")
            gameListing_num.appendChild(document.createTextNode(game.numPlayers))
            gameListing_num.className = "server__game-listing--num"
            gameListing_num.setAttribute('data-game-id', game.gameID)
            gameListing.appendChild(gameListing_num)

            var gameListing_status = document.createElement("div")
            gameListing_status.appendChild(document.createTextNode(game.status))
            gameListing_status.className = "server__game-listing--status"
            gameListing_status.setAttribute('data-game-id', game.gameID)
            gameListing.appendChild(gameListing_status)

            gameListing.addEventListener('dblclick', joinGameButton)
            document.getElementById("gameListings").appendChild(gameListing)
        }
    }
}


/**
 *  Main message handler.
 *  Will break off to different code branchs depending on the data 
 * @param {{type: string, class: string, data: any}} data 
 */
function msg_handler(data) {
    var msg = JSON.parse(data)
    if (msg.class == "Server") {
        server_msg_handler(msg)
    }
    if (msg.class == "Game") {
        game_msg_handler(msg)
    }
}

/**
 * Handles messages relating to the server in general
 * @param {Object} msg 
 */
function server_msg_handler(msg) {
    switch (msg.type) {
        case "Login":
            if (msg.result == "Success") {
                loginSuccess()
            } else {
                loginFailed()
            }
            break

        case "Show Games":
            showGames(msg.data)
            break

        case "Create Game":
            gameCreated(msg.data)
            if (playerName == msg.data.creator) {
                joinGameButton(msg.data)
            }
            break

        case "Join Game":
            joinGame(msg.data)
            break

        case "Ready":
            ready(msg.data)
            break

        case "Not Ready":
            notReady(msg.data)
            break

        case "Choose Deck":
            lobby__readyBtn.style.display = "block"
            break

        case "Start Game":
            startGame(msg.data)
            break

        case "State Update":
            stateUpdate(msg.data)
            break

        case "Choose":

            break
        default:
            console.log(`Received malformed message: ${JSON.stringify(msg)}`)
    }
}

/**
 * Handles messages relating to currently running games joined by the client
 * @param {Object} msg 
 */
function game_msg_handler(msg) {
    switch (msg.type) {

        case "State Update":
            stateUpdate(msg.data)
            break

        case "Choose":
            break

        default:
            console.log(`Received malformed message: ${JSON.stringify(msg)}`)
    }
}

document.getElementById("createGamePromptButton").addEventListener('click', gameCreationPrompt)
document.getElementById("cancelCreationButton").addEventListener('click', cancelGameCreation)
document.getElementById("createGameButton").addEventListener('click', createGame)
document.getElementById('login-btn').addEventListener('click', loginRequest)

// Enables remembering credential on the login prompt
document.getElementById('remember-me').addEventListener('click', (e) => {
    if (e.srcElement.checked) {
        settings.username = document.forms["username"]["username-entry"].value
        settings.pass = document.forms["password"]["password-entry"].value
        settings.serverAddr = document.forms["server"]["server-entry"].value
        settings.rememberMe = true
        writeToConfig()
    } else {
        settings.rememberMe = false
        writeToConfig()
    }
})

export { serverConn, cancelGameCreation }