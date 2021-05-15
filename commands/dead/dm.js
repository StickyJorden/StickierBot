const Discord = require('discord.js');
const fs = require('fs');

//functions
function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.run = async (bot, message, args) => {

    message.reply("Test").then(msg => {msg.delete({timeout: 1000}); }); 

    /*
    const fetched = await message.channel.messages.fetch({limit: 1}).then((messages) => {
        const botMessages = [];
        messages.filter(m => m.author.id === `654595068170076161`).forEach(msg => botMessages.push(msg))
        message.delete(botMessages).then(() => {
                message.channel.send(`Cleared ${mtd} bot messages!`).then(msg => msg.delete({
                    timeout: 3000
                }))
        });
    })
    */
    //.fetchMessages({limit: 1})
    //message.channel.send(fetched.id)
    //console.log(fetched)
    //message.delete(fetched).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));  

}
