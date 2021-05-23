const economy = require('@listeners/economy.js'); 
const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {

   
    const user = message.mentions.users.first() 

    if(!user)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Add Balance") 
            .setDescription("Please @ the user who's balance I am adding too. Usage !pay <user> <amount>")
            .setColor("#197419")
            .setTimestamp();
    
        message.channel.send(embed);
        return
    }
      //If user not an admin tell them no
    if(!message.member.hasPermission('ADMINISTRATOR')){

        let embed = new Discord.MessageEmbed()
            .setTitle("Add Balance") 
            .setDescription("You aren't sticky enough for that yo.")
            .setColor("#197419")
            .setTimestamp();
        
        message.channel.send(embed);
        return
    }

    const coins = args[1]
    if(isNaN(coins)){

        let embed = new Discord.MessageEmbed()
            .setTitle("Add Balance") 
            .setDescription('Please provide a number I can use thank you. Usage !pay <user> <amount>')
            .setColor("#197419")
            .setTimestamp();
        
        message.channel.send(embed);
        return
    }

    const userID = user.id
    const guildID = message.guild.id
    const username = user.tag

    const newCoins = await economy.addCoins(username, guildID, userID, coins)

    let embed = new Discord.MessageEmbed()
        .setTitle("Add Balance") 
        .setDescription(`You have given <@${userID}> ${coins} coin(s). They now have ${newCoins} coin(s)!`)
        .setColor("#197419")
        .setTimestamp();
    
    message.channel.send(embed);
}