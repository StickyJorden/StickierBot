

function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
	name: 'pick', 
    description: 'pick from a list of items',
	async execute(client, interaction, args) {
		if(!args[0]) return message.reply("I have nothing to choose from.");

        let choice = getRandomInt(args.length);

        message.channel.send({content: args[choice]});
	},
};

