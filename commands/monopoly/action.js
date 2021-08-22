const Discord = require('discord.js');

module.exports = {
  name: "action",
  alias: [],
  run: async (client, message, args) => { 

    const embed = new Discord.MessageEmbed()
      .setTitle('Monopoly Leaderboard')
      .setDescription('Action Cards')
      .setThumbnail('https://vignette.wikia.nocookie.net/monopoly/images/4/43/Sr_monopoly_vota.png/revision/latest?cb=20180808000359')
      .setColor('#FF0000')
      .addField('Jordan','Score: 106', false)
      .addField('Wolf','Score: 103', false )
      .addField('David','Score: 102', false )
      .addField('Azad','Score: -950', false )
      message.channel.send({embed});
  }
}
