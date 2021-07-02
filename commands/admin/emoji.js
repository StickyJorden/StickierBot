const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client(); 

//functions
function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.run = async (bot, message, args) => {

    // Getting all emojis from a server
    client.guilds.cache.get('guild_id').emojis.forEach(emoji => console.log(emoji.animated ? '<a:' + emoji.name + ':' + emoji.id + '>' : '<:' + emoji.name + ':' + emoji.id + '>'));

    // A fancier way
    let static = [], animated = [];
    client.guilds.cache.get('guild_id').emojis.forEach(emoji => emoji.animated ? animated.push([emoji.id, emoji.name]) : static.push([emoji.id, emoji.name]));

    console.log('Static Emojis\n');
    static.forEach(emoji => console.log('<:' + emoji[1] + ':' + emoji[0] + '>'));
    console.log('\nAnimated Emojis\n');
    animated.forEach(emoji => console.log('<a:' + emoji[1] + ':' + emoji[0] + '>'));

    // You can copy/paste the emojis you want into your code
    // It will not work if you paste them into Discord
}