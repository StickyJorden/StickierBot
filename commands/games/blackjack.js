const blackjack = require("discord-blackjack");
const Discord = require('discord.js'); 
const economy = require('@listeners/economy.js'); 

module.exports.run = async (bot, message, args) => {
  
    //Make sure the user gives us either the table or money to gamble with
    if(!args[0]) return message.reply('You need to bet something. Use !blackjack <tokens>');

    //Instance Variables
    const {guild, member} = message
    const { id } = member
    let username = message.member.user.tag
    let guildID = guild.id
    let userID = id


    let game = await blackjack(message, bot, {resultEmbed: true})
    let coins = 0;

    switch (game.result) {
            
        case "Win":

            //Add users coin balance
            await economy.addCoins(username, guild.id, id, (Math.floor(1 * args[0])))
            //Find users coin balance
            coins = await economy.getCoins(username, guild.id, id)
            break;

        case "Tie":

            //Add users coin balance
            await economy.addCoins(username, guild.id, id, (Math.floor(args[0])))
            //Find users coin balance
            coins = await economy.getCoins(username, guild.id, id)
            break;

        case "Lose":

            //Add users coin balance
            await economy.addCoins(username, guild.id, id, (Math.floor(-1 * args[0])))
            //Find users coin balance
            coins = await economy.getCoins(username, guild.id, id)
            break;

        case "Double Win":

            //Add users coin balance
            await economy.addCoins(username, guild.id, id, (Math.floor(2 * args[0])))
            //Find users coin balance
            coins = await economy.getCoins(username, guild.id, id)
            break;        
        
        case "Double Lose":

            //Add users coin balance
            await economy.addCoins(username, guild.id, id, (Math.floor(-2 * args[0])))
            //Find users coin balance
            coins = await economy.getCoins(username, guild.id, id)
            break;        
            
        }
        
}