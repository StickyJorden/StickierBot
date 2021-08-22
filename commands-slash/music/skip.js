const Discord = require('discord.js');
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('skip the current song being played'),
	async execute(interaction, message, args) {
		if(!message.member.voice.channel) return message.channel.send({content: "You must be in a voice channel to use this commmand."});

                let queue = await bot.distube.getQueue(message); 

                if(queue)
                {
                        bot.distube.skip(message);
                        message.channel.send({content: "the music has been skipped."});
                }
                else if(!queue)
                {
                        return; 
                }
	},
};

