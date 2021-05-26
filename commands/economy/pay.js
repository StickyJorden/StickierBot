const economy = require('@listeners/economy.js'); 
const Discord = require('discord.js'); 

module.exports.run = async (bot, message, args) => {
   
   const {guild, member} = message

   const user = message.mentions.users.first() 

    if(!user)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Pay") 
            .setDescription("Please @ the user who's balance I am adding too. Usage !pay <user> <amount>")
            .setColor("#197419")
            .setTimestamp();
    
        message.channel.send(embed);
        return
    }

    const coinsToGive = args[1]
    if(isNaN(args[1]))
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Pay") 
            .setDescription('Please provide a number I can use thank you. Usage !pay <user> <amount>')
            .setColor("#197419")
            .setTimestamp();
    
        message.channel.send(embed);
        return
    }

    let username = message.member.user.tag
    let guildID = guild.id
    let userID = member.id

    const coinsOwned = await economy.getCoins(username, guildID, userID)

    if(coinsOwned < coinsToGive || coinsToGive <= 0)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Pay") 
            .setDescription(`You do not have ${coinsToGive} coins!`)
            .setColor("#197419")
            .setTimestamp();
    
        message.channel.send(embed);
        return
    }

    

    const remainingCoins = await economy.addCoins(
        username,
        guildID,
        userID,
        coinsToGive * -1
    )

    username = message.mentions.users.tag
    guildID = guild.id
    userID = user.id

    const newBalance = await economy.addCoins(
        username,
        guildID,
        userID,
        coinsToGive
    )

    let embed = new Discord.MessageEmbed()
            .setTitle("Pay") 
            .setDescription(`You have given <@${user.id}> ${coinsToGive} coins! They now have ${newBalance} coins and you have ${remainingCoins} coins!`)
            .setColor("#197419")
            .setTimestamp();
    
        message.channel.send(embed);
}