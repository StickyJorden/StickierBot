const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot, message, args) => {

    if(!message.member.voice.channel) return message.channel.send("You must be in a voice channel to use this commmand.")

    const music = args.join(" ");

    await bot.distube.play(message, music);

}
