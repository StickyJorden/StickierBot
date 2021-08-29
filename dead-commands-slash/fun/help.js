const Discord = require('discord.js');
const Pagination = require('discord-paginationembed');
const fs = require('fs');



//We can call the JSON file whereconst Commnand
const commands = JSON.parse(fs.readFileSync('storage/commands.json','utf8'));

module.exports = {
	name: 'help', 
    description: 'learn more about what I can do',
	async execute(client, interaction, args) {
		//Variables
 let msg = message.content.toUpperCase(); //Variable takes message and turns it into upper case.
 var prefix = "!";

  //Check if they asked for basic help command or another group like admin or user. 
  if(msg === `${prefix}HELP`)
  {
        //Setup array to hold commands
        const embeds = [];

        //Variables
        let commandsFound = 0;
        const embed = new Discord.MessageEmbed()
          .setColor(0x9679ed)

        //loop to go through commands
        for(var cmd in commands)
        {
                        //checkes if the group is "users"
                        if(commands[cmd].group.toUpperCase() === 'USER')
                        {
                          //count for commands found
                           commandsFound++
                           embeds.push(new Discord.MessageEmbed().addField(`${commands[cmd].name}`,`**Description: ** ${commands[cmd].desc}\n**Usage:** ${prefix + commands[cmd].usage}`,commands[cmd], false));
                           //Adding more to the embeds
                          
                        }
        }

       //Setup pagination
       const myImage = bot.user.displayAvatarURL();

       new Pagination.Embeds()
          .setArray(embeds)
          .setChannel(message.author)
          .setAuthorizedUsers([message.author.id])
          .setColor(0x9679ed)
          .setPageIndicator(true)
          .setPage(1)
          .setThumbnail(myImage)
          .setFooter(`Currently showing user commands. To view another group do ${prefix}help [group / command]`)
          .setTitle("Help")
          .setDescription(`${commandsFound} commands found - <> means required, [] means optional`)
          .setTimestamp()
          .build();

        //Notify user to check their DM's
        message.channel.send({embed: {
            color: 0x9679ed,
            description: `**Check you DMs ${message.author}!**`
        }})
  }
  //If user wanted to see possible groups of commands to check from such as admin or user
  else if(args.join(" ").toUpperCase() === 'GROUPS') {
    //handling ?help [cmd / group]

    //Variables
    let groups = '';

    //loop through the commands in the group
    for(var cmd in commands)
    {
              if(!groups.includes(commands[cmd].group))
              {
                groups += `${commands[cmd].group}\n`
              }
    }

    //Notify user of groups
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
	},
};

exports.run = (bot, message, args) => {
 //Variables
 let msg = message.content.toUpperCase(); //Variable takes message and turns it into upper case.
 var prefix = "!";

  //Check if they asked for basic help command or another group like admin or user. 
  if(msg === `${prefix}HELP`)
  {
        //Setup array to hold commands
        const embeds = [];

        //Variables
        let commandsFound = 0;
        const embed = new Discord.MessageEmbed()
          .setColor(0x9679ed)

        //loop to go through commands
        for(var cmd in commands)
        {
                        //checkes if the group is "users"
                        if(commands[cmd].group.toUpperCase() === 'USER')
                        {
                          //count for commands found
                           commandsFound++
                           embeds.push(new Discord.MessageEmbed().addField(`${commands[cmd].name}`,`**Description: ** ${commands[cmd].desc}\n**Usage:** ${prefix + commands[cmd].usage}`,commands[cmd], false));
                           //Adding more to the embeds
                          
                        }
        }

       //Setup pagination
       const myImage = bot.user.displayAvatarURL();

       new Pagination.Embeds()
          .setArray(embeds)
          .setChannel(message.author)
          .setAuthorizedUsers([message.author.id])
          .setColor(0x9679ed)
          .setPageIndicator(true)
          .setPage(1)
          .setThumbnail(myImage)
          .setFooter(`Currently showing user commands. To view another group do ${prefix}help [group / command]`)
          .setTitle("Help")
          .setDescription(`${commandsFound} commands found - <> means required, [] means optional`)
          .setTimestamp()
          .build();

        //Notify user to check their DM's
        message.channel.send({embed: {
            color: 0x9679ed,
            description: `**Check you DMs ${message.author}!**`
        }})
  }
  //If user wanted to see possible groups of commands to check from such as admin or user
  else if(args.join(" ").toUpperCase() === 'GROUPS') {
    //handling ?help [cmd / group]

    //Variables
    let groups = '';

    //loop through the commands in the group
    for(var cmd in commands)
    {
              if(!groups.includes(commands[cmd].group))
              {
                groups += `${commands[cmd].group}\n`
              }
    }

    //Notify user of groups
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
