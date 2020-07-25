const io = require('socket.io-client')
import { initilizeEventHandlers } from './game-page.js'
import { settings, writeToConfig } from './config.js'
import { goToPage } from './nav.js'

if (settings.rememberMe == true) {
    document.forms["username"]["username-entry"].value = settings.username
    document.forms["password"]["password-entry"].value = settings.pass
    document.forms["server"]["server-entry"].value = settings.serverAddr
    document.getElementById('remember-me').checked = true
}

var client
var currGameID
var currPlayerID

/**
 * Connects to specified server and sends a login request. 
 * Server will respond with a "Login Successful" message if successful,
 * otherwise it will send a "Login Failed" message.
 */
function establishConnection() {

    var user = document.forms["username"]["username-entry"].value
    var pass = document.forms["password"]["password-entry"].value
    var address = document.forms["server"]["server-entry"].value
    client = io.connect("http://" + address + ":2129")

    client.on("connect", (data) => {
        console.log("Connected")
        client.emit("Login", { "user": user, "pass": pass })
    })

    client.on("Hi", () => {
        console.log("Hi");
    })

    initilizeEventHandlers()

    /**
     * Handles "Login Failed" messages.
     * Adds error message to bottom of login prompt.
     */
    client.on("Login Failed", (data) => {
        // Check if the last element is a text node
        if (document.getElementById('login-prompt').lastChild.nodeType == 3) {
            var errorMsg = document.createElement('div')
            errorMsg.style = "margin-left: auto;margin-right: auto;height: fit-content;width: fit-content;color: #a83236;font-weight: bolder;font-size: large;margin-bottom: 15px"
            errorMsg.appendChild(document.createTextNode("Username or Password is Incorrect!"))
            document.getElementById('login-prompt').appendChild(errorMsg)
        }
    })

    /**
     * Handles "Login Success" messages.
     * Closes login prompt and sends a "Show Games" message to the server.
     * Server will respond with an array of currently listed games.
     */
    client.on("Login Success", (data) => {
        document.getElementById('login-prompt').classList.remove("prompt")
        document.getElementById("serverMenu").style.display = "flex"
        client.emit("Show Games")
    })

    client.on('disconnect', (data) => {
        console.log("Disconnected")
        client.close()
    })

    /**
     * Handles "Show Games" messages.
     * Populates client with all current games on server 
     */
    client.on("Show Games", (data) => {
        var data = data.games
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
    })

    /**
     * Handles "Create Game" messages.
     * Updates current game listings on client
     * @param {Object} data 
     */
    client.on("Game Created", (data) => {
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
        client.emit("Join Game", { "gameID": data.gameID })
    })

    /**
     * Handles "Join Game" messages. Opens the lobby and lists the current players in the game
     * @param {Object} data 
     */
    client.on("Joined Game", (data) => {
        currPlayerID = data.playerID
        document.getElementById("lobby__player-list").innerHTML = ""
        document.getElementById("failed-game-MSG").style.display = "none"
        document.getElementById("lobby").style.display = "flex"

        for (const index in data.players) {
            var entry = document.createElement('div')
            entry.className = "lobby__player-list--entry"


            var lobby__playerList__name = document.createElement("div")
            lobby__playerList__name.className = "lobby__player-list--name"
            lobby__playerList__name.appendChild(document.createTextNode(data.players[index][0]))
            entry.appendChild(lobby__playerList__name)

            var lobby__playerList__status = document.createElement("div")
            lobby__playerList__status.className = "lobby__player-list--status--not-ready"
            lobby__playerList__status.appendChild(document.createTextNode('Not Ready'))
            entry.appendChild(lobby__playerList__status)

            entry.setAttribute('data-player-id', data.players[index][1])

            document.getElementById("lobby__player-list").appendChild(entry)
        }
        goToPage("game-page")
    })
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
            "title": document.forms["createGame"]["title"].value,
            "numPlayers": document.forms["numPlayersChosen"]["num"].value
        }

        client.emit("Create Game", msg)
    }
    cancelGameCreation()
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
        "gameID": game_id
    }
    client.emit("Join Game", msg)
}

document.getElementById("createGamePromptButton").addEventListener('click', gameCreationPrompt)
document.getElementById("cancelCreationButton").addEventListener('click', cancelGameCreation)
document.getElementById("createGameButton").addEventListener('click', createGame)
document.getElementById('login-btn').addEventListener('click', establishConnection)

// Enables remembering credentials on the login prompt
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

export { cancelGameCreation, client, currGameID, currPlayerID }