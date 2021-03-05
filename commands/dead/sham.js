const Discord = require('discord.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs');
const fetch = require("node-fetch");


exports.run = (bot, message, args, func) => {

  if(args[0] == undefined)
  {
    message.channel.send(`I need a currency to check. usage: !shambles [currency]`);
    return;
  }

  const Http = new XMLHttpRequest();
  //const url='https://rest.coinapi.io/v1/exchangerate/BTC/USD?apikey=';

  const prefix = 'https://rest.coinapi.io/v1/exchangerate/';
  const crypto = args[0];
  const sufex = '/USD?apikey=';


  
  console.log(crypto);

  var watchlist = ["BTC", "ETC", "BCH", "LTC", "ETC", "BAND", "CVC", "SNX", "DNT"];

  //Check to make sure the currency exists first before making the get request. 
  for(i in watchlist)
  {
    if(crypto == watchlist[i])
    {
      break;
    }
    else if(i == 9)
    {
      message.channel.send(`That crypto is currently not on the watchlist sorry.`);
      return;
    }
  }

  //Create url for get request
  var url = prefix + crypto + sufex; 

  fetch(url)
  .then(data=>{return data.json()})
  .then(res=>{

                const embed = new Discord.MessageEmbed()
                  .setAuthor(`Crypto Currency Report`)
                  .setDescription(`${res.asset_id_base}`)
                  .setThumbnail('https://play-lh.googleusercontent.com/dt49Bn5iCPBlSwsjxQJIZ2y92v-MWNNa1a1L4AOYIiUs-sOQW5vyFw9c64DbfZOrzw')
                  .setColor('#4169e1')
                  .addField('Rate',`$${res.rate.toFixed(4)}`, true)
                  .addField('Quote',`${res.asset_id_quote}`, true)
                  .setTimestamp()

                message.channel.send({embed});  
  })
}

