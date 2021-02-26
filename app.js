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
    let commandFile = require(`./commands/${cmd1}.js`); //This will assign that filename ti commandFile
    commandFile.run(bot, message, args, func); // This will try and run that file, added the fucntions from the function.js file int  commandsFile
  }catch(e){ //If an error occurs, this will run
    console.log(e.message); //logs error message
  } finally { //This will run after the first two clear up
    console.log(`${message.author.username} ran the command: ${cmd1}`);

  }

  if(msg.startsWith(prefix + 'HELP'))
  {

    if(msg === `${prefix}HELP`)
    {
          const embed = new Discord.MessageEmbed()
            .setColor(0x9679ed)

          //Variables
          let commandsFound = 0;

          //loop to go through commands
          for(var cmd in commands)
          {
                          //checkes if the group is "users"
                          if(commands[cmd].group.toUpperCase() === 'USER')
                          {
                            //count for commands found
                             commandsFound++
                             embed.addField(`${commands[cmd].name}`,`**Description: ** ${commands[cmd].desc}\n**Usage:** ${prefix + commands[cmd].usage}`);
                          }
          }

          //Adding more to the embeds
          embed.setFooter(`Currently showing user commands. To view another group do ${prefix}help [group / command]`)
          embed.setDescription(`**${commandsFound} commands found** - <> means required, [] means optional`)

          message.author.send({embed})
          message.channel.send({embed: {
              color: 0x9679ed,
              description: `**Check you DMs ${message.author}!**`
          }})
    }
    else if(args.join(" ").toUpperCase() === 'GROUPS') {
      //handling ?help [cmd / group]

      //Variables
      let groups = '';

      for(var cmd in commands)
      {
                if(!groups.includes(commands[cmd].group))
                {
                  groups += `${commands[cmd].group}\n`
                }
      }

      message.channel.send({embed: {
          description: `**${groups}**`,
          title:"Groups",
          color: 0xFFA500

      }})

      return;
    }
    else
    {

      //Variables
      let groupFound = '';

      const embed = new Discord.MessageEmbed()
        .setColor(0x9679ed)



                //handling ?help [cmd / group]
                for(var cmd in commands)
                {
                          if(args.join(" ").trim().toUpperCase() === commands[cmd].group.toUpperCase())
                          {
                            groupFound = commands[cmd].group.toUpperCase();
                            break;
                          }
                }

                if(groupFound != '')
                {
                          let commandsFound = 0;
                          for(var cmd in commands)
                          {
                                          //checkes if the group is "users"
                                          if(commands[cmd].group.toUpperCase() === groupFound)
                                          {
                                            //count for commands found
                                             commandsFound++
                                             embed.addField(`${commands[cmd].name}`,`**Description: ** ${commands[cmd].desc}\n**Usage:** ${prefix + commands[cmd].usage}`);
                                          }
                          }

                          //Adding more to the embeds
                          embed.setFooter(`Currently showing ${groupFound} commands. To view another group do ${prefix}help [group / command]`)
                          embed.setDescription(`**${commandsFound} commands found** - <> means required, [] means optional`)

                          message.author.send({embed})
                          message.channel.send({embed: {
                              color: 0x9679ed,
                              description: `**Check you DMs ${message.author}!**`
                          }})


                          //return so it doesnt run the rest of the script after it finds a group
                          return;
                        }

                          //Variables
                          let commandFound = '';
                          let commandDesc = '';
                          let commandUsage = '';
                          let commandGroup = '';

                          for(var cmd in commands)
                          {

                                    if(args.join(" ").trim().toUpperCase() === commands[cmd].name.toUpperCase())
                                    {
                                      commandFound = commands[cmd].name;
                                      commandDesc = commands[cmd].desc;
                                      commandUsage = commands[cmd].usage;
                                      commandGroup = commands[cmd].group;
                                      break;
                                    }
                          }

                          //if nothing is found
                          if(commandFound === '')
                          {
                            message.channel.send({embed: {
                                description: `**No group or command found titled \`${args.join(" ")}\`**`,
                                color: 0xFFA500,

                            }})
                          }

                          message.channel.send({embed: {
                              title: '<> means required, [] means optional',
                              color: 0xFFA500,
                              fields: [{
                                  name:commandFound,
                                  value:`**Description:** ${commandDesc}\n**Usage:** ${commandUsage}\n**Group** ${commandGroup}`

                              }]
                          }})


                }


  }


});

//Listner Event: Runs whenever the bot sends a ready event (when it first starts)
bot.on('ready', () => {
    console.log('Stickier Bot: Online');

    bot.user.setPresence({
      game: {
         name: "Stayin Sticky! Use !help",
         type:  "Playing",
         url: "https://discordapp.com/"
        },
         status: 'online'
    }
       )
      //.then(console.log)
      .catch(console.error);

});

//TOKEN GOES HERE
{
bot.login('');
}
