const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const fs = require('fs');
const mongo = require('./mongo.js');
const request = require('request');


//Get tokens
require('dotenv').config();
var token = process.env.TOKEN; 

//We can call the file with the functions here.
const func = require('./functions.js'); //If this returns an error for you try '../functions.js'
const perspective = require('./perspective.js');
const { Mongoose } = require('mongoose');
const welcome = require('./commands/admin/welcome')

// Bot Settings - Global settings this file can use.
const prefix = '!';

//We can call the JSON file whereconst Commnand
const commands = JSON.parse(fs.readFileSync('Storage/commands.json','utf8'));

//This is for holding all the command folders that hold several commands within them
const commandFolders = fs.readdirSync('./commands');

/**
 * Analyzes a user's message for attribues
 * and reacts to it.
 * @param {string} message - message the user sent
 * @return {bool} shouldKick - whether or not we should
 * kick the users
 */
async function evaluateMessage(message) {
  let scores;
  try {
    scores = await perspective.analyzeText(message.content);
  } catch (err) {
    console.log(err);
    return false;
  }

  const userid = message.author.id;

  print("HERE")

  for (const attribute in emojiMap) {
    if (scores[attribute]) {
      message.react(emojiMap[attribute]);
      users[userid][attribute] =
                users[userid][attribute] ?
                users[userid][attribute] + 1 : 1;
    }
  }
  // Return whether or not we should kick the user
  //return (users[userid]['TOXICITY'] > process.env.KICK_THRESHOLD);
  return("done");
}

// Set your emoji "awards" here DEAD
const emojiMap = {
  'FLIRTATION': '💋',
  'TOXICITY': '🧨',
  'INSULT': '👊',
  'INCOHERENT': '🤪',
  'SPAM': '🐟',
};

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
  let cont = message.content.slice(prefix.length).split(" ");
  let args1 = cont.slice(1);

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
        const command = require(`./commands/${folder}/${file}`);

        //if the command in chat matches the file name run it
        if(cmd2 == file)
        {
          //run the command
          command.run(bot, message, args, func);
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

    bot.user.setPresence({
      status: "online",
      game: {
          name: "use !help",
          type: "WATCHING"
          }
      })
      //.then(console.log)
      .catch(console.error);

})

//TOKEN GOES HERE
{
bot.login(token);
}
