const economy = require('@listeners/levels.js'); 

module.exports.run = async (bot, message, args) => {
   

    const user = message.mentions.users.first() || message.author
    const userID = user.id

    const guildID = message.guild.id
    const username = user.tag

    const level = await economy.getLevels(username, guildID, userID)

    message.reply(`That user is currently level ${level}!`)
   
}