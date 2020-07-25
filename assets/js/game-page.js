import { goToPage } from './nav.js'
import { findCardByID } from './database.js'
import { client, currGameID, currPlayerID } from './server-page.js'


const { dialog } = require('electron').remote
const path = require('path')
const fs = require('fs')

var currPrompt
var blurred
var ans

function initilizeEventHandlers() {
    /**
     * Handles Ready messages from the server
     * @param {Object} data 
     */
    client.on("Ready", (data) => {
        if (data.playerID == currPlayerID) {
            document.getElementById('lobby__ready-btn').style.display = "none"
            document.getElementById('lobby__not-ready-btn').style.display = "block"
        }

        var entry = document.querySelector("[data-player-id=" + data.playerID + "]")
        entry.removeChild(entry.lastChild)

        var lobby__playerList__status = document.createElement("div")
        lobby__playerList__status.className = "lobby__player-list--status--ready"
        lobby__playerList__status.appendChild(document.createTextNode('Ready'))
        entry.appendChild(lobby__playerList__status)
    })


    /**
     * Handles "Not Ready" messages from the server
     * @param {Object} data 
     */
    client.on("Not Ready", (data) => {
        document.getElementById('lobby__ready-btn').style.display = "block"
        document.getElementById('lobby__not-ready-btn').style.display = "none"

        var entry = document.querySelectorAll("[data-player-id=\"" + data.playerID + "\"]")[0]
        entry.removeChild(entry.lastChild)

        var lobby__playerList__status = document.createElement("div")
        lobby__playerList__status.className = "lobby__player-list--status--not-ready"
        lobby__playerList__status.appendChild(document.createTextNode('Not Ready'))
        entry.appendChild(lobby__playerList__status)
    })



    client.on("Start Game", (data) => { setUpGameBoard(data) })

    /**
     * Handles Zone count updates
     * @param {Object} data 
     */
    client.on("Zone Count Update", (data) => {
        var zoneIndex = { "Hand": 1, "Deck": 5 }
        var count = document.querySelectorAll('[data-owned-by=' + data.playerID + '] > .player-profile__counts > .player-profile__count > .player-profile__count--num')[zoneIndex[data.type]]
        count.removeChild(count.lastChild)
        count.appendChild(document.createTextNode(data.num))
    })

    client.on("New Object", (data) => { newObject(data) })

    client.on("Binary Question", (data) => { answerBinaryQuestion(data) })

    client.on("Start Phase", (data) => { startPhase(data) })
}

/**
 * Closes the currently viewed prompt
 * @param {MouseEvent} event
 */
function closePrompt(event) {
    if (currPrompt != undefined && currPrompt != null) {
        currPrompt.classList.remove("prompt")
        currPrompt = null
        blurred.style.filter = "none"
    }
}

/**
 * Handles "Start Game" messages. Sets up the gameboard
 * @param {Object} data 
 */
function setUpGameBoard(data) {
    const gameBoard = document.getElementById('game-board')

    var started = false
    var finished = false
    var height

    if (data.numPlayers == 1) {
        height = "height-100"
    }
    if (data.numPlayers == 2) {
        height = "height-50"
    }
    if (data.numPlayers == 3) {
        height = "height-33"
    }
    if (data.numPlayers == 4) {
        height = "height-25"
    }


    for (const index in data.players) {
        if (data.players[index][0] == currPlayerID) {
            started = true

            var side = document.getElementById("board-side-friendly-template").cloneNode(true)
            side.style.display = "flex"
            side.classList.add(height)
            side.querySelector(".friendly-side").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".player-profile").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".field").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".hand").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".lands").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".player-profile__name").appendChild(document.createTextNode(data.players[index][1]))

            side.querySelector(".lands").addEventListener('dragenter', (e) => { e.preventDefault() })
            side.querySelector(".lands").addEventListener('dragover', (e) => { e.preventDefault() })
            side.querySelector(".lands").addEventListener("drop", (e) => {
                e.preventDefault()
                var msg = {
                    "type": "Play Land",
                    "data": {
                        "playerID": currPlayerID,
                        "gameID": currGameID,
                        "instanceID": e.dataTransfer.getData("Text")
                    }
                }
                serverConn.send(JSON.stringify(msg))
            })

            gameBoard.appendChild(side)
        }

        if (started && data.players[index][0] != currPlayerID) {
            var side = document.getElementById("board-side-hostile-template").cloneNode(true)
            side.style.display = "flex"
            side.classList.add(height)
            side.querySelector(".hostile-side").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".player-profile").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".field").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".lands").setAttribute('data-owned-by', data.players[index][0])

            side.querySelector(".player-profile__name").appendChild(document.createTextNode(data.players[index][1]))

            gameBoard.appendChild(side)
        }
    }

    for (const index in data.players) {
        if (!finished) {
            if (data.players[index][0] == currPlayerID) {
                finished = true
            } else {

                var side = document.getElementById("board-side-hostile-template").cloneNode(true)
                side.style.display = "flex"
                side.classList.add(height)
                side.querySelector(".hostile-side").setAttribute('data-owned-by', data.players[index][0])
                side.querySelector(".player-profile").setAttribute('data-owned-by', data.players[index][0])
                side.querySelector(".field").setAttribute('data-owned-by', data.players[index][0])
                side.querySelector(".lands").setAttribute('data-owned-by', data.players[index][0])

                side.querySelector(".player-profile__name").appendChild(document.createTextNode(data.players[index][1]))

                gameBoard.appendChild(side)
            }
        }
    }

    document.getElementById("lobby").style.display = "none"
    gameBoard.style.display = "flex"
    document.getElementById("stack").style.display = "flex"
}


/**
 * Opens a dialog to choose your starting deck. Sends a "Choose Deck" message to the server.
 */
function chooseDeck() {
    var filePath = dialog.showOpenDialogSync({
        title: "Load Deck",
        defaultPath: path.join(__dirname, "decks"),
        buttonLabel: "Load Deck",
        filters: [{ name: 'CARDNAME Deck', extensions: ['dck'] }, { name: 'All Files', extensions: ['*'] }]
    })[0]

    var data = JSON.parse(fs.readFileSync(path.resolve(filePath)))

    for (const id in data) {
        findCardByID(id, (err, card) => {
            var entry = document.createElement("div")
            entry.className = "lobby__deck-list--entry"
            entry.id = id
            entry.setAttribute('data-img-source', card.image_uris.normal)
            entry.appendChild(document.createTextNode(card.name))
            entry.appendChild(document.createElement('div'))
            entry.appendChild(document.createTextNode('x' + data[id]))
            entry.addEventListener('click', (e) => {
                document.getElementById("lobby__enhanced-card-img").innerHTML = ""
                var img = document.createElement('img')
                img.src = e.srcElement.getAttribute('data-img-source')
                img.className = 'enhanced-image'
                document.getElementById("lobby__enhanced-card-img").appendChild(img)
            })
            document.getElementById("lobby__deck-list").appendChild(entry)
        })
    }

    client.emit("Choose Deck", data)
    document.getElementById('lobby__ready-btn').style.display = "block"
}

/**
 * Handles Mana Pool updates
 * @param {Object} data 
 */
function manaCount(data) {
    var count = document.querySelectorAll('[data-owned-by=' + data.playerID + '] > .player-profile__counts > .player-profile__count > .player-profile__count--num')[0]
    count.removeChild(count.lastChild)
    count.appendChild(document.createTextNode(data.data.num))
}

/**
 * Handles "New Object" messages. If the instance id is already in use, this will replace that element
 * @param {Object} data 
 */
function newObject(data) {
    if (document.querySelector("[data-instance-id=" + data.instanceID + "]") != null) {
        var original = document.querySelector("[data-instance-id=" + data.instanceID + "]")
        original.parentNode.removeChild(original)
    }


    var instance = document.createElement('img')
    instance.setAttribute("data-instance-id", data.instanceID)
    instance.classList.add("card")
    if (data.zone == "field" && data.types.includes("Type.LAND")) {
        document.querySelector(".lands[data-owned-by=" + data.controller + "]").appendChild(instance)
    } else {
        document.querySelector("." + data.zone + "[data-owned-by=" + data.controller + "]").appendChild(instance)
    }

    findCardByID(data.oracle, (err, card) => {
        instance.src = card.image_uris.normal
    })

    if (data.types.includes("Supertype.BASIC") && data.zone == "field") {
        instance.setAttribute("data-mana-ability-id", data.abilities[0][0])
        instance.addEventListener("dblclick", (e) => {
            var msg = {
                "type": "Activate Ability",
                "data": {
                    "gameID": currGameID,
                    "playerID": currPlayerID,
                    "abilityID": e.srcElement.getAttribute("data-mana-ability-id"),
                }
            }
            serverConn.send(JSON.stringify(msg))
        })
    } else {
        var abilityPrompt = document.createElement('div')
        abilityPrompt.classList.add("promptable")

        var hdr = document.createElement('div')
        hdr.classList.add("prompt-hdr")
        hdr.appendChild(document.createTextNode("Abilites"))
        abilityPrompt.append(hdr)

        if (data.abilities.length != 0) {
            for (const index in data.abilities) {
                var ability = document.createElement('div')
                ability.classList.add("ability")
                ability.setAttribute("data-ability-id", data.abilities[index][0])
                ability.appendChild(document.createTextNode(data.abilities[index][1]))
                abilityPrompt.appendChild(ability)
                ability.addEventListener('dblclick', (e) => {
                    var msg = {
                        "type": "Activate Ability",
                        "data": {
                            "gameID": currGameID,
                            "playerID": currPlayerID,
                            "abilityID": e.srcElement.getAttribute("data-ability-id")
                        }
                    }
                    serverConn.send(JSON.stringify(msg))
                    closePrompt(null)
                })
            }
            document.getElementById("game-page").appendChild(abilityPrompt)
            instance.addEventListener('dblclick', (e) => {
                gameBoard.style.filter = "blur(5px)"
                abilityPrompt.style.display = "flex"
                currPrompt = abilityPrompt
                blurred = gameBoard
                window.setTimeout(function() {
                    abilityPrompt.classList.add("prompt")
                }, 100)
            })
        }
    }
    if (data.zone == "hand") {
        instance.draggable = "true"
        instance.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData("Text", e.srcElement.getAttribute('data-instance-id'))
        })
    } else {
        instance.draggable = "false"
    }

}

/**
 * Handles "Tap" messages. Taps the specified card
 * @param {Object} data 
 */
function tap(data) {
    var card = document.querySelector("[data-instance-id=" + data.instanceID + "]")
    if (card != null) {
        card.classList.add("tapped")
    }
}

function startPhase(data) {
    document.querySelectorAll(".friendly-side", ".hostile-side").forEach((side) => {
        if (data.playerID == side.getAttribute("[data-owned-by=" + data.activePlayer + "]")) {
            side.style.boxShadow = "inset 0 0 0 1px white"
        } else {
            side.style.boxShadow = ""
        }
    })
}

function answerBinaryQuestion(data) {
    var question = document.getElementById("question")
    var answer = document.getElementById("binary-answer")
    if (question.lastChild != null) {
        question.removeChild(question.lastChild)
    }
    question.appendChild(document.createTextNode(data.question))
    question.style.display = "flex"
    answer.style.display = "flex"
    document.getElementById("yes").addEventListener('click', answerYes)
    document.getElementById("no").addEventListener('click', answerNo)
}

function answerYes() {
    document.getElementById("question").style.display = "none"
    document.getElementById("binary-answer").style.display = "none"
    client.emit("Answer Question", { "answer": true })
}

function answerNo() {
    document.getElementById("question").style.display = "none"
    document.getElementById("binary-answer").style.display = "none"
    client.emit("Answer Question", { "answer": false })
}

document.getElementById("lobby__choose-deck-btn").addEventListener('click', chooseDeck)
document.getElementById('game-board').addEventListener('click', closePrompt)

/**
 * When clicked on, sends a "Ready" msg to the server 
 */
document.getElementById('lobby__ready-btn').addEventListener('click', () => { client.emit("Ready") })

/**
 * When clicked on, sends a "Not Ready" msg to the server 
 */
document.getElementById('lobby__not-ready-btn').addEventListener('click', () => { client.emit("Not Ready") })


export { initilizeEventHandlers }