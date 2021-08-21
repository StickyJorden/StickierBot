const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stream')
		.setDescription('link to the stream'),
	async execute(interaction, message, args) {
		const embed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Twitch Stream')
      .setThumbnail('https://9to5mac.com/wp-content/uploads/sites/6/2019/09/03-glitch.jpg?quality=82&strip=all')
      .addField('Check out the stream here!', 'https://www.twitch.tv/sosojay', false)
      message.channel.send({embed: embed});
	},
};

