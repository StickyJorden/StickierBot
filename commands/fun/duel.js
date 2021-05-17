const Discord = require('discord.js');
const fs = require('fs');
const createBar = require('string-progressbar');

//We can call the JSON file for quotes
const moves = JSON.parse(fs.readFileSync('storage/moves.json','utf8'));

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

function setDescription(round, choiceMove)
{
    if(round == 0)
    {
        return 'Select the move you would like to use!';
    }
    else if(round > 0)
    {
        return `You used ${choiceMove}`;
    }
    
}

function battleBuildStart(message, rMember, total, current, size, round)
{
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
    let choiceChart = "";
    let choiceType = "";
    let cpuHealth = 100;

    let space = `\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0`;

    var bar = createBar(total, current, size)
    

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
          .setDescription(`${setDescription(round, choiceMove)}`)
          .addFields(
                {name: 'Move', value: `1. ${moves[moveOne].move} \n 2. ${moves[moveTwo].move} \n 3. ${moves[moveThree].move} \n 4. ${moves[moveFour].move}`, inline:true},
                {name: 'Type', value: `${moves[moveOne].type} \n ${moves[moveTwo].type} \n ${moves[moveThree].type} \n ${moves[moveFour].type}`, inline:true},
                {name: `Power \t Accuracy`, value: `${moves[moveOne].power}${space}${moves[moveOne].acc} \n ${moves[moveTwo].power}${space}${moves[moveTwo].acc} \n ${moves[moveThree].power}${space}${moves[moveThree].acc} \n ${moves[moveFour].power}${space}${moves[moveFour].acc}`, inline:true},
                {name:'Health', value:`${bar[0]} \n ${bar[1]}/${total}`, inline:false}
          )
          .setColor(0x800080)
          .setTimestamp();

    round++;

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
                choiceMove = moves[moveOne].move;
                choiceChart = moves[moveOne];
                choicePower = moves[moveOne].power;
            } 
            else if (reaction.emoji.name === '2️⃣') {
                choiceMove = moves[moveTwo].move;
                choiceChart = moves[moveTwo];
                choicePower = moves[moveTwo].power;
            }
            else if (reaction.emoji.name === '3️⃣') {
                choiceMove = moves[moveThree].move;
                choiceChart = moves[moveThree];
                choicePower = moves[moveThree].power;
            }
            else if (reaction.emoji.name === '4️⃣') {
                choiceMove = moves[moveFour].move;
                choiceChart = moves[moveFour];
                choicePower = moves[moveFour].power;
            }

            //Let the user know what move their opponet used 
            let turnCPU = `${rMember.user.username} used ${moves[moveCPU].move} \n **Type:** ${moves[moveCPU].type} **Power:** ${moves[moveCPU].power}`;

            //check if player fainted probably need to remove
            if(current <= 0)
            {
                message.channel.send("You fainted!");
                return 0;
            } 
            
            let battleResponse = "";

            //Determine who won based off typing with a number breakdown/array in moves.json
            if(choiceChart.chart[moves[moveCPU].order] == 0)
            {
                battleResponse = `Your move does not effect the foe ${rMember.user.username}`;
                current = current - moves[moveCPU].power;
            }
            else if(choiceChart.chart[moves[moveCPU].order] == 0.5)
            {
                battleResponse = `Your move was not very effective...`;
                current = current - moves[moveCPU].power;
            }
            else if(choiceChart.chart[moves[moveCPU].order] == 1)
            {
                let winner = getRandomInt(2);
                if(winner == 0){
                    battleResponse = `It was a close call, but ${choiceMove} came out on top!`;
                    cpuHealth = cpuHealth - choicePower;
                }
                if(winner == 1){
                    battleResponse = `It was a close call, but ${moves[moveCPU].move} came out on top!`;
                    current = current - moves[moveCPU].power;
                }
            }
            else if(choiceChart.chart[moves[moveCPU].order] == 2)
            {
                battleResponse = `It's super effective!`;
                cpuHealth = cpuHealth - choicePower;
            }

            battleBuildPlay(message, rMember, total, current, size, round, choiceMove, turnCPU, battleResponse, cpuHealth);
        })
        .catch(collected => {
            message.reply('you didn\'t use a move!');
        });
    }); 
}

function battleBuildPlay(message, rMember, total, current, size, round, choiceMove, turnCPU, battleResponse, cpuHealth)
{
    
    if(cpuHealth <= 0)
    {
        message.channel.send("You Win!");
        return 0; 
    }
    else if(current <= 0)
    {
        message.channel.send("You Lose!");
        return 0; 
    }

    //If everything checks out begin
    //max number of moves in JSON file moves
    var max = Object.keys(moves).length;

    //Get random numbers to get random move type
    let moveOne = getRandomInt(max);
    let moveTwo = getRandomInt(max);
    let moveThree = getRandomInt(max);
    let moveFour = getRandomInt(max);
    let moveCPU = getRandomInt(max);
    let choiceType = "";
    let space = `\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0`;
    var bar = createBar(total, current, size)
    

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
          .setDescription(`${setDescription(round, choiceMove)} \n ${turnCPU} \n ${battleResponse} \n ${rMember.user.username} **Health:** ${cpuHealth}/100`)
          .addFields(
                {name: 'Move', value: `1. ${moves[moveOne].move} \n 2. ${moves[moveTwo].move} \n 3. ${moves[moveThree].move} \n 4. ${moves[moveFour].move}`, inline:true},
                {name: 'Type', value: `${moves[moveOne].type} \n ${moves[moveTwo].type} \n ${moves[moveThree].type} \n ${moves[moveFour].type}`, inline:true},
                {name: `Power \t Accuracy`, value: `${moves[moveOne].power}${space}${moves[moveOne].acc} \n ${moves[moveTwo].power}${space}${moves[moveTwo].acc} \n ${moves[moveThree].power}${space}${moves[moveThree].acc} \n ${moves[moveFour].power}${space}${moves[moveFour].acc}`, inline:true},
                {name:'Health', value:`${bar[0]} \n ${bar[1]}/${total}`, inline:false}
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
                choiceMove = moves[moveOne].move;
                choiceChart = moves[moveOne];
                choicePower = moves[moveOne].power;
            } 
            else if (reaction.emoji.name === '2️⃣') {
                choiceMove = moves[moveTwo].move;
                choiceChart = moves[moveTwo];
                choicePower = moves[moveTwo].power;
            }
            else if (reaction.emoji.name === '3️⃣') {
                choiceMove = moves[moveThree].move;
                choiceChart = moves[moveThree];
                choicePower = moves[moveThree].power;
            }
            else if (reaction.emoji.name === '4️⃣') {
                choiceMove = moves[moveFour].move;
                choiceChart = moves[moveFour];
                choicePower = moves[moveFour].power;
            }
            
            //Let the user know what move their opponet used 
            let turnCPU = `${rMember.user.username} used ${moves[moveCPU].move} \n **Type:** ${moves[moveCPU].type} **Power:** ${moves[moveCPU].power}`;

            //check if player fainted probably need to remove
        
            if(current > 0)
            {
            //Determine who won based off typing with a number breakdown/array in moves.json
            if(choiceChart.chart[moves[moveCPU].order] == 0)
            {
                battleResponse = `Your move does not effect the foe ${rMember.user.username}`;
                current = current - moves[moveCPU].power;
            }
            else if(choiceChart.chart[moves[moveCPU].order] == 0.5)
            {
                battleResponse = `Your move was not very effective...`;
                current = current - moves[moveCPU].power;
            }
            else if(choiceChart.chart[moves[moveCPU].order] == 1)
            {
                let winner = getRandomInt(2);
                if(winner == 0){
                    battleResponse = `It was a close call, but ${choiceMove} came out on top!`;
                    cpuHealth = cpuHealth - choicePower;
                }
                if(winner == 1){
                    battleResponse = `It was a close call, but ${moves[moveCPU].move} came out on top!`;
                    current = current - moves[moveCPU].power;
                }
            }
            else if(choiceChart.chart[moves[moveCPU].order] == 2)
            {
                battleResponse = `It's super effective!`;
                cpuHealth = cpuHealth - choicePower;
            }

            console.log("CPU:" + cpuHealth);
            console.log("YOU:" + current);

            if(current > 0 && cpuHealth > 0)
            {
            battleBuildPlay(message, rMember, total, current, size, round, choiceMove, turnCPU, battleResponse, cpuHealth);
            }
            else if(cpuHealth <= 0)
                {
                    message.channel.send("You Win!");
                    return 0; 
                }
            else if(current <= 0)
                {
                    message.channel.send("You Lose!");
                    return 0; 
                }
            }
        })
        .catch(collected => {
            message.reply('you didn\'t use a move!');
        });
    }); 
}

module.exports.run = async (bot, message, args) => {

    //Check to make sure another user was mentioned to duel. 
    if(!args[0]) return message.reply("You have not challanged anyone to a duel!");

    //If a user was found then make sure it is a user in chat. 
    let rMember = message.mentions.members.first();

    //Make sure user is not a bot or themsevels
    /*
    if(rMember.user.bot == true || rMember == message.author.id)
    {
        return message.reply("You cannot duel yourself or a bot!")
    }
    */

    //If user is not found exit
    if(!rMember) return message.reply("I am not aware of this challenger go fetch them!");

    var round = 0;
    var total = 100;
    var current = 100;
    var size = 10, line = '🟩', slider = '🔘';
    // Call the createBar method, first two arguments are mandatory
    // size (length of bar) default to 40, line default to '▬' and slider default to 🔘

    battleBuildStart(message, rMember, total, current, size, round);

}