const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
        name: "!skip",
        alias: [],
        run: async (client, message, args) => { 

                if(!message.member.voice.channel) return message.channel.send("You must be in a voice channel to use this commmand.")

                let queue = await client.distube.getQueue(message); 
    
                if(queue.songs.length > 1)
                {
                        client.distube.skip(message);
                        message.channel.send("the music has been skipped.")
                }
                else if(queue.songs.length <= 1)
                {
                        message.channel.send("there are no more songs to skip. add more to the queue or use stop.")
                        return; 
                }
        }         
}
