const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
        name: "!stop",
        alias: ["disconnect", "leave"],
        description: 'stop the current song',
        run: async (client, message, args) => { 

                if(!message.member.voice.channel) return message.channel.send("You must be in a voice channel to use this commmand.")

                let queue = await client.distube.getQueue(message); 

                if(queue)
                {
                        client.distube.stop(message);
                        message.channel.send("the music has been stopped.")
                }
                else if(!queue)
                {
                        return; 
                }
        }
}
