const Discord = require('discord.js');
const request = require('request');

module.exports = {
  name: "joke",
  alias: ["jokes"],
  description: 'replies with a dad joke',
  run: async (client, message, args) => { 

    request('https://icanhazdadjoke.com/', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        
            let embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setDescription(res.body.joke)
                .setTimestamp();

            message.channel.send({embeds: [embed]})

        });

  }
}
