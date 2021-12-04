const { Interaction } = require('chart.js');
const cron = require('cron')
const Discord= require('discord.js')
const fetch = require("node-fetch");
const { MessageButton, MessageActionRow } = require("discord.js");
var Cataas = require('cataas-api')
var cataas = new Cataas()

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    name: "schedule",
    alias: [""],
    run: async (client, message, args) => { 

        const channel = client.channels.cache.get('890807425865777175');

        let scheduledMessage =  new cron.CronJob('00 00 09 * * *', async () => {
            // This runs every day at 10:30:00, you can do anything you want
        
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel('bread pun')
                    .setStyle('SECONDARY')
                    .setCustomId('bread'),
                new MessageButton()
                    .setLabel('cat pic')
                    .setStyle('SECONDARY')
                    .setCustomId('cat')
            );
            
            let response = await cataas.getCats(['cute'], {Limit: 85});
    
            let image = 'https://cataas.com/cat/' + response[getRandomInt(85)].id

            const title = 'I love you very much!'
            const fieldTitle = 'Here are your daily reminders.'
            const itemOne = `1. Please remember to take your medicine.`
            const itemTwo = `2. Please call the therapist.`

            let embed = new Discord.MessageEmbed()
                .setTitle(title)
                .addFields(
                            {name: fieldTitle, value:`${itemOne} \n ${itemTwo}`, inline: false},
                        )
                .setColor("RANDOM")
                .setThumbnail(image);
    
            channel.send({content: " ", components: [row], embeds: [embed]})
    
            const filter = i => i.customId === 'bread' || i.customId === 'cat';
    
            const collector = channel.createMessageComponentCollector({ filter, time: 300000});
            
            collector.on('collect', async i => {
                if (i.customId === 'bread') {
    
                    let response = await fetch('https://my-bao-server.herokuapp.com/api/breadpuns');
    
                    let data = await response.text();
    
                    let embed = new Discord.MessageEmbed()
                        .setTitle("I still love you very much!")
                        .setDescription(`Please remember to take your medicine.`)
                        .setColor("RANDOM")
                        .setFooter(data, '')
                        .setThumbnail("https://78.media.tumblr.com/tumblr_m1082bORxM1r04n3so1_500.gif");
    
                    await i.update({ content: ' ', embeds: [embed]});
                }
                if (i.customId === 'cat') {
    
            
                    let response = await cataas.getCats(['cute'], {Limit: 85});
    
                    let image = 'https://cataas.com/cat/' + response[getRandomInt(85)].id
    
                    let embed = new Discord.MessageEmbed()
                        .setTitle("I still love you very much!")
                        .setDescription(`Please remember to take your medicine.`)
                        .setColor("RANDOM")
                        .setThumbnail(image);
    
                    await i.update({ content: ' ', embeds: [embed]});
                }
            });
            
            collector.on('end', collected => console.log(`Collected ${collected.size} items`));

          });
          
          // When you want to start it, use:
          scheduledMessage.start()
          // You could also make a command to pause and resume the job

          console.log("Your daily reminder has been set!")
    }
}

  