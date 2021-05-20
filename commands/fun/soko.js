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

//Remove New Line Character From Array
function removeItemAll(arr, value) {
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

//Move the player give the map, their position, and direction they are going
function movePlayer(mapObj, position, direction, player, max, root)
 {
    mapObj = removeItemAll(mapObj, '\n')
    console.log(mapObj)

    let newPosition = position + direction
    console.log("__________________________________")
    console.log("")
    console.log("__________________________________")
    mapObj[newPosition] = player
    mapObj[position] = '🟫'

    console.log(mapObj)

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


 //TO.DO add reactions, update embed with new positions

exports.run = async (bot, message, args) => {

    //Create mapObj To On
    var mapObj = [ 
                '🟫','🟫','🟫','🟫', '🟫',
                '🟫','🟫','🟫','🟫', '🟫',
                '🟫','🟫','🟫','🟫', '🟫',
                '🟫','🟫','🟫','🟫', '🟫',
                '🟫','🟫','🟫','🟫', '🟫',
              ]
    
    //var mapObj = [ 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

    //Get Size Of Board
    const max = mapObj.length
    const root = Math.sqrt(max)
    

    //Set Emoji Char
    const player = '✔️'
    const target = '❌'
    const box = '🟧'

    //Make Random Positons For mapObj 
    var playerPosition = getRandomInt(max)
    var targetPosition = getRandomInt(max)
    

    //Make sure box doesnt spawn in a corner
    
    //Get corners of mapObj
    const cornerTopRight = root - 1
    const cornerBottomLeft = max - root
    const cornerBottomRight = max - 1
    

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

    //Generate new array without sides and get random number from that array
    const mapObjBoxSelection = generateRandom(1, absentArray, max)

    //Set position for the box
    var boxPosition = mapObjBoxSelection


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

    console.log(mapObj.length)
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

            //Ship the mapObj and characters
            let embed = new Discord.MessageEmbed()
                .setTitle('Sokoban')
                .setColor('#FF0000')
                .setDescription(mapString)

            //Send the message in chat with the ability to react to the embed
            //Add reactions to the embed
            message.channel.send({embed: embed}).then(embedMessage => {
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
                        let dir = -1
                        let embed = new Discord.MessageEmbed() 
                            .setTitle('Sokoban')
                            .setColor('#FF0000')
                            .setDescription(movePlayer(mapObj, playerPosition, dir, player, max, root))

                        embedMessage.edit(embed)
                    } 
                    //Move Player Up
                    else if (reaction.emoji.name === '🔼') {
                        let dir = root * -1
                        let embed = new Discord.MessageEmbed() 
                            .setTitle('Sokoban')
                            .setColor('#FF0000')
                            .setDescription(movePlayer(mapObj, playerPosition, dir, player, max, root))

                        embedMessage.edit(embed)
                    }
                    //Move Player Down
                    else if (reaction.emoji.name === '🔽') {
                        let dir = root
                        let embed = new Discord.MessageEmbed() 
                            .setTitle('Sokoban')
                            .setColor('#FF0000')
                            .setDescription(movePlayer(mapObj, playerPosition, dir, player, max, root))

                        embedMessage.edit(embed)
                    }
                    //Move Player Right
                    else if (reaction.emoji.name === '▶️') {
                        let dir = 1
                        let embed = new Discord.MessageEmbed() 
                            .setTitle('Sokoban')
                            .setColor('#FF0000')
                            .setDescription(movePlayer(mapObj, playerPosition, dir, player, max, root))

                        embedMessage.edit(embed)   
                    }
                    
                })
                .catch(collected => {
                    message.reply('you didn\'t use a move!');
                });
            });
        
    
    
}
