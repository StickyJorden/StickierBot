const { SlashCommandBuilder } = require('@discordjs/builders');

function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pick')
		.setDescription('pick from a list of items'),
	async execute(interaction, message, args) {
		if(!args[0]) return message.reply("I have nothing to choose from.");

        let choice = getRandomInt(args.length);

        message.channel.send({content: args[choice]});
	},
};

