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
    var finished = false;
    var height;

    switch (data.numPlayers) {
        case 1:
            height = " height-100"
            break
        case 2:
            height = " height-50"
            break
        case 3:
            height = " height-33"
            break
        case 4:
            height = " height-25"
    }

    for (const index in data.players) {
        if (data.players[index][0] == currPlayerID) {
            started = true

            var side = document.createElement('div')
            side.className = "board-side" + height

            var profile = document.createElement('div')
            profile.className = "player-profile"
            profile.setAttribute('data-owned-by', data.players[index][0])

            var pfp = document.createElement('div')
            pfp.className = "player-profile__pfp"
            var pic = document.createElement('img')
            pfp.appendChild(pic)
            profile.appendChild(pfp)
            if (data.players[index][4] == null) {
                pic.src = "assets/icons/default-pfp.svg"
            } else {
                pic.src = "assets/icons/default-pfp.svg"
            }

            var name = document.createElement('div')
            name.className = "player-profile__name"
            name.appendChild(document.createTextNode(data.players[index][1]))
            profile.appendChild(name)

            var counts = document.createElement('div')
            counts.className = "player-profile__counts"
            profile.appendChild(counts)

            var pool = document.createElement('div')
            pool.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/mana-pool.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            pool.appendChild(icon)
            pool.appendChild(num)
            counts.appendChild(pool)

            var handCount = document.createElement('div')
            handCount.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/hand.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            handCount.appendChild(icon)
            handCount.appendChild(num)
            counts.appendChild(handCount)

            var life = document.createElement('div')
            life.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/heart.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            life.appendChild(icon)
            life.appendChild(num)
            counts.appendChild(life)

            var counts = document.createElement('div')
            counts.className = "player-profile__counts"
            profile.appendChild(counts)


            var exile = document.createElement('div')
            exile.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/exile.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            exile.appendChild(icon)
            exile.appendChild(num)
            counts.appendChild(exile)

            var grave = document.createElement('div')
            grave.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/grave.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            grave.appendChild(icon)
            grave.appendChild(num)
            counts.appendChild(grave)

            var deck = document.createElement('div')
            deck.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/deck.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            deck.appendChild(icon)
            deck.appendChild(num)
            counts.appendChild(deck)


            var subSide = document.createElement('div')
            subSide.className = "friendly-side"

            var field = document.createElement('div')
            field.className = "field"
            field.setAttribute('data-owned-by', data.players[index][0])

            var lands = document.createElement('div')
            lands.className = "lands"
            lands.setAttribute('data-owned-by', data.players[index][0])

            var hand = document.createElement('div')
            hand.className = "hand"


            subSide.appendChild(field)
            subSide.appendChild(lands)
            subSide.appendChild(hand)

            side.appendChild(profile)
            side.appendChild(subSide)

            gameBoard.appendChild(side)

        }

        if (started && data.players[index][0] != currPlayerID) {
            var side = document.createElement('div')
            side.className = "board-side" + height

            var profile = document.createElement('div')
            profile.className = "player-profile"
            profile.setAttribute('data-owned-by', data.players[index][0])

            var pfp = document.createElement('div')
            pfp.className = "player-profile__pfp"
            var pic = document.createElement('img')
            pfp.appendChild(pic)
            profile.appendChild(pfp)
            if (data.players[index][4] == null) {
                pic.src = "assets/icons/default-pfp.svg"
            } else {
                pic.src = "assets/icons/default-pfp.svg"
            }

            var name = document.createElement('div')
            name.className = "player-profile__name"
            name.appendChild(document.createTextNode(data.players[index][1]))
            profile.appendChild(name)

            var counts = document.createElement('div')
            counts.className = "player-profile__counts"
            profile.appendChild(counts)

            var pool = document.createElement('div')
            pool.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/mana-pool.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            pool.appendChild(icon)
            pool.appendChild(num)
            counts.appendChild(pool)

            var handCount = document.createElement('div')
            handCount.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/hand.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            handCount.appendChild(icon)
            handCount.appendChild(num)
            counts.appendChild(handCount)

            var life = document.createElement('div')
            life.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/heart.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            life.appendChild(icon)
            life.appendChild(num)
            counts.appendChild(life)

            var counts = document.createElement('div')
            counts.className = "player-profile__counts"
            profile.appendChild(counts)


            var exile = document.createElement('div')
            exile.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/exile.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            exile.appendChild(icon)
            exile.appendChild(num)
            counts.appendChild(exile)

            var grave = document.createElement('div')
            grave.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/grave.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            grave.appendChild(icon)
            grave.appendChild(num)
            counts.appendChild(grave)

            var deck = document.createElement('div')
            deck.className = "player-profile__count"
            var icon = document.createElement('img')
            icon.className = "player-profile__count--icon"
            icon.src = "assets/icons/deck.svg"
            var num = document.createElement('div')
            num.className = "player-profile__count--num"
            num.appendChild(document.createTextNode('0'))
            deck.appendChild(icon)
            deck.appendChild(num)
            counts.appendChild(deck)


            var subSide = document.createElement('div')
            subSide.className = "hostile-side"

            var field = document.createElement('div')
            field.className = "field"
            field.style.height = "49%";
            field.setAttribute('data-owned-by', data.players[index][0])

            var lands = document.createElement('div')
            lands.className = "lands"
            lands.style.height = "49%";
            lands.setAttribute('data-owned-by', data.players[index][0])

            subSide.appendChild(field)
            subSide.appendChild(lands)

            side.appendChild(profile)
            side.appendChild(subSide)

            gameBoard.appendChild(side)
        }
    }

    for (const index in data.players) {
        if (!finished) {
            if (data.players[index][0] == currPlayerID) {
                finished = true
            } else {

                var side = document.createElement('div')
                side.className = "board-side" + height

                var profile = document.createElement('div')
                profile.className = "player-profile"
                profile.setAttribute('data-owned-by', data.players[index][0])

                var pfp = document.createElement('div')
                pfp.className = "player-profile__pfp"
                var pic = document.createElement('img')
                pfp.appendChild(pic)
                profile.appendChild(pfp)
                if (data.players[index][4] == null) {
                    pic.src = "assets/icons/default-pfp.svg"
                } else {
                    pic.src = "assets/icons/default-pfp.svg"
                }

                var name = document.createElement('div')
                name.className = "player-profile__name"
                name.appendChild(document.createTextNode(data.players[index][1]))
                profile.appendChild(name)

                var counts = document.createElement('div')
                counts.className = "player-profile__counts"
                profile.appendChild(counts)

                var pool = document.createElement('div')
                pool.className = "player-profile__count"
                var icon = document.createElement('img')
                icon.className = "player-profile__count--icon"
                icon.src = "assets/icons/mana-pool.svg"
                var num = document.createElement('div')
                num.className = "player-profile__count--num"
                num.appendChild(document.createTextNode('0'))
                pool.appendChild(icon)
                pool.appendChild(num)
                counts.appendChild(pool)

                var handCount = document.createElement('div')
                handCount.className = "player-profile__count"
                var icon = document.createElement('img')
                icon.className = "player-profile__count--icon"
                icon.src = "assets/icons/hand.svg"
                var num = document.createElement('div')
                num.className = "player-profile__count--num"
                num.appendChild(document.createTextNode('0'))
                handCount.appendChild(icon)
                handCount.appendChild(num)
                counts.appendChild(handCount)

                var life = document.createElement('div')
                life.className = "player-profile__count"
                var icon = document.createElement('img')
                icon.className = "player-profile__count--icon"
                icon.src = "assets/icons/heart.svg"
                var num = document.createElement('div')
                num.className = "player-profile__count--num"
                num.appendChild(document.createTextNode('0'))
                life.appendChild(icon)
                life.appendChild(num)
                counts.appendChild(life)

                var counts = document.createElement('div')
                counts.className = "player-profile__counts"
                profile.appendChild(counts)


                var exile = document.createElement('div')
                exile.className = "player-profile__count"
                var icon = document.createElement('img')
                icon.className = "player-profile__count--icon"
                icon.src = "assets/icons/exile.svg"
                var num = document.createElement('div')
                num.className = "player-profile__count--num"
                num.appendChild(document.createTextNode('0'))
                exile.appendChild(icon)
                exile.appendChild(num)
                counts.appendChild(exile)

                var grave = document.createElement('div')
                grave.className = "player-profile__count"
                var icon = document.createElement('img')
                icon.className = "player-profile__count--icon"
                icon.src = "assets/icons/grave.svg"
                var num = document.createElement('div')
                num.className = "player-profile__count--num"
                num.appendChild(document.createTextNode('0'))
                grave.appendChild(icon)
                grave.appendChild(num)
                counts.appendChild(grave)

                var deck = document.createElement('div')
                deck.className = "player-profile__count"
                var icon = document.createElement('img')
                icon.className = "player-profile__count--icon"
                icon.src = "assets/icons/deck.svg"
                var num = document.createElement('div')
                num.className = "player-profile__count--num"
                num.appendChild(document.createTextNode('0'))
                deck.appendChild(icon)
                deck.appendChild(num)
                counts.appendChild(deck)

                var subSide = document.createElement('div')
                subSide.className = "hostile-side"

                var field = document.createElement('div')
                field.className = "field"
                field.style.height = "49%";
                field.setAttribute('data-owned-by', data.players[index][0])

                var lands = document.createElement('div')
                lands.className = "lands"
                lands.style.height = "49%";
                lands.setAttribute('data-owned-by', data.players[index][0])

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