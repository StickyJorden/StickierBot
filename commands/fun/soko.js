const Discord = require('discord.js');
const createBar = require('string-progressbar');

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

//Function to generate array excluding some elements
const generateRandom = (len, absentArray, max) => {
    const randomArray = [];
    for(let i = 0; i < len; ){
       const random = Math.floor(Math.random() * max);
    if(!absentArray.includes(random) &&
       !randomArray.includes(random)){
          randomArray.push(random);
          i++;
       }
    };
    return randomArray;
 }

 //TO.DO add reactions, update embed with new positions

exports.run = (bot, message, args) => {

    //Create Map To On
    
    var map = [ '🟫','🟫','🟫','🟫',
                '🟫','🟫','🟫','🟫',
                '🟫','🟫','🟫','🟫',
                '🟫','🟫','🟫','🟫']
    
    //var map = [ 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]


    //Get Size Of Board
    const max = map.length
    

    //Set Emoji Char
    var player = '😎'
    var target = '❌'
    var box = '🟧'

    //Make Random Positons For Map 
    var playerPosition = getRandomInt(max)
    var targetPosition = getRandomInt(max)

    //Make sure box doesnt spawn in a corner
    
    //Get corners of map
    const cornerTopRight = Math.sqrt(max) - 1
    const cornerBottomLeft = max - Math.sqrt(max)
    const cornerBottomRight = max - 1

    //Exclude Corners From Array
    const absentArray = [0, cornerTopRight, cornerBottomLeft, cornerBottomRight] 

    //Generate new array without corners and get random number from that array
    const mapBoxSelection = generateRandom(1, absentArray, max)

    //Set position for the box
    var boxPosition = mapBoxSelection


    //Make sure each of the selected moves are of a different type
    while(playerPosition == targetPosition || targetPosition == boxPosition || boxPosition == playerPosition)
    {
        if(playerPosition == targetPosition)
        {
            targetPosition = getRandomInt(max);
        }
        if(targetPosition == boxPosition)
        {
            targetPosition = getRandomInt(max);
        }
        if(boxPosition == playerPosition)
        {
            playerPosition = getRandomInt(max);
        }

    }

    //Add Character To The Map
    map[playerPosition] = player
    map[targetPosition] = target
    map[boxPosition] = box

    //Build the box shape from the array
    let x = 0
    let counter = 0
    while(x < max)
    {
        if(counter <= 3)
        {
            counter++
        }
        else
        {
            
            map.splice(x, 0, '\n')
            counter = 0
        }
        x++
    }

    //Make to string to remove commas
    map = map.toString()

    //Remove commas x is -1 to get the very last element 
    x = -1
    while(x <= max)
    {
        map = map.replace(",","");
        x++
    }

    //Ship the map and characters
    let embed = new Discord.MessageEmbed()
      .setTitle('Sokoban')
      .setColor('#FF0000')
      .setDescription(map)

    message.channel.send(embed);
}
