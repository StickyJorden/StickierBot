const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {

    if(message.author.id != 338544317427875851)
    {
        return message.channel.send("You aren't sticky enough for that.")
    }

    
}