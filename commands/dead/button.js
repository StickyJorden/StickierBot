const Discord = require('discord.js');
const disbut = require("discord-buttons");
const { Interaction } = require('chart.js');


module.exports = {
    name: "button",
    alias: [],
    run: async (client, message, args) => { 

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

    let row = new disbut.MessageActionRow()
        .addComponents(hit, stand);
  
    message.channel.send({
        content: "hello",
        components: row,
        embed: embed
    });

    client.on("clickButton", async(button) =>{
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
}

