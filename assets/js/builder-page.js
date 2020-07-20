import { cmcChart } from './stats-page.js'
import { findCardByID, findCardsByNameQuery } from './database.js'

const { dialog } = require('electron').remote
const path = require('path')
const fs = require('fs')

var currDeck = {} // holds the currently viewed deck
var totalCards = 0 // total number of cards in currenly viewed deck 
var deckName; // name of the currently viewed deck
var selectedEntry; // currently selected card in decklist

/**
 * Finds all matching cards in database and populate the found results
 * @param {Event} event
 */
function findResults(event) {
    document.getElementById("searchResults").innerHTML = "";
    if (input.value.length >= 3) {
        findCardsByNameQuery(new RegExp(input.value, 'ig'), (err, cards) => { cards.forEach(populateResult) })
    }
}

/**
 * Populates the found card object into the user's search results
 * @param {Object} card 
 */
function populateResult(card) {
    var result = document.createElement("div")
    result.className = 'result'
    result.setAttribute('data-oracle-id', card.oracle_id)

    var image = document.createElement("img")
    image.className = "result-thumbnail"
    image.src = card.image_uris.normal
    image.setAttribute('data-oracle-id', card.oracle_id)
    image.addEventListener('mouseover', (event) => {
        document.getElementById("c3").innerHTML = ""
        var image = document.createElement("img")
        image.src = event.srcElement.src
        image.className = "enhanced-image"
        document.getElementById("c3").appendChild(image)
    })
    image.addEventListener('mouseout', (e) => {
        document.getElementById("c3").innerHTML = ""
    })

    var cardText = document.createElement("div")
    cardText.className = "result-cardText"
    cardText.setAttribute('data-oracle-id', card.oracle_id)

    var name = document.createElement("p")
    name.className = "result-name"
    name.setAttribute('data-oracle-id', card.oracle_id)

    var rulesText = document.createElement("p")
    rulesText.className = "result-rulesText"
    rulesText.setAttribute('data-oracle-id', card.oracle_id)

    var line = document.createElement("hr")
    line.style = "width: 92%; border-color: black;margin-left: auto;margin-right: auto;"

    name.appendChild(document.createTextNode(card.name))
    rulesText.appendChild(document.createTextNode(card.oracle_text))
    cardText.appendChild(name)
    cardText.appendChild(rulesText)
    result.appendChild(image)
    result.appendChild(cardText)
    document.getElementById("searchResults").appendChild(result)
    document.getElementById("searchResults").appendChild(line)

    result.addEventListener('click', addToDeck)
}

/**
 * Adds the selected card to the currently viewed deck
 * @param {Event} event 
 */
function addToDeck(event) {
    var id = event.srcElement.getAttribute('data-oracle-id')

    findCardByID(id, (err, card) => {
        var cardName = card.name
        var currNum

        if (currDeck[id] == undefined) {
            currDeck[id] = 1
            currNum = currDeck[id]
        } else {
            currDeck[id] += 1
            currNum = currDeck[id]
        }

        cmcChart.data.datasets[0].data[card.cmc] += 1
        cmcChart.update()

        if ((document.getElementById(id)) == undefined) {
            var entry = document.createElement("div")
            var name = (document.createElement("div")).appendChild(document.createTextNode(cardName))
            var num = (document.createElement("div")).appendChild(document.createTextNode('x' + currNum))

            entry.setAttribute('data-oracle-id', id)
            entry.appendChild(name)
            entry.appendChild(document.createElement('div'))
            entry.appendChild(num)
            entry.className = "deckEntry"
            entry.id = id
            entry.setAttribute('data-img-src', card.image_uris.normal)
            entry.addEventListener('click', (event) => {
                document.getElementById("c3").innerHTML = ""
                var image = document.createElement("img")
                image.src = event.srcElement.getAttribute('data-img-src')
                image.className = "enhanced-image"
                document.getElementById("c3").appendChild(image)
            })
            document.getElementById("deckList").appendChild(entry)

        } else {
            entry = document.getElementById(id)
            entry.innerHTML = ""
            var name = (document.createElement("div")).appendChild(document.createTextNode(cardName))
            var num = (document.createElement("div")).appendChild(document.createTextNode('x' + currNum))

            entry.appendChild(name)
            entry.appendChild(document.createElement('div'))
            entry.appendChild(num)

            entry.setAttribute('data-img-src', card.image_uris.normal)
            entry.addEventListener('click', (event) => {
                document.getElementById("c3").innerHTML = ""
                var image = document.createElement("img")
                image.src = event.srcElement.getAttribute('data-img-src')
                image.className = "enhanced-image"
                document.getElementById("c3").appendChild(image)
            })
        }

    })
}

/**
 * Opens a dialog box to choose a deck and set it as the currently viewed deck
 * @param {Event} event 
 */
function loadDeck(event) {
    document.getElementById("deckList").innerHTML = ""
    cmcChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    currDeck = {}
    var filePath = dialog.showOpenDialogSync({
        title: "Load Deck",
        defaultPath: path.join(__dirname, "decks"),
        buttonLabel: "Load Deck",
        filters: [{ name: 'CARDNAME Deck', extensions: ['dck'] }, { name: 'All Files', extensions: ['*'] }]
    })[0]

    var data = JSON.parse(fs.readFileSync(path.resolve(filePath)))

    for (const id in data) {

        findCardByID(id, (err, card) => {
            currDeck[id] = data[id]
            entry = document.createElement("div")
            entry.className = "deckEntry"
            entry.id = id
            entry.appendChild(document.createTextNode(card.name))
            entry.appendChild(document.createElement('div'))
            entry.appendChild(document.createTextNode('x' + data[id]))
            entry.setAttribute('data-img-src', card.image_uris.normal)
            entry.addEventListener('click', (event) => {
                document.getElementById("c3").innerHTML = ""
                var image = document.createElement("img")
                image.src = event.srcElement.getAttribute('data-img-src')
                image.className = "enhanced-image"
                document.getElementById("c3").appendChild(image)
            })
            document.getElementById("deckList").appendChild(entry)

            cmcChart.data.datasets[0].data[card.cmc] += 1
            cmcChart.update()
        })
    }
}

/**
 * Opens a dialog box to save the currently viewed deck as a .dck file
 * @param {*} event
 */
function saveDeck(event) {
    var filePath = dialog.showSaveDialogSync({
        title: "Save Deck",
        defaultPath: path.join(__dirname, "decks"),
        buttonLabel: "Save Deck",
        filters: [{ name: 'CARDNAME Deck', extensions: ['dck'] }, { name: 'All Files', extensions: ['*'] }]
    })
    fs.writeFileSync(filePath, JSON.stringify(currDeck))
    deckName = path.basename(filePath, '.dck')
}

/**
 * Initializes selectedEntry with the chosen card
 * @param {Event} event 
 */
function selectCard(event) {
    if (event.srcElement.className == "deckEntry") {
        if (selectedEntry != undefined) {
            selectedEntry.style = ""
        }
        event.srcElement.style = "background-color: gray;";
        selectedEntry = event.srcElement
    }
}

// Adds an event listener to add 1 from selectedEntry and update the decklist
document.getElementById('plus-1').addEventListener('click', (e) => {
    if (selectedEntry != undefined) {
        var id = selectedEntry.id
        currDeck[id] += 1
        selectedEntry.removeChild(selectedEntry.lastChild)
        selectedEntry.appendChild(document.createTextNode('x' + currDeck[id]))
        cmcChart.data.datasets[0].data[card.cmc] -= 1
        cmcChart.update()
    }
})

// Adds an event listener to subtract 1 from selectedEntry and update the decklist
document.getElementById('minus-1').addEventListener('click', (e) => {
    if (selectedEntry != undefined) {
        var id = selectedEntry.id

        if (currDeck[id] == 1) {
            document.getElementById("deckList").removeChild(selectedEntry)
            delete currDeck[id]
        } else {
            currDeck[id] -= 1
            selectedEntry.removeChild(selectedEntry.lastChild)
            selectedEntry.appendChild(document.createTextNode('x' + currDeck[id]))
        }
        cmcChart.data.datasets[0].data[card.cmc] -= 1
        cmcChart.update()
    }
})

document.getElementById("searchBar").addEventListener('input', findResults)
document.getElementById("loadDeck").addEventListener('click', loadDeck)
document.getElementById("saveDeck").addEventListener('click', saveDeck)
document.getElementById("c2").addEventListener('click', selectCard)
document.getElementById("clearDeck").addEventListener('click', (event) => { document.getElementById("deckList").innerHTML = '' })