const { MessageActionRow, MessageButton } = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs');
const progressbar = require('string-progressbar');
const economy = require('@listeners/economy.js'); 


//Pokemon Moves
const moves = JSON.parse(fs.readFileSync('storage/moves.json','utf8'));
//Trainer Names
const names = JSON.parse(fs.readFileSync('storage/names.json','utf8'));
//Trainer Classes
const classes = JSON.parse(fs.readFileSync('storage/trainerClasses.json','utf8'));

//If everything checks out begin
//maxMoves number of moves in JSON file moves
const maxMoves = Object.keys(moves).length;
const maxNames = Object.keys(names).length;
const maxClasses = Object.keys(classes).length;

//Function to get random number with the maxMoves being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

function setMoves()
{
     //Get random numbers to get random move type
     let moveOne = getRandomInt(maxMoves);
     let moveTwo = getRandomInt(maxMoves);
     let moveThree = getRandomInt(maxMoves);
     let moveFour = getRandomInt(maxMoves);
     

     //Make sure each of the selected moves are of a different type
    while(moves[moveOne].type == moves[moveTwo].type || moves[moveTwo].type == moves[moveThree].type || moves[moveThree].type == moves[moveFour].type || moves[moveFour].type == moves[moveOne].type || moves[moveFour].type == moves[moveTwo].type || moves[moveOne].type == moves[moveThree].type)
    {
        if(moves[moveOne].type == moves[moveTwo].type)
        {
        moveTwo = getRandomInt(maxMoves);
        }
        if(moves[moveTwo].type == moves[moveThree].type)
        {
        moveThree = getRandomInt(maxMoves);
        }
        if(moves[moveThree].type == moves[moveFour].type)
        {
        moveFour = getRandomInt(maxMoves);
        }
        if(moves[moveFour].type == moves[moveOne].type)
        {
        moveOne = getRandomInt(maxMoves);
        }
        if(moves[moveTwo].type == moves[moveFour].type)
        {
        moveTwo = getRandomInt(maxMoves);
        }
        if(moves[moveOne].type == moves[moveThree].type)
        {
        moveThree = getRandomInt(maxMoves);
        }
    }

    let moveOneButton = new MessageButton()
        .setStyle("PRIMARY")
        .setLabel(moves[moveOne].move)
        .setCustomId(moves[moveOne].move);
    
    let moveTwoButton = new MessageButton()
        .setStyle("PRIMARY")
        .setLabel(moves[moveTwo].move)
        .setCustomId(moves[moveTwo].move);

    let moveThreeButton = new MessageButton()
        .setStyle("PRIMARY")
        .setLabel(moves[moveThree].move)
        .setCustomId(moves[moveThree].move);

    let moveFourButton = new MessageButton()
        .setStyle("PRIMARY")
        .setLabel(moves[moveFour].move)
        .setCustomId(moves[moveFour].move);            

    let row = new MessageActionRow()
        .addComponents(moveOneButton, moveTwoButton, moveThreeButton, moveFourButton);

    var move = {first: moveOne, second: moveTwo, third: moveThree, fourth: moveFour, row: row};      
    return move


}

function battleBuildPlay(interaction, total, current, size, round, choiceMove, battleResponse, cpuHealth, coinsToTake, client, moveNum, trainer)
{

    //If everything checks out begin
    let moveCPU = getRandomInt(maxMoves);
    let space = `\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0`;
    //var moveNum = setMoves()
    const coinsToGive = coinsToTake;

    if(!interaction.type) return 1;

    const filter = button => {
         button.deferUpdate();
         if(button.user.id === interaction.user.id) return true;
    }

    const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 15000 });

    //Wait for the user to react
    collector.on('end', async (button) => {

            if(!button) return true;

            let id = button.first().customId;
    
            //Read in which reaction was selected
            if (id === moves[moveNum.first].move) {
                choiceMove = moves[moveNum.first].move;
                choiceChart = moves[moveNum.first];
                choicePower = moves[moveNum.first].power;
            } 
            else if (id === moves[moveNum.second].move) {
                choiceMove = moves[moveNum.second].move;
                choiceChart = moves[moveNum.second];
                choicePower = moves[moveNum.second].power;
            }
            else if (id === moves[moveNum.third].move) {
                choiceMove = moves[moveNum.third].move;
                choiceChart = moves[moveNum.third];
                choicePower = moves[moveNum.third].power;
            }
            else if (id === moves[moveNum.fourth].move) {
                choiceMove = moves[moveNum.fourth].move;
                choiceChart = moves[moveNum.fourth];
                choicePower = moves[moveNum.fourth].power;
            }
            
            
            //Let the user know what move their opponet used 
            let turnCPU = `${trainer} used ${moves[moveCPU].move} \n **Type:** ${moves[moveCPU].type} **Power:** ${moves[moveCPU].power}`;

            //check if player fainted probably need to remove

            if(current > 0)
            {
                //Determine who won based off typing with a number breakdown/array in moves.json
                if(moves[moveCPU].chart[moves[moveCPU].order] == 0)
                {
                    battleResponse = `Your move does not effect the foe  `;
                    current = current - moves[moveCPU].power;
                }
                else if(moves[moveCPU].chart[moves[moveCPU].order] == 0.5)
                {
                    battleResponse = `Your move was not very effective...`;
                    current = current - moves[moveCPU].power;
                }
                else if(moves[moveCPU].chart[moves[moveCPU].order] == 1)
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
                else if(moves[moveCPU].chart[moves[moveCPU].order] == 2)
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
                    .setTitle(`${interaction.member.user.username} has challenged ${trainer}!`)
                    .setDescription(`${coinsToTake} pokecoins are on the line: \n ${turnCPU} \n ${battleResponse} \n   **Health:** ${cpuHealth}/100`)
                    .setColor(0x800080)
                    .addFields(
                        {name: 'Move', value: `1. ${moves[moveNum.first].move} \n 2. ${moves[moveNum.second].move} \n 3. ${moves[moveNum.third].move} \n 4. ${moves[moveNum.fourth].move}`, inline:true},
                        {name: 'Type', value: `${moves[moveNum.first].type} \n ${moves[moveNum.second].type} \n ${moves[moveNum.third].type} \n ${moves[moveNum.fourth].type}`, inline:true},
                        {name: `Power \t Accuracy`, value: `${moves[moveNum.first].power}${space}${moves[moveNum.first].acc} \n ${moves[moveNum.second].power}${space}${moves[moveNum.second].acc} \n ${moves[moveNum.third].power}${space}${moves[moveNum.third].acc} \n ${moves[moveNum.fourth].power}${space}${moves[moveNum.fourth].acc}`, inline:true},
                        {name:'Health', value:`${bar[0]} \n ${bar[1]}/${total}`, inline:false}
                    ) 
                    .setTimestamp();   

                await interaction.editReply({content: " ", embeds: [embed], components: [moveNum.row]}).then(embedMessage => {
    
                    battleBuildPlay(interaction, total, current, size, round, choiceMove, battleResponse, cpuHealth, coinsToTake, client, moveNum, trainer);
            
                }); 
            }
            //If the player wins
            else if(cpuHealth <= 0)
                {
                    let embed = new Discord.MessageEmbed() 
                    .setTitle(`${interaction.member.user.username} has challenged ${trainer}!`)
                    .setDescription(`${interaction.member.user.username} WON! \n You got ${coinsToTake} pokecoins. \n ${turnCPU} \n ${battleResponse} \n   **Health:** ${cpuHealth}/100`)
                    .addFields(
                        {name: 'Move', value: `1. ${moves[moveNum.first].move} \n 2. ${moves[moveNum.second].move} \n 3. ${moves[moveNum.third].move} \n 4. ${moves[moveNum.fourth].move}`, inline:true},
                        {name: 'Type', value: `${moves[moveNum.first].type} \n ${moves[moveNum.second].type} \n ${moves[moveNum.third].type} \n ${moves[moveNum.fourth].type}`, inline:true},
                        {name: `Power \t Accuracy`, value: `${moves[moveNum.first].power}${space}${moves[moveNum.first].acc} \n ${moves[moveNum.second].power}${space}${moves[moveNum.second].acc} \n ${moves[moveNum.third].power}${space}${moves[moveNum.third].acc} \n ${moves[moveNum.fourth].power}${space}${moves[moveNum.fourth].acc}`, inline:true},
                        {name:'Health', value:`${bar[0]} \n ${bar[1]}/${total}`, inline:false}
                    )
                    .setColor(0x800080)
                    .setTimestamp()   

                    await interaction.editReply({content: " ", embeds: [embed], components: []});

                    //Take coins away from who lost (challenger)
                    if(coinsToTake > 0)
                    {
                        const {guild, member} = interaction
                        let user = interaction.author
                        let username = interaction.member.user.tag
                        let guildID = guild.id
                        let userID = interaction.user.id

                        economy.addCoins(username, guildID, userID, coinsToGive)
                        
                        /*
                        user = rMember            
                        username = rMember.user.username                  
                        guildID = guild.id
                        userID = user.id                   

                        await economy.addCoins(username, guildID, userID, coinsToGive * -1)
                        */
                    }
                
                    return 0; 
                }
            //If the player loses
            else if(current <= 0)
                {
                 
                    bar = progressbar.filledBar(total, 0, size)
                    
                    let embed = new Discord.MessageEmbed() 
                        .setTitle(`${interaction.member.user.username} has challenged ${trainer}!`)
                        .setDescription(`${interaction.member.user.username} LOST! \n You paid ${coinsToTake} pokecoins. \n ${turnCPU} \n ${battleResponse} \n   **Health:** ${cpuHealth}/100`)
                        .addFields(
                            {name: 'Move', value: `1. ${moves[moveNum.first].move} \n 2. ${moves[moveNum.second].move} \n 3. ${moves[moveNum.third].move} \n 4. ${moves[moveNum.fourth].move}`, inline:true},
                            {name: 'Type', value: `${moves[moveNum.first].type} \n ${moves[moveNum.second].type} \n ${moves[moveNum.third].type} \n ${moves[moveNum.fourth].type}`, inline:true},
                            {name: `Power \t Accuracy`, value: `${moves[moveNum.first].power}${space}${moves[moveNum.first].acc} \n ${moves[moveNum.second].power}${space}${moves[moveNum.second].acc} \n ${moves[moveNum.third].power}${space}${moves[moveNum.third].acc} \n ${moves[moveNum.fourth].power}${space}${moves[moveNum.fourth].acc}`, inline:true},
                            {name:'Health', value:`${bar[0]} \n ${bar[1]}/${total}`, inline:false}
                        )
                        .setColor(0x800080)
                        .setTimestamp()   

          
                        await interaction.editReply({content: " ", embeds: [embed], components: []});

                      
                    //Take coins away from who lost (challenger)
                    if(coinsToTake > 0)
                    {
                        const {guild, member} = interaction
                        let user = interaction.author
                        let username = interaction.member.user.tag
                        let guildID = guild.id
                        let userID = interaction.user.id

                      
                        economy.addCoins(username, guildID, userID, coinsToGive * -1)
                    }
                    return 0;
                }
            }
        });
}


module.exports = {
	name: 'duel', 
	description: 'have a pokemon duel',
	type: 'CHAT_INPUT',
	async execute(client, interaction, args) {

        let coinsToTake = 1
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
        let trainer = `${classes[getRandomInt(maxClasses)].class} ${names[getRandomInt(maxNames)].name}`
    
        //Build the embed for the user who started the duel
        let embed = new Discord.MessageEmbed()
            .setTitle(`${interaction.member.user.username} has challenged ${trainer}!`)
            .setDescription(`Select the move you would like to use!`)
            .addFields(
                {name: 'Move', value: `1. ${moves[moveNum.first].move} \n 2. ${moves[moveNum.second].move} \n 3. ${moves[moveNum.third].move} \n 4. ${moves[moveNum.fourth].move}`, inline:true},
                {name: 'Type', value: `${moves[moveNum.first].type} \n ${moves[moveNum.second].type} \n ${moves[moveNum.third].type} \n ${moves[moveNum.fourth].type}`, inline:true},
                {name: `Power \t Accuracy`, value: `${moves[moveNum.first].power}${space}${moves[moveNum.first].acc} \n ${moves[moveNum.second].power}${space}${moves[moveNum.second].acc} \n ${moves[moveNum.third].power}${space}${moves[moveNum.third].acc} \n ${moves[moveNum.fourth].power}${space}${moves[moveNum.fourth].acc}`, inline:true},
                {name:'Health', value:`${bar[0]} \n ${bar[1]}/${total}`, inline:false}
            )
            .setColor(0x800080)
            .setTimestamp();
    
        /*
        await interaction.followUp({content: " ", embed: embed, components: moveNum.row}).then(embedMessage => {
        
            battleBuildPlay(interaction, total, current, size, round, choiceMove, battleResponse, cpuHealth, coinsToTake, client, moveNum);
    
        });
        */ 

        await interaction.followUp({content: " ", embeds: [embed], components: [moveNum.row]}).then(embedMessage => {
        
            battleBuildPlay(interaction, total, current, size, round, choiceMove, battleResponse, cpuHealth, coinsToTake, client, moveNum, trainer);
    
        });
	},
};

  