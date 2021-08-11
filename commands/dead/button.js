const Discord = require('discord.js');
const disbut = require("discord-buttons");


module.exports.run = async (bot, message, args) => {

    let embed = new Discord.MessageEmbed()
        .setTitle("TestRun")
        .setDescription("example");

    let hit = new disbut.MessageButton()
        .setLabel("Hit")
        .setID("hit")
        .setStyle("blurple");

    let stand = new disbut.MessageButton()
        .setLabel("Stand")
        .setID("stand")
        .setStyle("blurple");
    
    let double = new disbut.MessageButton()
        .setLabel("Double Down")
        .setID("double")
        .setStyle("blurple");

    message.channel.send(embed);
  
    message.channel.send("hello", {
        buttons: [hit, stand, double],
        embed: embed
    });

    bot.on("clickButton", async(button) =>{
        if(button.id == "hit")
        {
            button.channel.send("you hit")
        }
        else if(button.id == "stand")
        {
        console.log("you stood")
        }
        else if(button.id == "double")
        {
        console.log("you doubled down")
        }
        button.defer();
    });
}

