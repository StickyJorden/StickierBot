const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
//const db = require('quick.db');
const request = require('request');

//We can call the file with the functions here.
const func = require('./functions.js'); //If this returns an error for you try '../functions.js'

// Bot Settings - Global settings this file can use.
const prefix = '!';

//We can call the JSON file whereconst Commnand
const commands = JSON.parse(fs.readFileSync('Storage/commands.json','utf8'));

//Listner Event: Runs whenever a message is received.
bot.on('message', message => {

  //Variables
  let msg = message.content.toUpperCase(); //Variable takes message and turns it into upper case.
  let sender = message.author; //Takes message and finds out who author is.
  //let channelID = client.channels.get("the channel id");
  let args = message.content.slice(prefix.length).trim().split(" "); //This variable slices off the prefix, then puts the rest into an array by spaces
  let cmd1 = args.shift().toLowerCase(); //This takes away the first object in the cont array, then puts it in this

  //Global Variables
  let cont = message.content.slice(prefix.length).split(" ");
  let args1 = cont.slice(1);

/*
  //Message Leveling System -require db
  db.set(message.author.id + message.guild.id, 1).then(i => { //Pass key which is authorID + guildID, then pass it an increase by 1
    //Also returns the new updated object that we will use

    let messages; //empty Variable - These If statements will run if the new amount of messages sent is the smae as the user

    if(i.value == 25) messages = 25; //Level 1
    else if(i.value == 50) messages = 50; //Level 2
    else if(i.value == 100) messages = 100; //Level 3

    if(!isNaN(messages)) //is messages empty run this
    {
      db.add(`userLevel_${message.author.id + message.guild.id}`,1).then(o => {
            message.channel.send(`You sent ${messages} messages, so you have leveled up! You are now level ${o.value}`) //Send their updated level tp their channel
      })
    }
  })
*/


  //We also need to make sure it doesnt respond to bots
  if(sender.bot) return;
  if(!message.content.startsWith(prefix)) return; //We also want to make sure that the message does not start with a prefix

  //Command Handler - .trim() removes the blank spaces on both sides of the string
  try{
    let commandFile = require(`./commands/${cmd1}.js`); //This will assign that filename to commandFile
    commandFile.run(bot, message, args, func); // This will try and run that file, added the fucntions from the function.js file int  commandsFile
  }catch(e){ //If an error occurs, this will run
    console.log(e.message); //logs error message
  } finally { //This will run after the first two clear up
    console.log(`${message.author.username} ran the command: ${cmd1}`);

  }

});

//Listner Event: Runs whenever the bot sends a ready event (when it first starts)
bot.on("ready", () => {
    console.log('Stickier Bot: Online');

    bot.user.setPresence({
      status: "online",
      game: {
          name: "use !help",
          type: "WATCHING"
          }
      })
      //.then(console.log)
      .catch(console.error);

});

//TOKEN GOES HERE
{
bot.login('');
}
