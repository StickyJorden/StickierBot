const Discord = require('discord.js');
const { TooManyRequests } = require('http-errors');
const { result } = require('lodash');
const createBar = require('string-progressbar');


//Set Emoji Char
const player = '✔️'
const target = '❌'
const box = '🟧'
const wall = '🟫'
const win = '🟩'

//Create mapObj To On
var mapObj = [ 
    '🟫','🟫','🟫','🟫', '🟫',
    '🟫','🟫','🟫','🟫', '🟫',
    '🟫','🟫','🟫','🟫', '🟫',
    '🟫','🟫','🟫','🟫', '🟫',
    '🟫','🟫','🟫','🟫', '🟫',
  ]

//Get Size Of Board
const max = mapObj.length
const root = Math.sqrt(max)


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

//Remove New Line Character From Array
function removeItemAll(arr, value) 
{
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
}

//Find all the tiles surrounding the mapObj
function buildPerimeter()
{
    //Exclude Sidse From Array
    let absentArray = [] 

    //Find all the tiles surrounding the mapObj
    let pop = 0
    let nest = 1
    while(pop <= root)
    {
        if(pop == 0)
        {
            while(pop < (root-1))
            {
                absentArray.push(pop)
                pop++
            }
            pop = 0
        }
        if(pop > 0 && pop < (root - 1))
        {
            while(nest < root)
            {
    
                absentArray.push((root * nest) - 1)
                absentArray.push((root * nest))
            
                nest++
            }
        }
        if(pop == root)
        {
            nest = (max - root) + 1
            while(nest <= max)
            {
                absentArray.push(nest)
                nest++
            }
        }
        pop++
    }
    return absentArray
}

//Make the new line and comma removed veriso of the map
function makeEmbedMap()
{
    //Make a string copy of the map
    let mapString = mapObj

    //Build the box shape from the array
    let x = 0
    let counter = 0
    while(x < max)
    {
        if(counter <= (root - 1))
        {
            counter++
        }
        else
        {
            
            mapString.splice(x, 0, '\n')
            counter = 0
        }
        x++
    }


    //Make to string to remove commas
    mapString = mapString.toString()

    //Remove commas x is -1 to get the very last element LOOK INTO THIS
    x = -2
    while(x <= max)
    {
        mapString = mapString.replace(",","");
        ++x
    }

    return mapString
}

//Move the player give the map, their playerPosition, and direction they are going
function movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition)
 {
    //Remove new lines to get correct values for mapping
    mapObj = removeItemAll(mapObj, '\n')

    //Convert to a number instead of obj
    boxPosition = Number(boxPosition)
    targetPosition = Number(targetPosition)
    
    //Find new player position
    let newPlayerPosition = playerPosition + direction
    let newBoxPosition = boxPosition
    
    //If player position is equal to box position update box position
    if(newPlayerPosition == boxPosition)
    {
        newBoxPosition = direction + boxPosition
        mapObj[newBoxPosition] = box
        mapObj[newPlayerPosition] = player
        mapObj[playerPosition] = wall

        //Check to see if they won! 
        if(newBoxPosition == targetPosition)
        {
            //return you win
            mapObj[newBoxPosition] = win
        }
    }
    //If player is on target dont let them
    else if(newPlayerPosition == targetPosition)
    {
        mapObj[playerPosition] = player
        newPlayerPosition = playerPosition - direction 
    }
    //Else player is moving normally across the board
    else
    {
        mapObj[newPlayerPosition] = player
        mapObj[playerPosition] = wall
    }

    let mapString = mapObj

    //Build the box shape from the array
    let x = 0
    let counter = 0
    while(x < max)
    {
        if(counter <= (root - 1))
        {
            counter++
        }
        else
        {
            
            mapString.splice(x, 0, '\n')
            counter = 0
        }
        x++
    }


    //Make to string to remove commas
    mapString = mapString.toString()

    //Remove commas x is -1 to get the very last element LOOK INTO THIS
    x = -2
    while(x <= max)
    {
        mapString = mapString.replace(",","");
        ++x
    }

    var results = {map: mapString, playerPos: newPlayerPosition, boxPos: newBoxPosition};
    return results
}

 function makeNextMessage(message, embedMessage, mapObj, mapString, playerPosition, boxPosition, targetPosition)
 {
    //Send the message in chat with the ability to react to the embed
    //Add reactions to the embed

    var results;

    embedMessage.react('◀️')
        .then(() => embedMessage.react('🔼'))
        .then(() => embedMessage.react('🔽'))
        .then(() => embedMessage.react('▶️'))
        .catch(() => console.error('One of the emojis failed to react.'));

    //Filter which embeds I care for
    const filter = (reaction, user) => {
        return ['◀️', '🔼','🔽','▶️'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    //Wait for the user to react
    embedMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();

            //Read in which reaction was selected
            //Move Player Left
            if (reaction.emoji.name === '◀️') {
                let direction = -1

                results = movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition)

                let embed = new Discord.MessageEmbed() 
                    .setTitle('Sokoban')
                    .setColor('#FF0000')
                    .setDescription(results.map)

                embedMessage.edit(embed)

                embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                
                makeNextMessage(message, embedMessage, mapObj, mapString, results.playerPos, results.boxPos, targetPosition)
            } 
            //Move Player Up
            else if (reaction.emoji.name === '🔼') {
                let direction = root * -1

                results = movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition)

                let embed = new Discord.MessageEmbed() 
                    .setTitle('Sokoban')
                    .setColor('#FF0000')
                    .setDescription(results.map)

                embedMessage.edit(embed)

                embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                
                makeNextMessage(message, embedMessage, mapObj, mapString, results.playerPos, results.boxPos, targetPosition)


            }
            //Move Player Down
            else if (reaction.emoji.name === '🔽') {
                let direction = root

                results = movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition)

                let embed = new Discord.MessageEmbed() 
                    .setTitle('Sokoban')
                    .setColor('#FF0000')
                    .setDescription(results.map)

                embedMessage.edit(embed)

                embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                
                makeNextMessage(message, embedMessage, mapObj, mapString, results.playerPos, results.boxPos, targetPosition)
            }
            //Move Player Right
            else if (reaction.emoji.name === '▶️') {
                let direction = 1

                results = movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition)

                let embed = new Discord.MessageEmbed() 
                    .setTitle('Sokoban')
                    .setColor('#FF0000')
                    .setDescription(results.map)

                embedMessage.edit(embed)

                embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                
                makeNextMessage(message, embedMessage, mapObj, mapString, results.playerPos, results.boxPos, targetPosition)
            }
        })
    
        .catch(collected => {
            message.reply('you didn\'t use a move!');
        });
}

exports.run = async (bot, message, args) => {

    //Make Random Positons For mapObj 
    var playerPosition = getRandomInt(max)
    var targetPosition = getRandomInt(max)

    //Generate new array without sides and get random number from that array
    var boxPosition = generateRandom(1, buildPerimeter(), max)

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

    //Add Character To The mapObj
    mapObj[playerPosition] = player
    mapObj[targetPosition] = target
    mapObj[boxPosition] = box

    let mapString = makeEmbedMap()

    //Ship the mapObj and characters
    let embed = new Discord.MessageEmbed()
        .setTitle('Sokoban')
        .setColor('#FF0000')
        .setDescription(mapString)

     //Send the message in chat with the ability to react to the embed
    //Add reactions to the embed
    message.channel.send({embed: embed}).then(embedMessage => {

        makeNextMessage(message, embedMessage, mapObj, mapString, playerPosition, boxPosition, targetPosition)
    
    });
    
}
