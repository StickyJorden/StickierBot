const { SlashCommandBuilder } = require('@discordjs/builders');

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fate')
		.setDescription('ask me a question'),
	async execute(interaction, message, args) {
		if(!args[0]) return message.reply({content: "I have no fate to determine."});

        const answers = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.'
        ]

        message.channel.send({content: answers[getRandomInt(answers.length)]}); 
	},
};
