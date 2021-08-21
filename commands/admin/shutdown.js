const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDescription('shutdown the bot'),
	async execute(interaction, message, args) {
		if(message.author.id != 338544317427875851)
        {
            return message.channel.send({content: "You aren't sticky enough for that."})
        }

        try{
            await message.channel.send({content: "Shutting down....."})
            process.exit()

        }catch(e){
            return message.channel.send({content: `ERROR: ${e.message}`})
        }
	},
};