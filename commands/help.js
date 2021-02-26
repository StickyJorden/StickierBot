exports.run = (bot, message, args, func) => {

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
  }
