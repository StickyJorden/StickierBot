const economy = require('@listeners/economy.js');
const Discord = require('discord.js');

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('charity')
		.setDescription('give money to another user'),
	async execute(interaction, message, args) {
		
        const {guild, member} = message
        const user = message.mentions.users.first() 

        if(!user)
        {
            let embed = new Discord.MessageEmbed()
                .setTitle("Charity") 
                .setDescription("Please @ the user who's balance I am giving too. Usage !charity <user> <amount>")
                .setColor("#197419")
                .setTimestamp();
        
            message.channel.send({embed: embed});
            return
        }

        const coinsToGive = args[1]
        if(isNaN(args[1]))
        {
            let embed = new Discord.MessageEmbed()
                .setTitle("Charity") 
                .setDescription('Please provide a number I can use thank you. Usage !charity <user> <amount>')
                .setColor("#197419")
                .setTimestamp();
        
            message.channel.send({embed: embed});
            return
        }

        let username = message.member.user.tag
        let guildID = guild.id
        let userID = member.id

        const coinsOwned = await economy.getCoins(username, guildID, userID)
        if(coinsOwned < coinsToGive || coinsToGive <= 0)
        {
            let embed = new Discord.MessageEmbed()
                .setTitle("Charity") 
                .setDescription(`You do not have ${coinsToGive} coins!`)
                .setColor("#197419")
                .setTimestamp();
        
            message.channel.send({embed: embed});
            return
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Charity") 
            .setDescription(`We do not have a charity command.`)
            .setColor("#197419")
            .setTimestamp();
        
        message.channel.send({embed: embed});
    },
};

   