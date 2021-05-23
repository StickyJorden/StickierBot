const Discord = require('discord.js');

//Set Emoji Char
const player = '😊'
const target = '❎'
const box = '🟧'
const floor = '🟫'
const wall = '🟥'
const winBlock = '✅'
const lose = '🤬'
const winPlayer = '😎'

//Get Size Of Board
const max = 64
const root = Math.sqrt(max)

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
    return Number(randomArray[0]);
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
function buildPerimeter(rootCheck, maxCheck)
{
    //Exclude Sidse From Array
    let absentArray = [] 

    //Find all the tiles surrounding the mapObj
    let pop = 0
    let nest = 1
    while(pop <= rootCheck)
    {
        if(pop == 0)
        {
            while(pop < (rootCheck-1))
            {
                absentArray.push(pop)
                pop++
            }
            pop = 0
        }
        if(pop > 0 && pop < (rootCheck - 1))
        {
            while(nest < rootCheck)
            {
                absentArray.push((rootCheck * nest) - 1)
                absentArray.push((rootCheck * nest))
            
                nest++
            }
        }
        if(pop == rootCheck)
        {
            nest = (maxCheck - rootCheck) + 1
            while(nest <= maxCheck)
            {
                absentArray.push(nest)
                nest++
            }
        }
        pop++
    }
    return absentArray
}

//Find all the tiles surrounding the mapObj
function buildInnerPerimeter(rootCheck, maxCheck)
{
    //Exclude Sidse From Array
    let absentArray = [] 

    //Find all the tiles surrounding the mapObj
    let pop = 0
    let nest = 1
    while(pop <= rootCheck)
    {
        if(pop == 0)
        {
            while(pop < (rootCheck - 1))
            {
                absentArray.push(pop)
                absentArray.push(pop + (root + 1))
                pop++
            }
            pop = 0
        }
        if(pop > 0 && pop < (rootCheck - 1))
        {
            while(nest < rootCheck)
            {
                absentArray.push((rootCheck * nest) - 2)
                absentArray.push((rootCheck * nest) - 1)
                absentArray.push((rootCheck * nest))
                absentArray.push((rootCheck * nest) + 1)
            
                nest++
            }
        }
        if(pop == rootCheck)
        {
            nest = (maxCheck - rootCheck) + 1
            while(nest <= maxCheck)
            {
                absentArray.push(nest)
                absentArray.push(nest + (root + 1))
                nest++
            }
        }
        pop++
    }
    return absentArray
}

//Make the new line and comma removed veriso of the map
function makeEmbedMap(mapObj)
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

    //Remove commas 
    x = -(root + 1)
    while(x <= max)
    {
        mapString = mapString.replace(",","");
        ++x
    }

    return mapString
}

//Move the player give the map, their playerPosition, and direction they are going
function movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition, outerWall, innerWall)
 {
    //Remove new lines to get correct values for mapping
    mapObj = removeItemAll(mapObj, '\n')
    
    //Find new player position
    let newPlayerPosition = playerPosition + direction
    let newBoxPosition = boxPosition
    let status = "play"

    //Check with outter wall array to see if player ran into it
    for(i = 0; i < outerWall.length; i++){

        //If player is not at wall we need to check for the box
        if(newPlayerPosition != outerWall[i])
        {
            //If player position is equal to box position update box position
            if(newPlayerPosition == boxPosition)
            {
                //Calculate new box position
                newBoxPosition = direction + boxPosition

                //If the position is equal to a wall then dont let them move the box
                if(newBoxPosition == outerWall[i])
                {
                    newBoxPosition = boxPosition
                    newPlayerPosition = playerPosition
                    mapObj[newPlayerPosition] = player
                    mapObj[outerWall[i]] = wall
                    mapObj[newBoxPosition] = box


                    let mapString = makeEmbedMap(mapObj)

                    var results = {map: mapString, playerPos: newPlayerPosition, boxPos: newBoxPosition, status: status};
                    return results
                     
                }
                //If the box is not going to run into a wall then let them move
                else if(newBoxPosition != outerWall[i])
                {
                    mapObj[newBoxPosition] = box
                    mapObj[newPlayerPosition] = player
                    mapObj[playerPosition] = floor

                    //Check to see if they won! 
                    if(newBoxPosition == targetPosition)
                    {
                        //return you win
                        mapObj[newBoxPosition] = winBlock
                        mapObj[newPlayerPosition] = winPlayer

                        let mapString = makeEmbedMap(mapObj)
                        status = "win"

                        var results = {map: mapString, playerPos: newPlayerPosition, boxPos: newBoxPosition, status: status};
                        return results
                         
                    }
                    /*
                    else if(newBoxPosition != targetPosition)
                    {
                        for(j = 0; j < innerWall.length; j++)
                        {
                            if(newBoxPosition == innerWall[j])
                            {
                                mapObj[newPlayerPosition] = lose

                                let mapString = makeEmbedMap(mapObj)

                                var results = {map: mapString, playerPos: newPlayerPosition, boxPos: newBoxPosition};
                                return results
                            }
                        }
                    }
                    */
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
                mapObj[playerPosition] = floor
                 
            }
        }
        //If player is at a wall dont let them move
        else if(newPlayerPosition == outerWall[i])
        {
            newPlayerPosition = playerPosition
            mapObj[newPlayerPosition] = player
            mapObj[outerWall[i]] = wall

            let mapString = makeEmbedMap(mapObj)

            var results = {map: mapString, playerPos: newPlayerPosition, boxPos: newBoxPosition, status: status};
            return results
        }
    }

    if(direction == 0)
    {
        mapObj[newPlayerPosition] = lose
    }

    let mapString = makeEmbedMap(mapObj)

    var results = {map: mapString, playerPos: newPlayerPosition, boxPos: newBoxPosition, status: status};
    return results
}

function makeNextMessage(message, embedMessage, mapObj, mapString, playerPosition, boxPosition, targetPosition, outerWall, innerWall)
 {
    //Send the message in chat with the ability to react to the embed
    //Add reactions to the embed
    var results;

    embedMessage.react('◀️')
        .then(() => embedMessage.react('🔼'))
        .then(() => embedMessage.react('🔽'))
        .then(() => embedMessage.react('▶️'))
        .then(() => embedMessage.react('🗑'))
        .catch(() => console.error('One of the emojis failed to react.'));

    //Filter which embeds I care for
    const filter = (reaction, user) => {
        return ['◀️', '🔼','🔽','▶️','🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    //Wait for the user to react
    embedMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();

            //Read in which reaction was selected
            //Move Player Left
            if (reaction.emoji.name === '◀️') {
                let direction = -1

                results = movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition, outerWall, innerWall)

                if(results.status == "win")
                {
                    let embed = new Discord.MessageEmbed() 
                        .setTitle('Sokoban')
                        .setColor('#FF0000')
                        .addField(`You Win!`, `Well Played`)
                        .addField(`\u200B`, results.map, false)

                    embedMessage.edit(embed)

                    embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    return
                }
                else
                {
                    let embed = new Discord.MessageEmbed() 
                        .setTitle('Sokoban')
                        .setColor('#FF0000')
                        .addField(`How To Play`, `1. Use the arrow keys to move the player 😊 \n 2. Push the box 🟧 to the target ❎ \n 3. Be careful where you move or else you'll be stuck!`)
                        .addField(`\u200B`, results.map, false)

                    embedMessage.edit(embed)

                    embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    
                    makeNextMessage(message, embedMessage, mapObj, mapString, results.playerPos, results.boxPos, targetPosition, outerWall, innerWall)
                }
            } 
            //Move Player Up
            else if (reaction.emoji.name === '🔼') {
                let direction = root * -1

                results = movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition, outerWall, innerWall)

                if(results.status == "win")
                {
                    let embed = new Discord.MessageEmbed() 
                        .setTitle('Sokoban')
                        .setColor('#FF0000')
                        .addField(`You Win!`, `Well Played`)
                        .addField(`\u200B`, results.map, false)

                    embedMessage.edit(embed)

                    embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    return
                }
                else
                {
                    let embed = new Discord.MessageEmbed() 
                        .setTitle('Sokoban')
                        .setColor('#FF0000')
                        .addField(`How To Play`, `1. Use the arrow keys to move the player 😊 \n 2. Push the box 🟧 to the target ❎ \n 3. Be careful where you move or else you'll be stuck!`)
                        .addField(`\u200B`, results.map, false)

                    embedMessage.edit(embed)

                    embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    
                    makeNextMessage(message, embedMessage, mapObj, mapString, results.playerPos, results.boxPos, targetPosition, outerWall, innerWall)
                }


            }
            //Move Player Down
            else if (reaction.emoji.name === '🔽') {
                let direction = root

                results = movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition, outerWall, innerWall)

                if(results.status == "win")
                {
                    let embed = new Discord.MessageEmbed() 
                        .setTitle('Sokoban')
                        .setColor('#FF0000')
                        .addField(`You Win!`, `Well Played`)
                        .addField(`\u200B`, results.map, false)

                    embedMessage.edit(embed)

                    embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    return
                }
                else
                {
                    let embed = new Discord.MessageEmbed() 
                        .setTitle('Sokoban')
                        .setColor('#FF0000')
                        .addField(`How To Play`, `1. Use the arrow keys to move the player 😊 \n 2. Push the box 🟧 to the target ❎ \n 3. Be careful where you move or else you'll be stuck!`)
                        .addField(`\u200B`, results.map, false)

                    embedMessage.edit(embed)

                    embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    
                    makeNextMessage(message, embedMessage, mapObj, mapString, results.playerPos, results.boxPos, targetPosition, outerWall, innerWall)
                }
            }
            //Move Player Right
            else if (reaction.emoji.name === '▶️') {
                let direction = 1

                results = movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition, outerWall, innerWall)

                if(results.status == "win")
                {
                    let embed = new Discord.MessageEmbed() 
                        .setTitle('Sokoban')
                        .setColor('#FF0000')
                        .addField(`You Win!`, `Well Played`)
                        .addField(`\u200B`, results.map, false)

                    embedMessage.edit(embed)

                    embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    return
                }
                else
                {
                    let embed = new Discord.MessageEmbed() 
                        .setTitle('Sokoban')
                        .setColor('#FF0000')
                        .addField(`How To Play`, `1. Use the arrow keys to move the player 😊 \n 2. Push the box 🟧 to the target ❎ \n 3. Be careful where you move or else you'll be stuck!`)
                        .addField(`\u200B`, results.map, false)

                    embedMessage.edit(embed)

                    embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    
                    makeNextMessage(message, embedMessage, mapObj, mapString, results.playerPos, results.boxPos, targetPosition, outerWall, innerWall)
                }
            }
            //Move Player Right
            else if (reaction.emoji.name === '🗑') {
                return 0
            }
        })
        .catch(collected => {
                let direction = 0

                results = movePlayer(mapObj, playerPosition, direction, boxPosition, targetPosition, outerWall, innerWall)

                let embed = new Discord.MessageEmbed() 
                    .setTitle('Sokoban')
                    .setColor('#FF0000')
                    .addField(`You Lost!`, `Better luck next time!`)
                    .addField(`\u200B`, results.map, false)

                embedMessage.edit(embed)

                embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                return
        });
}

exports.run = async (bot, message, args) => {

    //Create mapObj To On
    var mapObj = [ 
        '🟥','🟥','🟥','🟥','🟥','🟥','🟥','🟥',
        '🟥','🟫','🟫','🟫','🟫','🟫','🟫','🟥',
        '🟥','🟫','🟫','🟫','🟫','🟫','🟫','🟥',
        '🟥','🟫','🟫','🟫','🟫','🟫','🟫','🟥',
        '🟥','🟫','🟫','🟫','🟫','🟫','🟫','🟥',
        '🟥','🟫','🟫','🟫','🟫','🟫','🟫','🟥',
        '🟥','🟫','🟫','🟫','🟫','🟫','🟫','🟥',
        '🟥','🟥','🟥','🟥','🟥','🟥','🟥','🟥',
    ]

    var outerWall = buildPerimeter(root, max)
    var innerWall = buildInnerPerimeter(root, max)
    

    //Make Random Positons For mapObj 
    //Generate new array without sides and get random number from that array
    //Find a way to undo the hardcode
    var boxPosition = generateRandom(1, innerWall, 36)
    var playerPosition = generateRandom(1, outerWall, max)
    var targetPosition = generateRandom(1, outerWall, max)


    //Make sure each of the selected moves are of a different type
    while(playerPosition == targetPosition || targetPosition == boxPosition || boxPosition == playerPosition)
    {
        if(playerPosition == targetPosition)
        {
            targetPosition = generateRandom(1, outerWall, max)
        }
        if(targetPosition == boxPosition)
        {
            boxPosition = generateRandom(1, innerWall, 36)
        }
        if(boxPosition == playerPosition)
        {
            playerPosition = generateRandom(1, outerWall, max)
        }
    }

    //Add Character To The mapObj
    mapObj[playerPosition] = player
    mapObj[targetPosition] = target
    mapObj[boxPosition] = box

    //Remove new lines to get correct values for mapping
    mapObj = removeItemAll(mapObj, '\n')

    //Build String looking box
    let mapString = makeEmbedMap(mapObj)

    //Ship the mapObj and characters
    let embed = new Discord.MessageEmbed()
        .setTitle('Sokoban')
        .setColor('#FF0000')
        .addField(`How To Play`, `1. Use the arrow keys to move the player 😊 \n 2. Push the box 🟧 to the target ❎ \n 3. Be careful where you move or else you'll be stuck!`)
        .addField(`\u200B`,mapString, false)

     //Send the message in chat with the ability to react to the embed
    //Add reactions to the embed
    message.channel.send({embed: embed}).then(embedMessage => {

        makeNextMessage(message, embedMessage, mapObj, mapString, playerPosition, boxPosition, targetPosition, outerWall, innerWall)
    
    });
    
}
