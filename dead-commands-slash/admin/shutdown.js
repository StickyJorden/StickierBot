

module.exports = {
	name: "shutdown",
    description: "turn off the bot",
	async execute(client, interaction, args) {
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