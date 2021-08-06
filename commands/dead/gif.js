const Discord = require('discord.js');
const request = require('request');

exports.run = (bot, message, args, func) => {
	  var term = args[0];
	  console.log(term);

      if(term == undefined)
      {
        message.channel.send(`I need something to search please. Usage !gif <subject>`);
	  }
	  else if(term == "<@!423837609081700352>")
	  {
		message.channel.send(`https://tenor.com/view/hold-on-laughing-this-guy-asimp-black-this-nigga-asimp-gif-16283123`);
	  }
	  else if(term == "<@423837609081700352>")
	  {
		message.channel.send(`https://tenor.com/view/hold-on-laughing-this-guy-asimp-black-this-nigga-asimp-gif-16283123`);
	  }
	  else
	  {
      // strip off 'gif' from the message and that'll be the search term
		//var term = message.substring(3);
		term = encodeURI(term)

		// make a request to giphy with the search term
		// we can also set the raiting
		request('http://api.giphy.com/v1/gifs/search?q=' + term + '&rating=r&api_key=dc6zaTOxFJmzC', function (error, response, body) {
		  if (!error && response.statusCode == 200) {

		  	content =  JSON.parse(body)

		  	// giphy returns several results so we can grab a random result by generating a random index
		  	// random number between 0 and 10
		  	item = Math.floor(Math.random() * 10)

        /*
        // reply to the channel by sending a message (image url)
		    bot.sendMessage({
	            to: channelID,
	            message: content.data[item].images.fixed_height.url
	        });
          */


            message.channel.send(content.data[item].images.fixed_height.url);
		  }
		})
}
}
