const Discord = require('discord.js');
const fs = require('fs');
const { WouldYouRather } = require('discord-gamecord');
const economy = require('@listeners/economy.js');

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

//Pay the player a random amount of money from the determined max (500)
function payPlayer(message)
{
  //Instance Variables
  const {guild, member} = message
  const { id } = member
  let username = message.member.user.tag
  let max = 500

  economy.addCoins(username, guild.id, id, getRandomInt(max))
}

module.exports = {
  name: "rather",
  alias: ["wyr"],
  description: 'would you rather?',
  run: async (client, message, args) => { 

    new WouldYouRather({
        message: message,
        slash_command: false,
        embed: {
          title: 'Would You Rather',
          color: '#5865F2',
        },
        thinkMessage: '**Thinking...**',
        buttons: { option1: 'Option 1', option2: 'Option 2' },
        othersMessage: 'You are not allowed to use buttons for this message!',
      }).startGame();

    payPlayer(message)
      
  }
}
