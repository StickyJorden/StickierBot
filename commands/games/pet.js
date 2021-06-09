const Discord = require('discord.js');
const fs = require('fs');

//We can call the JSON file for quotes
const animals = JSON.parse(fs.readFileSync('storage/animals.json','utf8'));

module.exports.run = async (bot, message, args) => {

    //number of quotes in JSON file quotes
    var count = Object.keys(animals).length; 

    //Get info on user looking to use their pet
    const {guild, member} = message 

    //Find the message user to check their balance for buying a pet
    let username = message.member.user.tag
    let guildID = guild.id
    let userID = member.id
    
    //Show list of possible pets to own
    if(args[0] == "list")
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Pet") 
            .setDescription(`To buy a pet, use \`!pet [pet name]\``)
            .addFields(
                {name: '**Stickier Pet Store**', value: '**Dragon🐉** \nNot for sale\n **Dog🐕** \n*💸10,000*\n **Deer🦌** \n*💸5,000*\n', inline: false},
            )
            .setColor("#FF00FF")
            .setTimestamp();

        message.channel.send(embed)
    }
    else
    {
        //See if user is looking to buy a pet
        for(let position = 0; position < count; ++position)
        {
            //See what name of the animal they are trying to buy
            if(args[0] == animals[position].name)
            {

                message.channel.send("Here you go!")
                
                /*
                //Get balance
                const coinsOwned = await economy.getCoins(username, guildID, userID)

                //Make sure they can afford to pay
                if(coinsOwned < coinsToGive || coinsToGive <= 0)
                {
                    let embed = new Discord.MessageEmbed()
                        .setTitle("Pay") 
                        .setDescription(`You do not have ${numberWithCommas(coinsToGive)} coins!`)
                        .setColor("#197419")
                        .setTimestamp();
                
                    message.channel.send(embed);
                    return
                }

                //Take coins away from message user
                const remainingCoins = await economy.addCoins(
                    username,
                    guildID,
                    userID,
                    coinsToGive * -1
                )
                */



            }
            else if((position+1) == count)
            {
                message.channel.send("we aint got it chief")
            }
        }
    }
}
