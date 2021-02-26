const Discord = require('discord.js');
const fs = require('fs');

//We can call the JSON file for quotes
const quotes = JSON.parse(fs.readFileSync('Storage/quotes.json','utf8'));

exports.run = (bot, message, args, func) => {

    //number of quotes in JSON file quotes
    var count = Object.keys(quotes).length; 

    //Variable to hold the selected quote number
    var quoteNum;

    //Function to get quote from JSON file
    function getQuote(number)
    {
        message.channel.send(quotes[number].quote);
    }

    //Function to get random number with the max being the total number of quotes in JSON file
    function getRandomInt(max) 
    {
        return Math.floor(Math.random() * Math.floor(max));
    }

    //Check if user did not enter in a number
    if(args[0] == undefined)
    {
        //take length of JSON file and get random number for quote
        var quoteNum = getRandomInt(count);
        getQuote(quoteNum);
    }
    //Check if user pick a number that was out of range
    else if(args[0] > count || args[0] <= 0)
    {
        //say we havent reached that number pick between 1 and max
        message.channel.send(`When it comes to picking a quote please select between 1 and ${count}`);
    }
    //If selection is in range get the quote asked for
    else if(args[0] <= count && args[0] > 0)
    {
        var minusOne = args[0];
        minusOne--;
        getQuote(minusOne);
    }
    

    
  
  }
  