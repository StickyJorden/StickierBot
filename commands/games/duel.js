const Discord = require('discord.js');
const fs = require('fs');
const progressbar = require('string-progressbar');
const economy = require('@listeners/economy.js'); 

//We can call the JSON file for quotes
const moves = JSON.parse(fs.readFileSync('storage/moves.json','utf8'));

//If everything checks out begin
//max number of moves in JSON file moves
const max = Object.keys(moves).length;

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

function setMoves()
{
     //Get random numbers to get random move type
     let moveOne = getRandomInt(max);
     let moveTwo = getRandomInt(max);
     let moveThree = getRandomInt(max);
     let moveFour = getRandomInt(max);
     

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

    var move = {first: moveOne, second: moveTwo, third: moveThree, fourth: moveFour};
    return move

}

function battleBuildPlay(message, rMember, embedMessage, total, current, size, round, choiceMove, turnCPU, battleResponse, cpuHealth, coinsToTake)
{
    //If everything checks out begin
    let moveCPU = getRandomInt(max);
    let choiceChart = "", choiceType = "";
    let space = `\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0`;
    var moveNum = setMoves()
    const coinsToGive = coinsToTake;
    
    //Send the message in chat with the ability to react to the embed
    //Add reactions to the embed
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
        .then(async collected => {

            const reaction = collected.first();
    
            //Read in which reaction was selected
            if (reaction.emoji.name === '1️⃣') {
                choiceMove = moves[moveNum.first].move;
                choiceChart = moves[moveNum.first];
                choicePower = moves[moveNum.first].power;
            } 
            else if (reaction.emoji.name === '2️⃣') {
                choiceMove = moves[moveNum.second].move;
                choiceChart = moves[moveNum.second];
                choicePower = moves[moveNum.second].power;
            }
            else if (reaction.emoji.name === '3️⃣') {
                choiceMove = moves[moveNum.third].move;
                choiceChart = moves[moveNum.third];
                choicePower = moves[moveNum.third].power;
            }
            else if (reaction.emoji.name === '4️⃣') {
                choiceMove = moves[moveNum.fourth].move;
                choiceChart = moves[moveNum.fourth];
                choicePower = moves[moveNum.fourth].power;
            }
           
            reaction.users.remove(message.member.user.id)
            
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
            
            
            if(current > 0)
            {
                
            var bar = progressbar.filledBar(total, current, size)
           
            }

            if(current > 0 && cpuHealth > 0)
            {
                
                let embed = new Discord.MessageEmbed() 
                    .setTitle(`${message.member.user.username} has challenged ${rMember.user.username}!`)
                    .setDescription(`${coinsToTake} pokecoins are on the line: \n ${turnCPU} \n ${battleResponse} \n ${rMember.user.username} **Health:** ${cpuHealth}/100`)
                    .setColor(0x800080)
                    .addFields(
                        {name: 'Move', value: `1. ${moves[moveNum.first].move} \n 2. ${moves[moveNum.second].move} \n 3. ${moves[moveNum.third].move} \n 4. ${moves[moveNum.fourth].move}`, inline:true},
                        {name: 'Type', value: `${moves[moveNum.first].type} \n ${moves[moveNum.second].type} \n ${moves[moveNum.third].type} \n ${moves[moveNum.fourth].type}`, inline:true},
                        {name: `Power \t Accuracy`, value: `${moves[moveNum.first].power}${space}${moves[moveNum.first].acc} \n ${moves[moveNum.second].power}${space}${moves[moveNum.second].acc} \n ${moves[moveNum.third].power}${space}${moves[moveNum.third].acc} \n ${moves[moveNum.fourth].power}${space}${moves[moveNum.fourth].acc}`, inline:true},
                        {name:'Health', value:`${bar[0]} \n ${bar[1]}/${total}`, inline:false}
                    ) 
                    .setTimestamp();   

                //embedMessage.edit(embed)
    
                //battleBuildPlay(message, rMember, embedMessage, total, current, size, round, choiceMove, turnCPU, battleResponse, cpuHealth, coinsToTake);

                embedMessage.edit({embeds: [embed]}).then(embedMessage => {
    
                    battleBuildPlay(message, rMember, embedMessage, total, current, size, round, choiceMove, turnCPU, battleResponse, cpuHealth, coinsToTake);
            
                }); 
            }
            else if(cpuHealth <= 0)
                {
                    let embed = new Discord.MessageEmbed() 
                    .setTitle(`${message.member.user.username} has challenged ${rMember.user.username}!`)
                    .setDescription(`${message.member.user.username} WON! \n You got ${coinsToTake} pokecoins. \n ${turnCPU} \n ${battleResponse} \n ${rMember.user.username} **Health:** ${cpuHealth}/100`)
                    .addFields(
                        {name: 'Move', value: `1. ${moves[moveNum.first].move} \n 2. ${moves[moveNum.second].move} \n 3. ${moves[moveNum.third].move} \n 4. ${moves[moveNum.fourth].move}`, inline:true},
                        {name: 'Type', value: `${moves[moveNum.first].type} \n ${moves[moveNum.second].type} \n ${moves[moveNum.third].type} \n ${moves[moveNum.fourth].type}`, inline:true},
                        {name: `Power \t Accuracy`, value: `${moves[moveNum.first].power}${space}${moves[moveNum.first].acc} \n ${moves[moveNum.second].power}${space}${moves[moveNum.second].acc} \n ${moves[moveNum.third].power}${space}${moves[moveNum.third].acc} \n ${moves[moveNum.fourth].power}${space}${moves[moveNum.fourth].acc}`, inline:true},
                        {name:'Health', value:`${bar[0]} \n ${bar[1]}/${total}`, inline:false}
                    )
                    .setColor(0x800080)
                    .setTimestamp()   

                    embedMessage.edit({embeds: [embed]}).then(embedMessage => {
    
                        battleBuildPlay(message, rMember, embedMessage, total, current, size, round, choiceMove, turnCPU, battleResponse, cpuHealth, coinsToTake);
                
                    }); 

                    //Take coins away from who lost (challenger)
                    if(coinsToTake > 0)
                    {
                        const {guild, member} = message
                        let user = message.author
                        let username = message.member.user.tag
                        let guildID = guild.id
                        let userID = user.id

                        await economy.addCoins(username, guildID, userID, coinsToGive)
                        
                        user = rMember            
                        username = rMember.user.username                  
                        guildID = guild.id
                        userID = user.id                   

                        await economy.addCoins(username, guildID, userID, coinsToGive * -1)
                    }
                
                    return 0; 
                }
            else if(current <= 0)
                {

                    bar = progressbar.filledBar(total, 0, size)

                    let embed = new Discord.MessageEmbed() 
                        .setTitle(`${message.member.user.username} has challenged ${rMember.user.username}!`)
                        .setDescription(`${message.member.user.username} LOST! \n You paid ${coinsToTake} pokecoins. \n ${turnCPU} \n ${battleResponse} \n ${rMember.user.username} **Health:** ${cpuHealth}/100`)
                        .addFields(
                            {name: 'Move', value: `1. ${moves[moveNum.first].move} \n 2. ${moves[moveNum.second].move} \n 3. ${moves[moveNum.third].move} \n 4. ${moves[moveNum.fourth].move}`, inline:true},
                            {name: 'Type', value: `${moves[moveNum.first].type} \n ${moves[moveNum.second].type} \n ${moves[moveNum.third].type} \n ${moves[moveNum.fourth].type}`, inline:true},
                            {name: `Power \t Accuracy`, value: `${moves[moveNum.first].power}${space}${moves[moveNum.first].acc} \n ${moves[moveNum.second].power}${space}${moves[moveNum.second].acc} \n ${moves[moveNum.third].power}${space}${moves[moveNum.third].acc} \n ${moves[moveNum.fourth].power}${space}${moves[moveNum.fourth].acc}`, inline:true},
                            {name:'Health', value:`${bar[0]} \n ${bar[1]}/${total}`, inline:false}
                        )
                        .setColor(0x800080)
                        .setTimestamp()   

                    embedMessage.edit({embeds: [embed]}).then(embedMessage => {
    
                            battleBuildPlay(message, rMember, embedMessage, total, current, size, round, choiceMove, turnCPU, battleResponse, cpuHealth, coinsToTake);
                    
                        }); 

                    //Take coins away from who lost (challenger)
                    if(coinsToTake > 0)
                    {
                        const {guild, member} = message
                        let user = message.author
                        let username = message.member.user.tag
                        let guildID = guild.id
                        let userID = user.id

                        await economy.addCoins(username, guildID, userID, coinsToGive * -1)
                        
                        user = rMember            
                        username = rMember.user.username                  
                        guildID = guild.id
                        userID = user.id                   

                        await economy.addCoins(username, guildID, userID, coinsToGive)
                    }
                          
                    return 0;
                }
            }

        })
        .catch(collected => {

            let embed = new Discord.MessageEmbed() 
                .setTitle(`${message.member.user.username} has challenged ${rMember.user.username}!`)
                .setDescription(`${message.member.user.username} LOST! \n You paid ${coinsToTake} pokecoins. `)
                .addFields(
                    {name: 'Move', value: `1. ${moves[moveNum.first].move} \n 2. ${moves[moveNum.second].move} \n 3. ${moves[moveNum.third].move} \n 4. ${moves[moveNum.fourth].move}`, inline:true},
                    {name: 'Type', value: `${moves[moveNum.first].type} \n ${moves[moveNum.second].type} \n ${moves[moveNum.third].type} \n ${moves[moveNum.fourth].type}`, inline:true},
                    {name: `Power \t Accuracy`, value: `${moves[moveNum.first].power}${space}${moves[moveNum.first].acc} \n ${moves[moveNum.second].power}${space}${moves[moveNum.second].acc} \n ${moves[moveNum.third].power}${space}${moves[moveNum.third].acc} \n ${moves[moveNum.fourth].power}${space}${moves[moveNum.fourth].acc}`, inline:true},
                    {name:'Health', value:`Timed Out`, inline:false}
                )
                .setColor(0x800080)
                .setTimestamp()   

            embedMessage.edit({embeds: [embed]}).then(embedMessage => {
    
                    battleBuildPlay(message, rMember, embedMessage, total, current, size, round, choiceMove, turnCPU, battleResponse, cpuHealth, coinsToTake);
            
                }); 

            return 0; 
        });
    
}

module.exports = {
    name: "duel",
    alias: ["pokemon"],
    run: async (client, message, args) => { 


    //If a user was found then make sure it is a user in chat. 
    let rMember = message.mentions.members.first();

    //If user is not found yell at them
    if(!rMember)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Duel") 
            .setDescription("That challanger could not be found.")
            .setColor(0x800080)
            .setTimestamp();
    
        message.channel.send({embeds: [embed]});
        return
    }

    //Make sure user is not a client or themsevels
    if(rMember.user.client == true || rMember == message.author.id)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Duel") 
            .setDescription("You cannot duel yourself or a client!")
            .setColor(0x800080)
            .setTimestamp();
    
        message.channel.send({embeds: [embed]});
        return
    }
    

    //Make sure we get a useable amount
    const coinsToTake = args[1]
    if(isNaN(coinsToTake))
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Duel") 
            .setDescription('You need to pay the entrance fee to duel. Usage !duel <user> <amount>')
            .setColor(0x800080)
            .setTimestamp();
    
        message.channel.send({embeds: [embed]});
        return
    }

    //Make sure they use whole numbers only
    if(coinsToTake % 1 != 0)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Duel") 
            .setDescription('Please whole numbers only. Usage !pay <user> <amount>')
            .setColor(0x800080)
            .setTimestamp();
        
        message.channel.send({embeds: [embed]});
        return
    }

    //Make sure user doesnt take too much!
    if(coinsToTake > 1000000)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Duel") 
            .setDescription('Thats too much! (Max you can pay is 10 coins)')
            .setColor(0x800080)
            .setTimestamp();

        message.channel.send({embeds: [embed]});
        return
    }
    //Make sure user does send negative money!
    else if(coinsToTake < 0)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Duel") 
            .setDescription('You can enter for free just use 0 coins')
            .setColor(0x800080)
            .setTimestamp();

        message.channel.send({embeds: [embed]});
        return
    }

    const {guild, member} = message
    let username = message.member.user.tag
    let guildID = guild.id
    let userID = member.id

    const coinsOwned = await economy.getCoins(username, guildID, userID)
    if(coinsOwned < coinsToTake && coinsToTake > 0)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Duel") 
            .setDescription(`You do not have ${coinsToGive} coins!`)
            .setColor(0x800080)
            .setTimestamp();
    
        message.channel.send({embeds: [embed]});
        return
    }


    user = message.mentions.users.first()
    userID = user.id
    username = user.tag

    
    const coins = await economy.getCoins(username, guildID, userID)
    /*
    if(coins < coinsToTake && coinsToTake > 0)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Duel") 
            .setDescription(`That user ${username} has ${coins} coins! Wager less coins. (Max is 10)`)
            .setColor(0x800080)
            .setTimestamp();
    
        message.channel.send({embeds: [embed]});
        return
    }
*/

    var round = 0;
    var total = 100;
    var current = 100;
    var size = 10, line = '🟩', slider = '🔘';
    // Call the progressbar.filledBar method, first two arguments are mandatory
    // size (length of bar) default to 40, line default to '▬' and slider default to 🔘

    let choiceMove = "", turnCPU = "", battleResponse = "", cpuHealth = 100;

    let space = `\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0`;
    var bar = progressbar.filledBar(total, current, size)
    var moveNum = setMoves()


    //Build the embed for the user who started the duel
    let embed = new Discord.MessageEmbed()
        .setTitle(`${message.member.user.username} has challenged ${rMember.user.username}!`)
        .setDescription(`${coinsToTake} pokecoins are on the line: \n Select the move you would like to use!`)
        .addFields(
            {name: 'Move', value: `1. ${moves[moveNum.first].move} \n 2. ${moves[moveNum.second].move} \n 3. ${moves[moveNum.third].move} \n 4. ${moves[moveNum.fourth].move}`, inline:true},
            {name: 'Type', value: `${moves[moveNum.first].type} \n ${moves[moveNum.second].type} \n ${moves[moveNum.third].type} \n ${moves[moveNum.fourth].type}`, inline:true},
            {name: `Power \t Accuracy`, value: `${moves[moveNum.first].power}${space}${moves[moveNum.first].acc} \n ${moves[moveNum.second].power}${space}${moves[moveNum.second].acc} \n ${moves[moveNum.third].power}${space}${moves[moveNum.third].acc} \n ${moves[moveNum.fourth].power}${space}${moves[moveNum.fourth].acc}`, inline:true},
            {name:'Health', value:`${bar[0]} \n ${bar[1]}/${total}`, inline:false}
        )
        .setColor(0x800080)
        .setTimestamp();


    message.channel.send({embeds: [embed]}).then(embedMessage => {
    
        battleBuildPlay(message, rMember, embedMessage, total, current, size, round, choiceMove, turnCPU, battleResponse, cpuHealth, coinsToTake);

    }); 
}
}