const Discord = require('discord.js');
//const Pagination = require('discord-paginationembed');

//Get tokens
require('dotenv').config();

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
  name: "shambles",
  alias: ["crypto"],
  description: 'look at the market for select cryptos',
  run: async (client, message, args) => { 

    //if user does not specific what they need then yell at them
    if(args[0] == undefined)
    {
        message.channel.send(`I need a currency to check. usage: !shambles [currency]`);
        return;
    }

    //Pull the crypto the user is asking for 
    const crypto = args[0];
    var apiKey = process.env.APIKEY; 
    

    //Array to make sure the crypto is correct before making the request
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

    //First request for the crypto info 
    const rp = require('request-promise');
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest',
      qs: {

        'convert': 'USD',
        'symbol': crypto
      },
      headers: {
        'X-CMC_PRO_API_KEY': apiKey
      },
      json: true,
      gzip: true
    };
    
    //Request for crypto info
    rp(requestOptions).then(response => {

        //Convert json response to string
        var text = JSON.stringify(response.data);

        //Cut off crypto name at beginning of array
        if(crypto.length == 3)
        {
            var removeFront = text.substring(7);
            var endtail = removeFront.length-1;
            var removeBack = removeFront.substring(0,endtail);
        }
        else if(crypto.length == 4)
        {
            var removeFront = text.substring(8);
            var endtail = removeFront.length-1;
            var removeBack = removeFront.substring(0,endtail);
        }

        //Convert back to JSON
        var resultJSON = JSON.parse(removeBack);
        var embeds = [];
        embeds.push(new Discord.MessageEmbed().addField(`Change (1 Hour)`, `${resultJSON[0].quote.USD.percent_change_1h}%`));
        embeds.push(new Discord.MessageEmbed().addField(`Change (24 Hours)`, `${resultJSON[0].quote.USD.percent_change_24h}%`));
        embeds.push(new Discord.MessageEmbed().addField(`Change (7 Days)`, `${resultJSON[0].quote.USD.percent_change_7d}%`));
        embeds.push(new Discord.MessageEmbed().addField(`Change (30 Days)`, `${resultJSON[0].quote.USD.percent_change_30d}%`));

        //Store Values into array
        //Name, Symbol, Pricem Currency, Percent, Dominance
        var cryptoInfo = [    resultJSON[0].name, 
                          resultJSON[0].symbol, 
                          resultJSON[0].quote.USD.price.toFixed(4), 
                          resultJSON[0].quote.USD.percent_change_24h.toFixed(4), 
                          1,
                          resultJSON[0].quote.USD.market_cap,
                         resultJSON[0].max_supply];
        
        cryptoInfo[2] = numberWithCommas(cryptoInfo[2]);
        if(cryptoInfo[5] != null)
        {
        cryptoInfo[5] = numberWithCommas(cryptoInfo[5]);
        }
        if(cryptoInfo[6] != null)
        {
        cryptoInfo[6] = numberWithCommas(cryptoInfo[6]);
        }

       //First request for the crypto dominance
        const requestOptions1 = {
          method: 'GET',
          uri: 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest',
          qs: {
    
          },
          headers: {
            'X-CMC_PRO_API_KEY': apiKey
          },
          json: true,
          gzip: true
      };
      
      //Request for crypto dominance
      rp(requestOptions1).then(response => {
  
         cryptoInfo[4] = ((resultJSON[0].quote.USD.market_cap/response.data.quote.USD.total_market_cap)*100).toFixed(4);

         //First request for the crypto image
      const requestOptions2 = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info',
        qs: {
         'symbol': crypto
        },
        headers: {
          'X-CMC_PRO_API_KEY': apiKey
        },
        json: true,
        gzip: true
      };
      
      //Request for crypto image and build embed
      rp(requestOptions2).then(response => {
         
         //Convert json response to string
         text = JSON.stringify(response.data);

         //Cut off crypto name at beginning of array
         if(crypto.length == 3)
         {
             removeFront = text.substring(7);
             endtail = removeFront.length-1;
             removeBack = removeFront.substring(0,endtail);
         }
         else if(crypto.length == 4)
         {
             removeFront = text.substring(8);
             endtail = removeFront.length-1;
             removeBack = removeFront.substring(0,endtail);
         }
 
         //Convert back to JSON
         var resultJSON = JSON.parse(removeBack);
         //console.log(resultJSON);
         //console.log(resultJSON.logo);
         //console.log(resultJSON.urls.website[0]);

         /*
        new Pagination.Embeds()
        .setArray(embeds)
        .setChannel(message.channel)
        .setAuthorizedUsers([message.author.id])
        .setPageIndicator(true)
        .setPage(1)
        .setTitle(`${cryptoInfo[0]} Currency Report`)
        .setDescription(`${cryptoInfo[1]} `)
        .setThumbnail(`${resultJSON.logo}`)
        .setURL(`${resultJSON.urls.website[0]}`)
        .setColor('#4169e1')
        .addField('Price',`$${cryptoInfo[2]}`)
        .addField('Dominance ', `${cryptoInfo[4]}%`)
        .addField('Market Cap ', `$${cryptoInfo[5]}`)
        .addField('Max Supply ', `${cryptoInfo[6]}`)
        .setTimestamp()
        .build();
        */

      }).catch((err) => {
  
        console.log('API call error:', err.message);
  
      });

  }).catch((err) => {

    console.log('API call error:', err.message);

  });
  
      }).catch((err) => {
  
        console.log('API call error:', err.message);
  
      });
    }
}

