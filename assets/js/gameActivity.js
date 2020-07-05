import { changeToGameActivity } from './tabs.js'
import { findCardByID } from './database.js'
import { serverConn } from './serverActivity.js'
export { joinGame, ready, notReady, startGame }

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

    lobby__readyBtn.style.display = "block"

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
    var finished = false
    var height;

    console.log(data)

    switch (data.numPlayers) {
        case 1:
            height = " height-100"
            break
        case 2:
            height = " height-50"
            break
        case 3:
            height = " height-30"
            break
        case 4:
            height = " height-25"
    }

    for (const index in data.players) {
        if (data.players[index] == currPlayerID) {
            console.log("called for me");
            started = true

            var side = document.createElement('div')
            side.className = "board-side" + height

            var profile = document.createElement('div')
            profile.className = "player-profile"

            var subSide = document.createElement('div')
            subSide.className = "friendly-side"

            var field = document.createElement('div')
            field.className = "field"

            var lands = document.createElement('div')
            lands.className = "lands"

            var hand = document.createElement('div')
            hand.className = "hand"

            subSide.appendChild(field)
            subSide.appendChild(lands)
            subSide.appendChild(hand)

            side.appendChild(profile)
            side.appendChild(subSide)

            gameBoard.appendChild(side)

        }

        if (started && data.players[index] != currPlayerID) {
            console.log("called for hostile");
            var side = document.createElement('div')
            side.className = "board-side" + height

            var profile = document.createElement('div')
            profile.className = "player-profile"

            var subSide = document.createElement('div')
            subSide.className = "hostile-side"

            var field = document.createElement('div')
            field.className = "field"
            field.style.height = "49%";

            var lands = document.createElement('div')
            lands.className = "lands"
            lands.style.height = "49%";

            subSide.appendChild(field)
            subSide.appendChild(lands)

            side.appendChild(profile)
            side.appendChild(subSide)

            gameBoard.appendChild(side)
        }
    }

    for (const index in data.players) {
        if (!finished) {
            if (data.players[index] == currPlayerID) {
                finished = true
            } else {

                var side = document.createElement('div')
                side.className = "board-side" + height

                var profile = document.createElement('div')
                profile.className = "player-profile"

                var subSide = document.createElement('div')
                subSide.className = "hostile-side"

                var field = document.createElement('div')
                field.className = "field"
                field.style.height = "49%";

                var lands = document.createElement('div')
                lands.className = "lands"
                lands.style.height = "49%";

                subSide.appendChild(field)
                subSide.appendChild(lands)

                side.appendChild(profile)
                side.appendChild(subSide)

                gameBoard.appendChild(side)
            }
        }
    }



    lobby.style.display = "none";
    gameBoard.style.display = "flex";
}