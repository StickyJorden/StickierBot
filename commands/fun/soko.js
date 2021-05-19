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

function movePlayer(map, position, direction, player)
 {
     console.log("OLD", position)
    let newPosition = position + direction
    console.log("NEW",newPosition)
    map[newPosition] = player
    console.log(map[newPosition])
    console.log(player)

    return map
 }


 //TO.DO add reactions, update embed with new positions

exports.run = async (bot, message, args) => {

    //Create Map To On
    var map = [ 
                '🟫','🟫','🟫','🟫', '🟫',
                '🟫','🟫','🟫','🟫', '🟫',
                '🟫','🟫','🟫','🟫', '🟫',
                '🟫','🟫','🟫','🟫', '🟫',
                '🟫','🟫','🟫','🟫', '🟫',
              ]
    
    //var map = [ 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]


    //Get Size Of Board
    const max = map.length
    const root = Math.sqrt(max)
    

    //Set Emoji Char
    var player = '😎'
    var target = '❌'
    var box = '🟧'

    //Make Random Positons For Map 
    var playerPosition = getRandomInt(max)
    var targetPosition = getRandomInt(max)

    //Make sure box doesnt spawn in a corner
    
    //Get corners of map
    const cornerTopRight = root - 1
    const cornerBottomLeft = max - root
    const cornerBottomRight = max - 1
    

    //Exclude Sidse From Array
    let absentArray = [] 

    //Find all the tiles surrounding the map
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
        if(counter <= (root - 1))
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

    //Remove commas x is -1 to get the very last element LOOK INTO THIS
    x = -2
    while(x <= max)
    {
        map = map.replace(",","");
        ++x
    }

            //Ship the map and characters
            let embed = new Discord.MessageEmbed()
                .setTitle('Sokoban')
                .setColor('#FF0000')
                .setDescription(map)

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
                    if (reaction.emoji.name === '◀️') {
                        let dir = -1
                        let embed = new Discord.MessageEmbed() 
                            .setTitle('Sokoban')
                            .setColor('#FF0000')
                            .setDescription(movePlayer(map, playerPosition, dir, player))

                        embedMessage.edit(embed)
                       

                    } 
                    else if (reaction.emoji.name === '🔼') {
                        
                    }
                    else if (reaction.emoji.name === '🔽') {
                        
                    }
                    else if (reaction.emoji.name === '▶️') {
                        
                    }
                    
                })
                .catch(collected => {
                    message.reply('you didn\'t use a move!');
                });
            });
        
    
    
}
