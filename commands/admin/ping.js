const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: "ping",
  alias: [],
  description: 'replies with pong',
  run: async (client, message, args) => { 
    message.channel.send({content: "Pong!"})
  }
}
