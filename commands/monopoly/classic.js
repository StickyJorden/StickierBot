const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('classic')
		.setDescription('monopoly scoreboard: classic ruleset'),
	async execute(interaction, message, args) {
		const embed = new Discord.MessageEmbed()
      .setTitle('Monopoly Leaderboard')
      .setDescription('Classic')
      .setThumbnail('https://vignette.wikia.nocookie.net/monopoly/images/4/43/Sr_monopoly_vota.png/revision/latest?cb=20180808000359')
      .setColor('#8FBC72')
      .addField('Jordan','Score: 109', false)
      .addField('Wolf','Score: 99', false )
      .addField('David','Score: 100', false )
      .addField('Azad','Score: -950', false )
      message.channel.send({embed: embed});
	},
};
