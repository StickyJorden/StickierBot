const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {

    if(!args[0]) return message.reply("We need something to celebrate!");

    let holiday = message.toString().slice(9);

    let embed = new Discord.MessageEmbed()
        .setTitle("Hey Everyone We're Celebrating! ")
        .setDescription(`**${holiday}**`)
        .setColor("#FFD300")
        .setThumbnail("https://78.media.tumblr.com/tumblr_m1082bORxM1r04n3so1_500.gif");

  message.channel.send(embed);
 
}