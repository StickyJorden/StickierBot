const Discord = require('discord.js');
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

//We can call the JSON file for punishments
const punishments = JSON.parse(fs.readFileSync('storage/links.json','utf8'));

//Function to get random number with the max being the total number of punishments in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('punish')
		.setDescription('spin the wheel of punishment'),
	async execute(interaction, message, args) {
    if(!args[0]) return message.reply({content: 'Please select someone to face the wheel of punishment.'});

    //number of quotes in JSON file quotes
    var count = Object.keys(punishments).length; 
  
    //Get randon number for punishment 
    let number = getRandomInt(count)
  
    let victim = args.slice(0).join(' ');
  
    const image = punishments[number].link
  
    let ballembed = new Discord.MessageEmbed()
        .setTitle('Wheel of Punishment')
        .setColor('#FF990')
        .addField('Victim ', victim)
        .addField('Sentence ', punishments[number].name)
        .setImage(`${image}`);
  
    message.channel.send({embed: ballembed});
	},
};