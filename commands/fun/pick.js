const Discord = require('discord.js');
const fs = require('fs');

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}


module.exports.run = async (bot, message, args) => {

    if(!args[0]) return message.reply("I have nothing to choose from.");

    let choice = getRandomInt(args.length);

    message.channel.send(args[choice]);


  
}