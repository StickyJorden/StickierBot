const Discord = require('discord.js');
const fs = require('fs');
const economy = require('C:/Users/bigbo/OneDrive/Desktop/StickierBot-jordan/mongo-listeners/economy.js'); 

module.exports.run = async (bot, message, args) => {
   
    const user = message.mentions.users.first() || message.author
    const userID = user.id

    const guildID = message.guild.id
    
    const coins = await economy.getCoins(guildID, userID)

    message.reply(`That user has ${coins} coins!`)
}