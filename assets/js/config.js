const fs = require('fs');

var buffer = fs.readFileSync('./config.json')
const settings = JSON.parse(buffer)

function writeToConfig() {
    fs.writeFileSync('./config.json', JSON.stringify(settings))
}

export { settings, writeToConfig };