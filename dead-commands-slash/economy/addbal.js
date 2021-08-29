const economy = require('@listeners/economy.js'); 
const Discord = require('discord.js');


module.exports = {
	name: 'addbal', 
    description: 'add tokens to another user',
	async execute(client, interaction, args) {
		
        if(message.author.id != 338544317427875851)
        {
            return message.channel.send({content: "You aren't sticky enough for that."})
        }
       
        const user = message.mentions.users.first() 
    
        //Make sure a user was mentioned
        if(!user)
        {
            let embed = new Discord.MessageEmbed()
                .setTitle("Add Balance") 
                .setDescription("Please @ the user who's balance I am adding too. Usage !pay <user> <amount>")
                .setColor("#197419")
                .setTimestamp();
        
            message.channel.send({embeds: [embed]});
            return
        }
        
        //If user not an admin tell them no
        if(!message.member.hasPermission('ADMINISTRATOR')){
    
            let embed = new Discord.MessageEmbed()
                .setTitle("Add Balance") 
                .setDescription("You aren't sticky enough for that yo.")
                .setColor("#197419")
                .setTimestamp();
            
            message.channel.send({embeds: [embed]});
            return
        }
    
        const coins = args[1]
    
        //Make sure it is a number
        if(isNaN(coins)){
    
            let embed = new Discord.MessageEmbed()
                .setTitle("Add Balance") 
                .setDescription('Please provide a number I can use thank you. Usage !pay <user> <amount>')
                .setColor("#197419")
                .setTimestamp();
            
            message.channel.send({embeds: [embed]});
            return
        }
    
        //Make sure they use whole numbers only
        if(coins % 1 != 0)
        {
            let embed = new Discord.MessageEmbed()
                .setTitle("Add Balance") 
                .setDescription('Please whole numbers only. Usage !pay <user> <amount>')
                .setColor("#197419")
                .setTimestamp();
            
            message.channel.send({embeds: [embed]});
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
        
        message.channel.send({embeds: [embed]});
	},
};