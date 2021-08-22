const weather = require('weather-js');
const Discord = require('discord.js');

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('give the weather of a location'),
	async execute(interaction, message, args) {
    weather.find({search: args.join(" "), degreeType: 'F'}, function(err, result)
    {
      if(err) message.channel.send(err);
  
      //Variables
      console.log('HERE ' + result[0]);
      if(result[0] == undefined)
      {
            console.log('HERE 2');
            //message.channel.send('usage: weather <location> AND DONT USE THE SUN');
  
            const embed = new Discord.MessageEmbed()
            .setDescription(`**Sunny**`)
            .setAuthor(`Weather for the Sun`)
            .setThumbnail("http://blob.weather.microsoft.com/static/weather4/en-us/law/32.gif")
            .setColor(0x800080)
            .addField('Degree Type','K', true)
            .addField('Temperature',`5,778 Degrees`, true)
            .addField('Feels Like', `5,788 Degress`, true)
            .addField('Radius','432,690 miles', true)
            .addField('Mass', `1.989 × 10^30 kg`, true)
      
            message.channel.send({embeds: [embed]});  
  
      }
      else
      {
      var current = result[0].current;
      var location = result[0].location;
  
      const embed = new Discord.MessageEmbed()
        .setDescription(`**${current.skytext}**`)
        .setAuthor(`Weather for ${current.observationpoint}`)
        .setThumbnail(current.imageUrl)
        .setColor(0x800080)
        .addField('Timezone',`UTC${location.timezone}`, true)
        .addField('Degree Type',location.degreetype, true)
        .addField('Temperature',`${current.temperature} Degrees`, true)
        .addField('Feels Like', `${current.feelslike} Degress`, true)
        .addField('Winds',current.winddisplay, true)
        .addField('Humidity', `${current.humidity}%`, true)
  
        message.channel.send({embeds: [embed]});
      }
    });
	},
};