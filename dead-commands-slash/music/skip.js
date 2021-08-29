const Discord = require('discord.js');
const fs = require('fs');


module.exports = {
	name: 'skip', 
    description: 'skip the current song being played',
	async execute(client, interaction, args) {
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

