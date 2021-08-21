const Discord = require('discord.js');
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('play music in voicechat'),
	async execute(interaction, message, args) {
		if(!message.member.voice.channel) return message.channel.send({content: "You must be in a voice channel to use this commmand."});

        const music = args.join(" ");

        await bot.distube.play(message, music);
	},
};
