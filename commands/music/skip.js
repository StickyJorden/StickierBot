const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot, message, args) => {

    if(!message.member.voice.channel) return message.channel.send("You must be in a voice channel to use this commmand.")

    let queue = await bot.distube.getQueue(message); 

    if(queue)
    {
            bot.distube.skip(message);
            message.channel.send("the music has been skipped.")
    }
    else if(!queue)
    {
            return; 
    }

}
