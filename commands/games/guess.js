const Discord = require('discord.js');
const fs = require('fs');
const { GuessThePokemon } = require('discord-gamecord')
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
  name: "pokemon",
  alias: ["gtp", "guess"],
  description: 'Guess That Pokemon!',
  run: async (client, message, args) => { 

    new GuessThePokemon({
        message: message,
        slash_command: false,
        embed: {
          title: 'Who\'s This Pokemon?',
          footer: 'You have only 1 chance',
          color: '#5865F2',
        },
        time: 60000,
        thinkMessage: '**Thinking...**',
        winMessage: 'Nice! The pokemon was **{pokemon}**',
        stopMessage: 'Better luck next time! It was a **{pokemon}**',
        incorrectMessage: 'Nope! The pokemon was **{pokemon}**',
      }).startGame();

      payPlayer(message)
  }
}
