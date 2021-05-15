const Discord = require('discord.js');
const fs = require('fs');
const economy = require('C:/Users/bigbo/OneDrive/Desktop/StickierBot-jordan/mongo-listeners/economy.js'); 

module.exports.run = async (bot, message, args) => {
   
    const user = message.mentions.users.first() 

    if(!user)
    {
        message.reply("Please @ the user who's balance I am adding too.")
        return
    }
      //If user not an admin tell them no
    if(!message.member.hasPermission('ADMINISTRATOR')){
        message.channel.send("You aren't sticky enough for that yo.")
        return
    }

    const coins = args[2]
    if(isNaN(coins)){
        message.reply('Please provide a number I can use thank you')
        return
    }

    const userID = user.id
    const guildID = message.guild.id

    const newCoins = await economy.addCoins(guildID, userID, coins)

    message.reply(`You have given <@${userID}> ${coins} coin(s). They now have ${newCoins} coin(s)!`)

}