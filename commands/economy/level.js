const economy = require('@listeners/levels.js');
const Discord = require('discord.js');  

module.exports.run = async (bot, message, args) => {
   

    const user = message.mentions.users.first() || message.author
    const userID = user.id

    const guildID = message.guild.id
    const username = user.tag

    const level = await economy.getLevels(username, guildID, userID)

    let embed = new Discord.MessageEmbed()
        .setTitle("Level") 
        .setDescription(`That user is currently level ${level}!`)
        .setColor("#197419")
        .setTimestamp();
    
    message.channel.send(embed);
   
}