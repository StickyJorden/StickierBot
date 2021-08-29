const Discord = require('discord.js');
const fs = require('fs');

exports.run = (bot, message, args, func) => {

  if(message.author.id != 338544317427875851)
    {
        return message.channel.send("You aren't sticky enough for that.");
    }

  //functions
  function sleep(ms)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function purge()
  {
    await sleep(1000);
    message.delete(); //Delete the message so it does not affect the following deleted message

    if(isNaN(args[0]))
    {
      message.channel.send('Please use a number as your arguements. \n Usage: ' + prefix + 'purge <amount>');
      return;
    }

    const fetched = await message.channel.fetch({limit: args[0]});
    if(fetched.size > 50)
    {
          message.channel.send('Whoa whoa what are you trying to hide? Do I need to get the Sticky Authorities? (the limit is 50 messages)');
    }
    else
    {
    console.log(fetched.size + ' message found, deleting...');
    await sleep(1000);

    //Deleting messages
    message.channel.delete(fetched).catch(error => message.channel.send(`Error: ${error}`));
    }
  }
  purge();

}
