export { findCardByID, findCardsByQuery, findCardsByNameQuery }

const fs = require('fs')
const path = require('path')

var db = new Nedb();
var data = fs.readFileSync('./dominaria.json')
db.insert(JSON.parse(data))


function findCardByID(id, callback) {
    db.findOne({ oracle_id: id }, callback)
}

function findCardsByNameQuery(query, callback) {
    // query is a RegExp 
    db.find({ name: query }, callback);
}

function findCardsByQuery(query, callback) {

}