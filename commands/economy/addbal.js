const economy = require('@listeners/economy.js'); 

module.exports.run = async (bot, message, args) => {
   
    const user = message.mentions.users.first() 

    if(!user)
    {
        message.reply("Please @ the user who's balance I am adding too. Usage !pay <user> <amount>")
        return
    }
      //If user not an admin tell them no
    if(!message.member.hasPermission('ADMINISTRATOR')){
        message.channel.send("You aren't sticky enough for that yo.")
        return
    }

    const coins = args[1]
    if(isNaN(coins)){
        message.reply('Please provide a number I can use thank you. Usage !pay <user> <amount>')
        return
    }

    const userID = user.id
    const guildID = message.guild.id
    const username = user.tag

    const newCoins = await economy.addCoins(username, guildID, userID, coins)

    message.reply(`You have given <@${userID}> ${coins} coin(s). They now have ${newCoins} coin(s)!`)

}