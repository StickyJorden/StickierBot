const Discord = require('discord.js');
const fs = require('fs');


module.exports = {
	name: 'stop', 
    description: 'stop the current song being played',
	async execute(client, interaction, args) {
		if(!message.member.voice.channel) return message.channel.send({content: "You must be in a voice channel to use this commmand."})

                let queue = await bot.distube.getQueue(message); 

                if(queue)
                {
                        bot.distube.stop(message);
                        message.channel.send({content: "the music has been stopped."})
                }
                else if(!queue)
                {
                        return; 
                }
	},
};


