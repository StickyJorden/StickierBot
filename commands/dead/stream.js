const Discord = require('discord.js');

exports.run = (bot, message, args, func) => {

    const embed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Twitch Stream')
      .setThumbnail('https://9to5mac.com/wp-content/uploads/sites/6/2019/09/03-glitch.jpg?quality=82&strip=all')
      .addField('Check out the stream here!', 'https://www.twitch.tv/sosojay', false)
      message.channel.send({embed});
}
