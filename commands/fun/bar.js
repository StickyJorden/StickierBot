const Discord = require('discord.js');
const fs = require('fs');
const createBar = require('string-progressbar');

//We can call the JSON file for quotes
const moves = JSON.parse(fs.readFileSync('Storage/moves.json','utf8'));


module.exports.run = async (bot, message, args) => {

    // assaign values to total and current
var total = 100;
var current = 15;
var size = 10, line = '🟩', slider = '🔘';
// Call the createBar method, first two arguments are mandatory
// size (length of bar) default to 40, line default to '▬' and slider default to 🔘
var bar = createBar(total, current, size)
message.channel.send(bar[0]);
// There you go, now you have progress bar and percentage returned in an array as string
}