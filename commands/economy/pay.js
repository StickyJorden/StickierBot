const economy = require('@listeners/economy.js'); 
const Discord = require('discord.js'); 

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {
   
   const {guild, member} = message

   const user = message.mentions.users.first() 

    //Make sure a user was mentioned
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

    //Make sure it is a number
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
    
    //Make sure they use whole numbers only
    if(coinsToGive % 1 != 0)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Add Balance") 
            .setDescription('Please whole numbers only. Usage !pay <user> <amount>')
            .setColor("#197419")
            .setTimestamp();
        
        message.channel.send(embed);
        return
    }

    //Find the message user to check their balance
    let username = message.member.user.tag
    let guildID = guild.id
    let userID = member.id


    //Get balance
    const coinsOwned = await economy.getCoins(username, guildID, userID)

    //Make sure they can afford to pay
    if(coinsOwned < coinsToGive || coinsToGive <= 0)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Pay") 
            .setDescription(`You do not have ${numberWithCommas(coinsToGive)} coins!`)
            .setColor("#197419")
            .setTimestamp();
    
        message.channel.send(embed);
        return
    }

    //Take coins away from message user
    const remainingCoins = await economy.addCoins(
        username,
        guildID,
        userID,
        coinsToGive * -1
    )

    //Find the mentioned user
    username = user.tag
    guildID = guild.id
    userID = user.id

    //add coins to mentioned user
    const newBalance = await economy.addCoins(
        username,
        guildID,
        userID,
        coinsToGive
    )

    let embed = new Discord.MessageEmbed()
            .setTitle("Pay") 
            .setDescription(`You have given <@${user.id}> ${coinsToGive} coins! They now have ${numberWithCommas(newBalance)} coins and you have ${numberWithCommas(remainingCoins)} coins!`)
            .setColor("#197419")
            .setTimestamp();
    
    message.channel.send(embed);
}