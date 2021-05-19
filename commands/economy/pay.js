const economy = require('@listeners/economy.js'); 

module.exports.run = async (bot, message, args) => {
   
   const {guild, member} = message

   const user = message.mentions.users.first() 

    if(!user)
    {
        message.reply("Please @ the user who's balance I am adding too. Usage !pay <user> <amount>")
        return
    }

    const coinsToGive = args[1]
    if(isNaN(args[1]))
    {
        message.reply('Please provide a number I can use thank you. Usage !pay <user> <amount>')
        return
    }

    const coinsOwned = await economy.getCoins(guild.id, member.id)
    if(coinsOwned < coinsToGive)
    {
        message.reply(`You do not have ${coinsToGive} coins!`)
        return
    }

    let username = message.member.user.tag

    const remainingCoins = await economy.addCoins(
        username,
        guild.id,
        member.id,
        coinsToGive * -1
    )

    let username = message.mentions.users.tag

    const newBalance = await economy.addCoins(
        username,
        guild.id,
        user.id,
        coinsToGive
    )

    message.reply(`You have given <@${user.id}> ${coinsToGive} coins! They now have ${newBalance} coins and you have ${remainingCoins} coins!`)
}