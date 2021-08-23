const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: "ping",
  alias: [],
  run: async (client, message, args) => { 
    message.channel.send({content: "Pong!"})
  }
}
