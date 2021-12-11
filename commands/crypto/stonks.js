const Discord = require('discord.js');
const request = require('request');

//Get tokens
require('dotenv').config();


module.exports = {
  name: "stonks",
  alias: ["stocks"],
  description: 'check the stock market',
  run: async (client, message, args) => { 

  //if user does not specific what they need then yell at them
  if(args[0] == undefined)
  {
      message.channel.send(`I need a currency to check. usage: !stonks [stock]`);
      return;
  }

  //Key for API
  var apiKey = process.env.STONKSKEY; 

  //This url gets the price of the stock from the URL
  var url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + args[0] + "&apikey=" + apiKey;

  //Get request is for getting the stock symbol, price, and change percent
  request(url, {json: true}, (err, res, body) => {

    //If the request is bad return the error
    if(err) {return console.log(err); }

    //Array to hold the values of the stock
    var stockInfo = [ 
                      body["Global Quote"]['01. symbol'],
                      body["Global Quote"]['05. price'],   
                      body["Global Quote"]['10. change percent'],
                      3,
                      4                    
                    ]

                    //New URL for getting stock OVERVIEW or the name, assettype
                    var url = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + args[0] + "&apikey=" + apiKey;

                    //Get request for the new information
                    request(url, {json: true}, (err, res, body) => {
                      if(err) {return console.log(err); }
                  
                      //Get stock name and asset type
                      stockInfo[3] = body["Name"];
                      stockInfo[4] = body["AssetType"];

                      //Create embed and ship it out
                      const embed = new Discord.MessageEmbed()
                        .setTitle(`${stockInfo[0]} ${stockInfo[4]}`)
                        .setDescription(`${stockInfo[3]}`)
                        .setColor('#4169e1')
                        .setThumbnail('https://i.kym-cdn.com/photos/images/newsfeed/001/499/826/2f0.png')
                        .addField('Price',`$${stockInfo[1]}`)
                        .addField('Change',`${stockInfo[2]}`)
                        .setTimestamp()

                        message.channel.send({embeds: [embed]});
                  
                    });
  });
}
}
  