const WebSocket = require('ws');
import { settings, writeToConfig } from './config.js'
import { joinGame, ready, notReady, startGame, lobby__readyBtn } from './game-page.js'
import { stateUpdate } from './game-page.js'
export { serverConn, cancelGameCreation }

const menu = document.getElementById("serverMenu")
const gameListings = document.getElementById("gameListings")

const createGamePromptButton = document.getElementById("createGamePromptButton")
const createGamePrompt = document.getElementById("createGamePrompt")
const cancelCreationButton = document.getElementById("cancelCreationButton")
const createGameButton = document.getElementById("createGameButton")

const loginPrompt = document.getElementById('login-prompt')
const loginBtn = document.getElementById('login-btn')

const title = document.forms["createGame"]["title"]
const numPlayers = document.forms["numPlayersChosen"]["num"]
var games = {}
var playerName;
var serverConn;
var loginFailedOnce = false

createGamePromptButton.addEventListener('click', gameCreationPrompt)
cancelCreationButton.addEventListener('click', cancelGameCreation)
createGameButton.addEventListener('click', createGame)
loginBtn.addEventListener('click', loginRequest)
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

if (settings.rememberMe == true) {
    document.forms["username"]["username-entry"].value = settings.username
    document.forms["password"]["password-entry"].value = settings.pass
    document.forms["server"]["server-entry"].value = settings.serverAddr
    document.getElementById('remember-me').checked = true
}


function loginRequest() {
    var user = document.forms["username"]["username-entry"].value
    playerName = user
    var pass = document.forms["password"]["password-entry"].value
    var address = document.forms["server"]["server-entry"].value
    try {
        serverConn = new WebSocket("ws://" + address + ":2129", { perMessageDeflate: true });

        var msg = {
            "user": user,
            "pass": pass
        }

        serverConn.on('open', () => {
            serverConn.send(JSON.stringify(msg))
        })
        serverConn.on('message', msg_handler)
        serverConn.on('close', closed)
    } catch (error) {
        console.log(error);
    }
}

function loginSuccess() {
    loginPrompt.classList.remove("prompt")
    menu.style.display = "flex";
    serverConn.send(JSON.stringify({ "type": "Show Games" }))
}

function loginFailed() {
    if (!loginFailedOnce) {
        var errorMsg = document.createElement('div')
        errorMsg.style = "margin-left: auto;margin-right: auto;height: fit-content;width: fit-content;color: #a83236;font-weight: bolder;font-size: large;margin-bottom: 15px;"
        errorMsg.appendChild(document.createTextNode("Username or Password is Incorrect!"))
        loginPrompt.appendChild(errorMsg)
    }
}

function gameCreationPrompt(e) {
    menu.style.filter = "blur(5px)"
    createGamePrompt.style.display = "flex"

    window.setTimeout(function() {
        createGamePrompt.classList.add("prompt")
    }, 100);
}

function cancelGameCreation() {
    createGamePrompt.classList.remove("prompt")
    menu.style.filter = ""
    title.value = ""
    numPlayers.value = ""
}

function createGame(e) {
    if (title.value != "" && numPlayers.value != "") {
        var msg = {
            type: "Create Game",
            data: {
                "title": title.value,
                "numPlayers": numPlayers.value
            }
        }
        serverConn.send(JSON.stringify(msg))
    }
    cancelGameCreation()
}

function gameCreated(data) {
    gameListings.style.border = "solid black"
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
    gameListings.appendChild(gameListing)
}

function joinGameButton(data) {
    var game_id;

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

function showGames(data) {
    if (data.length != 0) {
        for (const index in data) {
            var game = data[index]
            gameListings.style.border = "solid black"
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
            gameListings.appendChild(gameListing)
        }
    }
}

function sortGames() {}

function closed() {
    menu.style.display = "none";
}

function msg_handler(data) {
    var msg = JSON.parse(data)
    switch (msg.type) {
        case "Login":
            if (msg.result == "Success") {
                loginSuccess()
            } else {
                loginFailed()
            }
            break;

        case "Show Games":
            showGames(msg.data)
            break;

        case "Create Game":
            gameCreated(msg.data)
            if (playerName == msg.data.creator) {
                joinGameButton(msg.data)
            }
            break;

        case "Join Game":
            joinGame(msg.data)
            break;

        case "Ready":
            ready(msg.data)
            break;

        case "Not Ready":
            notReady(msg.data)
            break;

        case "Choose Deck":
            lobby__readyBtn.style.display = "block"
            break;

        case "Start Game":
            startGame(msg.data)
            break;

        case "State Update":
            stateUpdate(msg.data)
            break;

        default:
            console.log(`Received malformed message: ${JSON.stringify(msg)}`)
    }
}