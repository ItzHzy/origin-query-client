import { changeToGameActivity } from './tabs.js'
import { findCardByID } from './database.js'
import { serverConn } from './server-page.js'
export { joinGame, ready, notReady, startGame, stateUpdate, lobby__readyBtn }

const { dialog } = require('electron').remote
const path = require('path')
const fs = require('fs')

const lobby = document.getElementById("lobby")
const lobby__chooseDeckBtn = document.getElementById("lobby__choose-deck-btn")
const lobby__readyBtn = document.getElementById('lobby__ready-btn')
const lobby__notReadyBtn = document.getElementById('lobby__not-ready-btn')
const lobby__playerList = document.getElementById("lobby__player-list")
const lobby__decklist = document.getElementById("lobby__deck-list")
const lobby__enhancedCardImg = document.getElementById("lobby__enhanced-card-img")
const failedGameMSG = document.getElementById("failed-game-MSG")

const gameBoard = document.getElementById('game-board')

var currGameID;
var currPlayerID;

lobby__chooseDeckBtn.addEventListener('click', chooseDeck)
lobby__readyBtn.addEventListener('click', () => {
    var msg = {
        "type": "Ready",
        "data": {
            "gameID": currGameID,
            "playerID": currPlayerID
        }
    }
    serverConn.send(JSON.stringify(msg))
})
lobby__notReadyBtn.addEventListener('click', () => {
    var msg = {
        "type": "Not Ready",
        "data": {
            "gameID": currGameID,
            "playerID": currPlayerID
        }
    }
    serverConn.send(JSON.stringify(msg))
})

function joinGame(data) {
    lobby__playerList.innerHTML = ""
    failedGameMSG.style.display = "none"
    lobby.style.display = "flex"

    currGameID = data.gameID
    if (currPlayerID == undefined) {
        currPlayerID = data.playerID
    }

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

        lobby__playerList.appendChild(entry)
    }
    changeToGameActivity()
}

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
                lobby__enhancedCardImg.innerHTML = ""
                var img = document.createElement('img')
                img.src = e.srcElement.getAttribute('data-img-source')
                img.className = 'enhanced-image'
                lobby__enhancedCardImg.appendChild(img)
            })
            lobby__decklist.appendChild(entry)
        })
    }

    var msg = {
        "type": "Choose Deck",
        "data": {
            "gameID": currGameID,
            "playerID": currPlayerID,
            "deck": data
        }
    }

    serverConn.send(JSON.stringify(msg))
}

function ready(data) {
    if (data.playerID == currPlayerID) {
        lobby__readyBtn.style.display = "none"
        lobby__notReadyBtn.style.display = "block"
    }

    var entry = document.querySelectorAll("[data-player-id=" + data.playerID + "]")[0]
    entry.removeChild(entry.lastChild)

    var lobby__playerList__status = document.createElement("div")
    lobby__playerList__status.className = "lobby__player-list--status--ready"
    lobby__playerList__status.appendChild(document.createTextNode('Ready'))
    entry.appendChild(lobby__playerList__status)
}

function notReady(data) {
    lobby__readyBtn.style.display = "block"
    lobby__notReadyBtn.style.display = "none"

    var entry = document.querySelectorAll("[data-player-id=\"" + data.playerID + "\"]")[0]
    entry.removeChild(entry.lastChild)

    var lobby__playerList__status = document.createElement("div")
    lobby__playerList__status.className = "lobby__player-list--status--not-ready"
    lobby__playerList__status.appendChild(document.createTextNode('Not Ready'))
    entry.appendChild(lobby__playerList__status)
}

function startGame(data) {
    var started = false;
    var finished = false;
    var height;

    switch (data.numPlayers) {
        case 1:
            height = "height-100"
            break
        case 2:
            height = "height-50"
            break
        case 3:
            height = "height-33"
            break
        case 4:
            height = "height-25"
    }

    for (const index in data.players) {
        if (data.players[index][0] == currPlayerID) {
            started = true

            var side = document.getElementById("board-side-friendly-template").cloneNode(true)
            side.style.display = "flex"
            side.classList.add(height)
            side.querySelector(".player-profile").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".field").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".hand").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".lands").setAttribute('data-owned-by', data.players[index][0])

            side.querySelector(".player-profile__name").appendChild(document.createTextNode(data.players[index][1]))
            side.querySelectorAll(".player-profile__count--num")[0].appendChild(document.createTextNode("0"))
            side.querySelectorAll(".player-profile__count--num")[1].appendChild(document.createTextNode("0"))
            side.querySelectorAll(".player-profile__count--num")[2].appendChild(document.createTextNode("0"))
            side.querySelectorAll(".player-profile__count--num")[3].appendChild(document.createTextNode("0"))
            side.querySelectorAll(".player-profile__count--num")[4].appendChild(document.createTextNode("0"))
            side.querySelectorAll(".player-profile__count--num")[5].appendChild(document.createTextNode("0"))

            if (data.players[index][4] == null) {
                // pic.src = "assets/icons/default-pfp.svg"
            } else {
                // pic.src = "assets/icons/default-pfp.svg"
            }

            gameBoard.appendChild(side)
        }

        if (started && data.players[index][0] != currPlayerID) {
            var side = document.getElementById("board-side-hostile-template").cloneNode(true)
            side.style.display = "flex"
            side.classList.add(height)
            side.querySelector(".player-profile").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".field").setAttribute('data-owned-by', data.players[index][0])
            side.querySelector(".lands").setAttribute('data-owned-by', data.players[index][0])

            side.querySelector(".player-profile__name").appendChild(document.createTextNode(data.players[index][1]))
            side.querySelectorAll(".player-profile__count--num")[0].appendChild(document.createTextNode("0"))
            side.querySelectorAll(".player-profile__count--num")[1].appendChild(document.createTextNode("0"))
            side.querySelectorAll(".player-profile__count--num")[2].appendChild(document.createTextNode("0"))
            side.querySelectorAll(".player-profile__count--num")[3].appendChild(document.createTextNode("0"))
            side.querySelectorAll(".player-profile__count--num")[4].appendChild(document.createTextNode("0"))
            side.querySelectorAll(".player-profile__count--num")[5].appendChild(document.createTextNode("0"))

            if (data.players[index][4] == null) {
                // pic.src = "assets/icons/default-pfp.svg"
            } else {
                // pic.src = "assets/icons/default-pfp.svg"
            }

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
                side.querySelector(".player-profile").setAttribute('data-owned-by', data.players[index][0])
                side.querySelector(".field").setAttribute('data-owned-by', data.players[index][0])
                side.querySelector(".lands").setAttribute('data-owned-by', data.players[index][0])

                side.querySelector(".player-profile__name").appendChild(document.createTextNode(data.players[index][1]))
                side.querySelectorAll(".player-profile__count--num")[0].appendChild(document.createTextNode("0"))
                side.querySelectorAll(".player-profile__count--num")[1].appendChild(document.createTextNode("0"))
                side.querySelectorAll(".player-profile__count--num")[2].appendChild(document.createTextNode("0"))
                side.querySelectorAll(".player-profile__count--num")[3].appendChild(document.createTextNode("0"))
                side.querySelectorAll(".player-profile__count--num")[4].appendChild(document.createTextNode("0"))
                side.querySelectorAll(".player-profile__count--num")[5].appendChild(document.createTextNode("0"))

                if (data.players[index][4] == null) {
                    // pic.src = "assets/icons/default-pfp.svg"
                } else {
                    // pic.src = "assets/icons/default-pfp.svg"
                }

                gameBoard.appendChild(side)
            }
        }
    }

    lobby.style.display = "none";
    gameBoard.style.display = "flex";
}

function stateUpdate(data) {
    // Card Updates
    for (const index in data.cards) {
        var card = data.cards[index]
        if (document.getElementById(card.instanceID) == null) {
            if (card.type != "Remove") {
                var instance = document.createElement('img')
                instance.id = card.instanceID
                instance.classList.add("card")
                findCardByID(card.data.oracle, (err, card) => {
                    instance.src = card.image_uris.normal
                })
                document.querySelector("." + card.data.zone, "[data-owned-by=" + card.data.controller + "]").appendChild(instance)

            }
        } else {
            var instance = document.getElementById(card.instanceID)
        }
    }
}