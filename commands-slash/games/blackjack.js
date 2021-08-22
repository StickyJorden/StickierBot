const blackjack = require("discord-blackjack");
const Discord = require('discord.js'); 
const economy = require('@listeners/economy.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Add commas to numbers(we use this for the balance of users)
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

module.exports = {
      data: new SlashCommandBuilder()
          .setName('blackjack')
          .setDescription('play blackjack for tokens'),
      async execute(interaction, message, args) {
            //Make sure the user gives us either the table or money to gamble with
            if(!args[0]) return message.reply({content: `You need to bet something. Use \`!blackjack <tokens>\``});

            //Instance Variables
            const {guild, member} = message
            const { id } = member
            let username = message.member.user.tag
            let guildID = guild.id
            let userID = id
            
            let coins = 0;
            coins = await economy.getCoins(username, guild.id, id)

            if(coins <= 0)
            {
                return message.reply({content: `You have no coins to wager with! Try going to \`!work\``});
            }
            else if(coins <= args[0])
            {
                return message.reply({content: `You have do not have that many coins to wager with! Your balance is: ${numberWithCommas(coins)}`});
            }
            //If the user submits a whole number play the game
            else if(isNaN(args[0]) || args[0] % 1 != 0 || args[0] < 0)
            {
                let embed = new Discord.MessageEmbed()
                    .setColor(000000)
                    .setTitle(`Sticky Slots`)
                    .addField(`Rules When Playing`,`1. Be sure to use positive numbers. \n 2. No characters. \n 3. Whole numbers only please. \n 4. I am really good at taking your money.`, false)

                message.channel.send({embeds: [embed]})
                return
            }
            else
            {

            let game = await blackjack(message, bot, {resultEmbed: true})

            switch (game.result) {
                    
                case "Win":

                    //Add users coin balance
                    await economy.addCoins(username, guild.id, id, (Math.floor(1 * args[0])))
                    break;

                case "Tie":

                    //Add users coin balance
                    await economy.addCoins(username, guild.id, id, (Math.floor(args[0])))
                    break;

                case "Lose":

                    //Add users coin balance
                    await economy.addCoins(username, guild.id, id, (Math.floor(-1 * args[0])))
                    break;

                case "Double Win":

                    //Add users coin balance
                    await economy.addCoins(username, guild.id, id, (Math.floor(2 * args[0])))
                    break;        
                
                case "Double Lose":

                    //Add users coin balance
                    await economy.addCoins(username, guild.id, id, (Math.floor(-2 * args[0])))
                    break;        
                    
                }

            }
      },
  };
  
module.exports.run = async (bot, message, args) => {
  
    
        
}