

require('module-alias/register')

const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const fs = require('fs');

require('discord-buttons')(bot)

//Get tokens
require('dotenv').config();
var token = process.env.TOKEN; 

//Mongo Listeners
const messageCount = require('@listeners/message-counter');
const levels = require('@listeners/levels');
const mongo = require('@storage/mongo')

// Bot Settings - Global settings this file can use.
const prefix = '!';

//This is for holding all the command folders that hold several commands within them
const commandFolders = fs.readdirSync('./commands');

//Distube for playing music
const DisTube = require('distube');

// Create a new DisTube
bot.distube = new DisTube(bot, { searchSongs: true, emitNewSongOnly: true });

bot.distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
    .on("searchResult", (message, result) => {
      let i = 0;
      message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`Searching canceled`))

//Listner Event: Runs whenever a message is received.
bot.on('message', message => {

  //evaluateMessage(message);

  //Variables
  let msg = message.content.toUpperCase(); //Variable takes message and turns it into upper case.
  let sender = message.author; //Takes message and finds out who author is.
  //let channelID = client.channels.get("the channel id");
  let args = message.content.slice(prefix.length).trim().split(" "); //This variable slices off the prefix, then puts the rest into an array by spaces
  let cmd1 = args.shift().toLowerCase(); //This takes away the first object in the cont array, then puts it in this
  let cmd2 = cmd1.concat(".js"); //add js to command reciece for comparison later 

  //Global Variables
  //let cont = message.content.slice(prefix.length).split(" ");
  //let args1 = cont.slice(1);

  //We also need to make sure it doesnt respond to bots
  if(sender.bot) return;

  if(!message.content.startsWith(prefix)) return; //We also want to make sure that the message does not start with a prefix

  //Command Handler
  try{

    //loop to run through all the folders
    for(const folder of commandFolders)
    {
      //Find each file when going through the folder
      const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

        //loop through each file in the folders
        for (const file of commandFiles) 
        {
            //require the folder and file to run the command
            const command = require(`@root/commands/${folder}/${file}`);

            //if the command in chat matches the file name run it
            if(cmd2 == file)
            {
              //run the command
              command.run(bot, message, args);
              break;
            }
        }
    
    }
  }catch(e){ //If an error occurs, this will run
    console.log(e.message); //logs error message
  } finally { //This will run after the first two clear up
    console.log(`${message.author.username} ran the command: ${cmd1}`);

  }

});


//Listner Event: Runs whenever the bot sends a ready event (when it first starts)
bot.on("ready", async () => {
    console.log('Stickier Bot: Online');

    //Uncomment to enable counter the number of messages sent per user
    //messageCount.run(bot);
    await mongo()
    levels.run(bot);
})

//TOKEN GOES HERE
{
bot.login(token);
}
