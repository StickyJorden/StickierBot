const Discord = require('discord.js');
const fs = require('fs');

//We can call the JSON file for quotes
const quotes = JSON.parse(fs.readFileSync('storage/quotes.json','utf8'));

//number of quotes in JSON file quotes
const max = Object.keys(quotes).length; 

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}


module.exports.run = (bot, message, args) => {

    if(message.author.id != 338544317427875851)
    {
        return  message.channel.send("You aren't sticky enough for that.");
    }

    //Send quote in the chat
    let embed = new Discord.MessageEmbed()
        .setTitle("Quote of The Day")
        .setDescription("Now enabled enjoy!")
        .setColor("#32CD32");
    
    message.channel.send(embed);

  setInterval(() => {

    //Get random number for the quote
    let number = getRandomInt(max);
    
    //Get channel to send daily quotes
    let channelSend = bot.channels.cache.get('416809623677304843');

    //Send quote in the chat
    let embed = new Discord.MessageEmbed()
        .setTitle("Quote of The Day")
        .setDescription(quotes[number].quote)
        .setColor("#32CD32")
        .setFooter(`Quote Provided By: ${quotes[number].name}`);
    
    channelSend.send(embed);

    }, 86400000);
}