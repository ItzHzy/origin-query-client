const fs = require('fs');

var buffer = fs.readFileSync('./config.json')
const settings = JSON.parse(buffer)

export { settings };