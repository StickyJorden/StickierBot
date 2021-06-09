const economy = require('@listeners/economy.js'); 
const Discord = require('discord.js'); 

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {
   
    const user = message.mentions.users.first() || message.author
    const userID = user.id

    const guildID = message.guild.id
    const username = user.tag

    
    
    const coins = await economy.getCoins(username, guildID, userID)

    let embed = new Discord.MessageEmbed()
        .setTitle("Balance") 
        .setDescription(`That user ${username} has ${numberWithCommas(coins)} coins!`)
        .setColor("#197419")
        .setTimestamp();
    
    message.channel.send(embed);
}