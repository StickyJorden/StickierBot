const animalSchema = require('@schemas/animal-schema.js')
const economy = require('@listeners/economy.js'); 
const animalStore = require('@listeners/animal.js'); 
const Discord = require('discord.js'); 


//We can call the JSON file for animals
const fs = require('fs');
const animals = JSON.parse(fs.readFileSync('storage/animals.json','utf8'));

//We can call the JSON file for names
const names = JSON.parse(fs.readFileSync('storage/names.json','utf8'));

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

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
    if(!args[0])
    {
        const result = await animalStore.getPet(username, guildID, userID)

        let pet = result.animal
        pet = (pet.charAt(0).toUpperCase() + pet.slice(1))
        let name = result.name

        //If the user doesnt have a pet tell them
        if(pet == "no pet")
        {
            let embed = new Discord.MessageEmbed()
                .setTitle("Pet") 
                .setDescription(`You don't have a pet! Use \`!pet list\` to see the pets`)
                .setColor("#FF00FF")
                .setTimestamp();

            message.channel.send(embed)
        }
        //If the user has a pet tell them
        else if(pet != "no pet")
        {
            let embed = new Discord.MessageEmbed()
                .setTitle("Pet") 
                .setDescription(`Your current pet is a ${pet} named ${name}.`)
                .setColor("#FF00FF")
                .setTimestamp();

            message.channel.send(embed)
        }
    }
    //Show list of possible pets to own
    else if(args[0] == "list")
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
        let lowerName = args[0].toLowerCase();
        //See if user is looking to buy a pet
        for(let position = 0; position < count; ++position)
        {
            //See what name of the animal they are trying to buy
            if(lowerName == animals[position].animal)
            {
                //Get balance
                const coinsOwned = await economy.getCoins(username, guildID, userID)
                let coinsToGive = animals[position].price

                //Make sure they can afford to pay
                if(coinsOwned < coinsToGive)
                {
                    let embed = new Discord.MessageEmbed()
                        .setTitle("Pet") 
                        .setDescription(`You do not have ${numberWithCommas(coinsToGive)} coins!`)
                        .setColor("#FF00FF")
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

                //Get the pet and name
                let animal = lowerName
                let name = names[getRandomInt(Object.keys(names).length)].name

                //Update the user profile with the new pet and name
                const result = await animalStore.addPet(username, guildID, userID, animal, name)

                //Let user know they got the pet
                let embed = new Discord.MessageEmbed()
                    .setTitle("Pet") 
                    .setDescription(`Congratulations`)
                    .addFields(
                        {name: '**Stickier Pet Store**', value: `You now have the pet ${result.animal} named ${result.name} treat it well!`, inline: false},
                    )
                    .setColor("#FF00FF")
                    .setTimestamp();

                message.channel.send(embed)

                break
                            
            }
            else if((position + 1) == count)
            {
                message.channel.send("we aint got it chief")
            }
        }
    }
}
