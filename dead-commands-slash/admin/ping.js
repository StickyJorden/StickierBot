

module.exports = {
	name: 'ping', 
	description: 'replies with pong',
	type: 'CHAT_INPUT',
	async execute(client, interaction, args) {
		interaction.followUp({content: 'Pong!'});
	},
};