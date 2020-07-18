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
const gamePage = document.getElementById("game-page")

var currGameID;
var currPlayerID;
var currPrompt;
var blurred;

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

gameBoard.addEventListener('click', closePrompt)

function closePrompt(e) {
    if (currPrompt != undefined && currPrompt != null) {
        currPrompt.classList.remove("prompt")
        currPrompt = null
        blurred.style.filter = "none"
    }
}

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
        var change = data.cards[index]
        switch (data.cards[index].type) {
            case "New Object":
                if (document.querySelector("[data-instance-id=" + change.instanceID + "]") != null) {
                    var original = document.querySelector("[data-instance-id=" + change.instanceID + "]")
                    original.parentNode.removeChild(original)
                }

                if (change.type != "Remove") {
                    var instance = document.createElement('img')
                    instance.setAttribute("data-instance-id", change.instanceID)
                    instance.classList.add("card")
                    if (change.data.zone == "field" && change.data.types.includes("Type.LAND")) {
                        document.querySelector(".lands[data-owned-by=" + change.data.controller + "]").appendChild(instance)
                    } else {
                        document.querySelector("." + change.data.zone + "[data-owned-by=" + change.data.controller + "]").appendChild(instance)
                    }

                    findCardByID(change.data.oracle, (err, card) => {
                        instance.src = card.image_uris.normal
                    })

                    if (change.data.types.includes("Supertype.BASIC") && change.data.zone == "field") {
                        instance.setAttribute("data-mana-ability-id", change.data.abilities[0][0])
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

                        if (change.data.abilities.length != 0) {
                            for (const index in change.data.abilities) {
                                var ability = document.createElement('div')
                                ability.classList.add("ability")
                                ability.setAttribute("data-ability-id", change.data.abilities[index][0])
                                ability.appendChild(document.createTextNode(change.data.abilities[index][1]))
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
                            gamePage.appendChild(abilityPrompt)
                            instance.addEventListener('dblclick', (e) => {
                                gameBoard.style.filter = "blur(5px)"
                                abilityPrompt.style.display = "flex"
                                currPrompt = abilityPrompt
                                blurred = gameBoard
                                window.setTimeout(function() {
                                    abilityPrompt.classList.add("prompt")
                                }, 100);
                            })
                        }
                    }
                    if (change.data.zone == "hand") {
                        instance.draggable = "true"
                        instance.addEventListener('dragstart', (e) => {
                            e.dataTransfer.setData("Text", e.srcElement.getAttribute('data-instance-id'))
                        })
                    } else {
                        instance.draggable = "false"
                    }
                }
                break;
            case "Tap":
                var card = document.querySelector("[data-instance-id=" + change.instanceID + "]")
                if (card != null) {
                    card.classList.add("tapped")
                }
                break;
        }
    }


    for (const index in data.players) {
        var change = data.players[index]
        switch (change.type) {
            case "Zone Count Update":
                var zone;
                switch (change.data.type) {
                    case "Hand":
                        zone = 1
                        break;
                    case "Deck":
                        zone = 5
                        break;
                }
                var count = document.querySelectorAll('[data-owned-by=' + change.playerID + '] > .player-profile__counts > .player-profile__count > .player-profile__count--num')[zone]
                count.removeChild(count.lastChild)
                count.appendChild(document.createTextNode(change.data.num))
                break;
            case "Mana Update":
                var count = document.querySelectorAll('[data-owned-by=' + change.playerID + '] > .player-profile__counts > .player-profile__count > .player-profile__count--num')[0]
                count.removeChild(count.lastChild)
                count.appendChild(document.createTextNode(change.data.num))
                break;
        }
    }
}