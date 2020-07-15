import { cmcChart } from './stats-page.js'
import { findCardByID, findCardsByNameQuery } from './database.js'

const { dialog } = require('electron').remote
const path = require('path')
const fs = require('fs')

const c1 = document.getElementById("c1")
const input = document.getElementById("searchBar")
const searchResults = document.getElementById("searchResults")
const c2 = document.getElementById("c2")
const plus1 = document.getElementById('plus-1')
const minus1 = document.getElementById('minus-1')
const deckList = document.getElementById("deckList")
const c3 = document.getElementById("c3")
const clearButton = document.getElementById("clearDeck")
const saveButton = document.getElementById("saveDeck")
const loadButton = document.getElementById("loadDeck")


input.addEventListener('input', findResults)
plus1.addEventListener('click', (e) => {
    if (selectedEntry != undefined) {
        var id = selectedEntry.id
        currDeck[id] += 1
        selectedEntry.removeChild(selectedEntry.lastChild)
        selectedEntry.appendChild(document.createTextNode('x' + currDeck[id]))
        cmcChart.data.datasets[0].data[card.cmc] -= 1
        cmcChart.update()
    }
})
minus1.addEventListener('click', (e) => {
    if (selectedEntry != undefined) {
        var id = selectedEntry.id

        if (currDeck[id] == 1) {
            deckList.removeChild(selectedEntry)
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
clearButton.addEventListener('click', (e) => { deckList.innerHTML = '' })
loadButton.addEventListener('click', loadDeck)
saveButton.addEventListener('click', saveDeck)
c2.addEventListener('click', selectCard)



var currDeck = {}
var totalCards = 0
var deckName;
var selectedEntry;

function findResults(e) {
    searchResults.innerHTML = "";
    if (input.value.length >= 3) {
        findCardsByNameQuery(new RegExp(input.value, 'ig'), (err, cards) => { cards.forEach(populateResult) })
    }
}

function populateResult(card) {
    var result = document.createElement("div")
    result.className = 'result'
    result.setAttribute('data-oracle-id', card.oracle_id)

    var image = document.createElement("img")
    image.className = "result-thumbnail"
    image.src = card.image_uris.normal
    image.setAttribute('data-oracle-id', card.oracle_id)
    image.addEventListener('mouseover', (e) => {
        c3.innerHTML = ""
        var image = document.createElement("img")
        image.src = e.srcElement.src
        image.className = "enhanced-image"
        c3.appendChild(image)
    })
    image.addEventListener('mouseout', (e) => {
        c3.innerHTML = ""
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
    searchResults.appendChild(result)
    searchResults.appendChild(line)

    result.addEventListener('click', addToDeck)
}

function addToDeck(e) {
    var id = e.srcElement.getAttribute('data-oracle-id')

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
            entry.addEventListener('click', (e) => {
                c3.innerHTML = ""
                var image = document.createElement("img")
                image.src = e.srcElement.getAttribute('data-img-src')
                image.className = "enhanced-image"
                c3.appendChild(image)
            })
            deckList.appendChild(entry)

        } else {
            entry = document.getElementById(id)
            entry.innerHTML = ""
            var name = (document.createElement("div")).appendChild(document.createTextNode(cardName))
            var num = (document.createElement("div")).appendChild(document.createTextNode('x' + currNum))

            entry.appendChild(name)
            entry.appendChild(document.createElement('div'))
            entry.appendChild(num)

            entry.setAttribute('data-img-src', card.image_uris.normal)
            entry.addEventListener('click', (e) => {
                c3.innerHTML = ""
                var image = document.createElement("img")
                image.src = e.srcElement.getAttribute('data-img-src')
                image.className = "enhanced-image"
                c3.appendChild(image)
            })
        }

    })
}

function loadDeck(e) {
    deckList.innerHTML = ""
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
            var entry = document.createElement("div")
            entry.className = "deckEntry"
            entry.id = id
            entry.appendChild(document.createTextNode(card.name))
            entry.appendChild(document.createElement('div'))
            entry.appendChild(document.createTextNode('x' + data[id]))
            entry.setAttribute('data-img-src', card.image_uris.normal)
            entry.addEventListener('click', (e) => {
                c3.innerHTML = ""
                var image = document.createElement("img")
                image.src = e.srcElement.getAttribute('data-img-src')
                image.className = "enhanced-image"
                c3.appendChild(image)
            })
            deckList.appendChild(entry)

            cmcChart.data.datasets[0].data[card.cmc] += 1
            cmcChart.update()
        })
    }
}

function saveDeck(e) {
    var filePath = dialog.showSaveDialogSync({
        title: "Save Deck",
        defaultPath: path.join(__dirname, "decks"),
        buttonLabel: "Save Deck",
        filters: [{ name: 'CARDNAME Deck', extensions: ['dck'] }, { name: 'All Files', extensions: ['*'] }]
    })
    fs.writeFileSync(filePath, JSON.stringify(currDeck))
    deckName = path.basename(filePath, '.dck')
}

function selectCard(e) {
    if (e.srcElement.className == "deckEntry") {
        if (selectedEntry != undefined) {
            selectedEntry.style = ""
        }
        e.srcElement.style = "background-color: gray;";
        selectedEntry = e.srcElement
    }
}