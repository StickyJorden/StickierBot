const Discord = require('discord.js');
const fs = require('fs');


module.exports = {
	name: 'play', 
    description: 'play music in voicechat',
	async execute(client, interaction, args) {
		if(!message.member.voice.channel) return message.channel.send({content: "You must be in a voice channel to use this commmand."});

        const music = args.join(" ");

        await bot.distube.play(message, music);
	},
};
