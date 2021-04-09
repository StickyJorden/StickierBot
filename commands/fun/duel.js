const Discord = require('discord.js');
const fs = require('fs');

//We can call the JSON file for quotes
const moves = JSON.parse(fs.readFileSync('Storage/moves.json','utf8'));

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports.run = async (bot, message, args) => {

    //Check to make sure another user was mentioned to duel. 
    if(!args[0]) return message.reply("You have not challanged anyone to a duel!");

    //If a user was found then make sure it is a user in chat. 
    let rMember = message.mentions.members.first();

    //If user is not found exit
    if(!rMember) return message.reply("I am not aware of this challenger go fetch them!");

    //If everything checks out begin
    //max number of moves in JSON file moves
    var max = Object.keys(moves).length;
    
    //Get random numbers to get random move type
    let moveOne = getRandomInt(max);
    let moveTwo = getRandomInt(max);
    let moveThree = getRandomInt(max);
    let moveFour = getRandomInt(max);
    let moveCPU = getRandomInt(max);
    let choiceMove = "";
    let choiceType = "";


    //Make sure each of the selected moves are of a different type
    while(moves[moveOne].type == moves[moveTwo].type || moves[moveTwo].type == moves[moveThree].type || moves[moveThree].type == moves[moveFour].type || moves[moveFour].type == moves[moveOne].type || moves[moveFour].type == moves[moveTwo].type || moves[moveOne].type == moves[moveThree].type)
    {
        if(moves[moveOne].type == moves[moveTwo].type)
        {
        moveTwo = getRandomInt(max);
        }
        if(moves[moveTwo].type == moves[moveThree].type)
        {
        moveThree = getRandomInt(max);
        }
        if(moves[moveThree].type == moves[moveFour].type)
        {
        moveFour = getRandomInt(max);
        }
        if(moves[moveFour].type == moves[moveOne].type)
        {
        moveOne = getRandomInt(max);
        }
        if(moves[moveTwo].type == moves[moveFour].type)
        {
        moveTwo = getRandomInt(max);
        }
        if(moves[moveOne].type == moves[moveThree].type)
        {
        moveThree = getRandomInt(max);
        }
    }

    //Build the embed for the user who started the duel
    const embed = new Discord.MessageEmbed()
          .setTitle(`${message.member.user.username} has challenged ${rMember.user.username}!`)
          .setDescription(`Select the move you would like to use!`)
          .addFields(
                {name: 'Move', value: `1. ${moves[moveOne].move} \n 2. ${moves[moveTwo].move} \n 3. ${moves[moveThree].move} \n 4. ${moves[moveFour].move}`, inline:true},
                {name: 'Type', value: `${moves[moveOne].type} \n ${moves[moveTwo].type} \n ${moves[moveThree].type} \n ${moves[moveFour].type}`, inline:true}
          )
          .setColor(0x800080)
          .setTimestamp();

    //Send the message in chat with the ability to react to the embed

    //Add reactions to the embed
    message.channel.send({embed: embed}).then(embedMessage => {
        embedMessage.react('1️⃣')
        .then(() => embedMessage.react('2️⃣'))
        .then(() => embedMessage.react('3️⃣'))
        .then(() => embedMessage.react('4️⃣'))
        .catch(() => console.error('One of the emojis failed to react.'));

        

    //Filter which embeds I care for
    const filter = (reaction, user) => {
        return ['1️⃣', '2️⃣','3️⃣','4️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    
    //Wait for the user to react
    embedMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();
    
            //Read in which reaction was selected
            if (reaction.emoji.name === '1️⃣') {
                message.reply(`used the move ${moves[moveOne].move}!`);
                choiceMove = moves[moveOne].move;
            } 
            else if (reaction.emoji.name === '2️⃣') {
                message.reply(`used the move ${moves[moveTwo].move}!`);
                choiceMove = moves[moveTwo].move;
            }
            else if (reaction.emoji.name === '3️⃣') {
                message.reply(`used the move ${moves[moveThree].move}!`);
                choiceMove = moves[moveThree].move;
            }
            else if (reaction.emoji.name === '4️⃣') {
                message.reply(`used the move ${moves[moveFour].move}!`);
                choiceMove = moves[moveFour].move;
            }

            //Let the user know what move their opponet used 
            message.channel.send(`${rMember.user.username} used the move ${moves[moveCPU].move} with type ${moves[moveCPU].type}!`);

            //Determine who won based off typing with a number breakdown/array in moves.json
            if(moves[moveOne].chart[moves[moveCPU].order] == 0)
            {
                message.reply(`It does not effect the foe ${rMember.user.username} you lost...`);
            }
            else if(moves[moveOne].chart[moves[moveCPU].order] == 0.5)
            {
                message.reply(`Your move was not very effective you lost...`);
            }
            else if(moves[moveOne].chart[moves[moveCPU].order] == 1)
            {
                let winner = getRandomInt(2);
                console.log(winner);
                if(winner == 0){
                    message.reply(`It was a close call, but ${choiceMove} came out on top! You won!`);
                }
                if(winner == 1){
                    message.reply(`It was a close call, but ${moves[moveCPU].move} came out on top! You lost...`);
                }
            }
            else if(moves[moveOne].chart[moves[moveCPU].order] == 2)
            {
                message.reply(`It's super effective you won!`);
            }



        })
        .catch(collected => {
            message.reply('you didn\'t use a move!');
        });
    });  

    
}