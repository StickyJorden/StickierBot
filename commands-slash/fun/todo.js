const Discord = require('discord.js');
const disbut = require("discord-buttons");
const fs = require('fs');
const users = new Set();
const { SlashCommandBuilder } = require('@discordjs/builders');

//We can call the JSON file for punishments
const todoList = JSON.parse(fs.readFileSync('storage/counters.json','utf8'));

//Make the embed message
function makeEmbed(message)
{
    let embed = new Discord.MessageEmbed()
            .setTitle("To-Do List")
            .setColor("RANDOM")
            .addFields(
                {name: "Hug", value: `${todoList.hug}`, inline: true},
                {name: "Bump", value: `${todoList.bump}`, inline: true},
                {name: "Kiss", value: `${todoList.kiss}`, inline: true}
            );
            
        let hug = new disbut.MessageButton()
            .setLabel("Hug")
            .setID("hug")
            .setStyle("blurple");

        let bump = new disbut.MessageButton()
            .setLabel("Bump")
            .setID("bump")
            .setStyle("blurple");
        
        let kiss = new disbut.MessageButton()
            .setLabel("Kiss")
            .setID("kiss")
            .setStyle("blurple");

        let row = new disbut.MessageActionRow()
            .addComponents(hug, bump, kiss);
    
        return {
            content: " ",
            components: row,
            embed: embed
        }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('todo')
		.setDescription('jordans to-do list'),
	async execute(interaction, message, args) {
        if(message.author.id == 338544317427875851)
        {
            //Clear storage
            if(args[0] == "clear")
            {
                todoList.hug = 0
                todoList.bump = 0
                todoList.kiss = 0
                fs.writeFileSync('storage/counters.json', JSON.stringify({"hug":  todoList.hug, "bump": todoList.bump, "kiss": todoList.kiss}));
    
                let embed = new Discord.MessageEmbed()
                    .setTitle("To-Do List")
                    .setColor("RANDOM")
                    .setDescription("The To-Do List has been completed.");
    
                message.channel.send({embeds: [embed]})
    
            }
            else
            {
            //Send Message
            message.channel.send(makeEmbed(message)).then(msg => {
    
                    //Wait until button is pressed
                    bot.on("clickButton", async (button) =>{
    
                        //Update the correct data point
                        if(button.id == "hug")
                        {
                            todoList.hug++
                        }
                        else if(button.id == "bump")
                        {
                            todoList.bump++
                        }
                        else if(button.id == "kiss")
                        {
                            todoList.kiss++
                        }
    
                        fs.writeFileSync('storage/counters.json', JSON.stringify({"hug":  todoList.hug, "bump": todoList.bump, "kiss": todoList.kiss}));
    
                        //Make sure the interaction does not fail
                        await button.defer();
    
                        //Edit message to show updated value
                        msg.edit(makeEmbed(message))
                    });
    
                    let timeoutID;
    
                    // After the queue has ended
                    timeoutID = setTimeout(() => {
                        console.log("END CODE")
                    }, 60 * 1000) 
                    
                    // If the bot is used again
                    clearTimeout(timeoutID)
                    timeoutID = undefined
                })
            }
        }
	},
};
