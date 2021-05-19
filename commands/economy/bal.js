const economy = require('@listeners/economy.js'); 

module.exports.run = async (bot, message, args) => {
   
    const user = message.mentions.users.first() || message.author
    const userID = user.id

    const guildID = message.guild.id
    const username = user.tag
    
    const coins = await economy.getCoins(username, guildID, userID)

    message.reply(`That user ${username} has ${coins} coins!`)
}