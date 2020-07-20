import { goToPage } from './nav.js'
import { findCardByID } from './database.js'
import { serverConn } from './server-page.js'

const { dialog } = require('electron').remote
const path = require('path')
const fs = require('fs')

const lobby__readyBtn = document.getElementById('lobby__ready-btn')

var currGameID
var currPlayerID
var currPrompt
var blurred

document.getElementById("lobby__choose-deck-btn").addEventListener('click', chooseDeck)
lobby__readyBtn.addEventListener('click', (event) => {
    var msg = {
        "type": "Ready",
        "data": {
            "gameID": currGameID,
            "playerID": currPlayerID
        }
    }
    serverConn.send(JSON.stringify(msg))
})
document.getElementById('lobby__not-ready-btn').addEventListener('click', () => {
    var msg = {
        "type": "Not Ready",
        "data": {
            "gameID": currGameID,
            "playerID": currPlayerID
        }
    }
    serverConn.send(JSON.stringify(msg))
})

document.getElementById('game-board').addEventListener('click', closePrompt)

function closePrompt(e) {
    if (currPrompt != undefined && currPrompt != null) {
        currPrompt.classList.remove("prompt")
        currPrompt = null
        blurred.style.filter = "none"
    }
}

function joinGame(data) {
    document.getElementById("lobby__player-list").innerHTML = ""
    document.getElementById("failed-game-MSG").style.display = "none"
    document.getElementById("lobby").style.display = "flex"

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

        document.getElementById("lobby__player-list").appendChild(entry)
    }
    goToPage("game-page")
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
                document.getElementById("lobby__enhanced-card-img").innerHTML = ""
                var img = document.createElement('img')
                img.src = e.srcElement.getAttribute('data-img-source')
                img.className = 'enhanced-image'
                document.getElementById("lobby__enhanced-card-img").appendChild(img)
            })
            document.getElementById("lobby__deck-list").appendChild(entry)
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
        document.getElementById('lobby__not-ready-btn').style.display = "block"
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
    document.getElementById('lobby__not-ready-btn').style.display = "none"

    var entry = document.querySelectorAll("[data-player-id=\"" + data.playerID + "\"]")[0]
    entry.removeChild(entry.lastChild)

    var lobby__playerList__status = document.createElement("div")
    lobby__playerList__status.className = "lobby__player-list--status--not-ready"
    lobby__playerList__status.appendChild(document.createTextNode('Not Ready'))
    entry.appendChild(lobby__playerList__status)
}

function startGame(data) {
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
            var question = document.createElement("p")
            question.classList.add("question")
            side.querySelector(".player-profile").appendChild(question)
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

function stateUpdate(data) {
    const gameBoard = document.getElementById('game-board')
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
                    if (change.data.zone == "hand") {
                        instance.draggable = "true"
                        instance.addEventListener('dragstart', (e) => {
                            e.dataTransfer.setData("Text", e.srcElement.getAttribute('data-instance-id'))
                        })
                    } else {
                        instance.draggable = "false"
                    }
                }
                break
            case "Tap":
                var card = document.querySelector("[data-instance-id=" + change.instanceID + "]")
                if (card != null) {
                    card.classList.add("tapped")
                }
                break
        }
    }


    for (const index in data.players) {
        var change = data.players[index]
        switch (change.type) {
            case "Zone Count Update":
                var zoneIndex = { "Hand": 1, "Deck": 5 }
                var count = document.querySelectorAll('[data-owned-by=' + change.playerID + '] > .player-profile__counts > .player-profile__count > .player-profile__count--num')[zoneIndex[change.data.type]]
                count.removeChild(count.lastChild)
                count.appendChild(document.createTextNode(change.data.num))
                break
            case "Mana Update":
                var count = document.querySelectorAll('[data-owned-by=' + change.playerID + '] > .player-profile__counts > .player-profile__count > .player-profile__count--num')[0]
                count.removeChild(count.lastChild)
                count.appendChild(document.createTextNode(change.data.num))
                break
        }
    }
}

function startTurn(data) {
    document.querySelectorAll(".friendly-side", ".hostile-side").forEach((side) => {
        if (data.playerID == side.getAttribute("data-owned-by")) {
            side.style.boxShadow = "inset 0 0 0 1px white"
        } else {
            side.style.boxShadow = ""
        }
    })
}

function choose(data) {
    switch (data.type) {
        case "InquiryType.BOOLEAN":
            profile = document.querySelector("#board-side-friendly-template .player-profile")
            var inquiry = document.createElement("p")
            inquiry.classList.add("question")
            inquiry.appendChild(document.createTextNode(data.inquiry[0]))
            var answer = document.createElement("div")
            answer.classList.add("answer")

            var yes = document.createElement("button")
            var no = document.createElement("button")
            yes.appendChild(document.createTextNode("Yes"))
            no.appendChild(document.createTextNode("No"))

            profile.appendChild(inquiry)
            profile.appendChild(answer)
            answer.appendChild(yes)
            answer.appendChild(no)

            yes.addEventListener('click', (e) => {
                profile = document.querySelector("#board-side-friendly-template .player-profile")
                profile.removeChild(profile.lastChild)
                profile.removeChild(profile.lastChild)
                var msg = {
                    "type": "Choose",
                    "answer": true
                }
                serverConn.send(JSON.stringify(msg))
            })
            no.addEventListener('click', (e) => {
                profile = document.querySelector("#board-side-friendly-template .player-profile")
                profile.removeChild(profile.lastChild)
                profile.removeChild(profile.lastChild)
                var msg = {
                    "type": "Choose",
                    "answer": false
                }
                serverConn.send(JSON.stringify(msg))
            })
            break

        default:
            break
    }
}


document.getElementById("lobby__choose-deck-btn").addEventListener('click', chooseDeck)
document.getElementById('game-board').addEventListener('click', closePrompt)

lobby__readyBtn.addEventListener('click', (event) => {
    var msg = {
        "type": "Ready",
        "data": {
            "gameID": currGameID,
            "playerID": currPlayerID
        }
    }
    serverConn.send(JSON.stringify(msg))
})

document.getElementById('lobby__not-ready-btn').addEventListener('click', () => {
    var msg = {
        "type": "Not Ready",
        "data": {
            "gameID": currGameID,
            "playerID": currPlayerID
        }
    }
    serverConn.send(JSON.stringify(msg))
})

export { joinGame, ready, notReady, startGame, stateUpdate, lobby__readyBtn }