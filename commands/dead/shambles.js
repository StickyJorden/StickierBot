const Discord = require('discord.js');


exports.run = (bot, message, args, func) => {

    const embed = new Discord.MessageEmbed()
      .setTitle('Monopoly Leaderboard')
      .setThumbnail('https://vignette.wikia.nocookie.net/monopoly/images/4/43/Sr_monopoly_vota.png/revision/latest?cb=20180808000359')
      .setColor('#8FBC72')
      .addField('Jordan','Score: 52', false)
      .addField('Wolf','Score: 49', false )
      .addField('David','Score: 52', false )
      .addField('Azad','Score: -950', false )
      message.channel.send({embed});
}
