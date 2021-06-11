const mongo = require('@storage/mongo.js')
const dailyStealsSchema = require('@schemas/daily-steals-schema.js')
const economy = require('@listeners/economy.js');
const Discord = require('discord.js'); 

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let claimedCache = []

const clearCache = () => {
    claimedCache = []
    setTimeout(clearCache, 1000 * 60 * 10) //cache cleared every 10 min
    
}
clearCache()

const alreadyClaimed = "Hey hey hey we gotta lay low. (You can only steal once per day)"

//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports.run = async (bot, message, args) => {
   
    //Get guild and member from message 
   const {guild, member} = message
   const { id } = member

   //Get the user mentioned
   const user = message.mentions.users.first()
   
   //Check if user already stolen from someone
   if(claimedCache.includes(id)){

        let embed = new Discord.MessageEmbed()
            .setTitle("Steal") 
            .setDescription(alreadyClaimed)
            .setColor("#197419")
            .setTimestamp();
        
        message.channel.send(embed);
        return
    }   

    //Obj for user daily reward schema
    const obj = {
        username: message.member.user.tag,
        guildID: guild.id,
        userID: id,
    }  
    
    //look for user in schema
    const results = await dailyStealsSchema.findOne(obj)

    //if bot restarts make sure the user cant reclaim steals before 24 hours
    if(results){
            const then = new Date(results.updatedAt).getTime() //last time user got reward
            const now = new Date().getTime() //time at current moment 

            const diffTime = Math.abs(now - then)
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays <= 1)
            {
                claimedCache.push(id)
               
                let embed = new Discord.MessageEmbed()
                    .setTitle("Steal") 
                    .setDescription(alreadyClaimed)
                    .setColor("#197419")
                    .setTimestamp();
            
                message.channel.send(embed);
                return
            }
    }

    //If user is not found yell at them
    if(!user)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Steal") 
            .setDescription("We gonna do this or what!? I need a name. Usage !user <user>")
            .setColor("#197419")
            .setTimestamp();
    
        message.channel.send(embed);
        return
    }

    //Find out the odds of success
    let odds = getRandomInt(9)
    odds = odds + 1

    //Get the user to steal from info
    let username = user.tag
    let guildID = guild.id
    let userID = user.id

    /*
    console.log("______________________")
    console.log("USER: ", username)
    console.log("GUILD: ", guildID)
    console.log("USER: ", userID)
    console.log("______________________")
    */

    

    //Make sure they have that much dough
    let coinsOwned = await economy.getCoins(username, guildID, userID)
    if(coinsOwned < 50)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Steal") 
            .setDescription(`The jig is up they only have ${numberWithCommas(coinsOwned)} coins!`)
            .setColor("#197419")
            .setTimestamp();

        message.channel.send(embed);
        return
    }

    //RNG To see if the win or not 
    //Small Cut
    if(odds == 7 || odds == 8)
    {

        //Take 10% of victums coins
        let coinsToTake = Math.ceil(coinsOwned * .001)


        //Take away their money
        const remainingCoins = await economy.addCoins(
            username,
            guildID,
            userID,
            coinsToTake * -1
        )

        //Get the theif user info
        username = message.member.user.tag
        guildID = guild.id
        userID = member.id

        //Add stolen coins to their balance
        const newBalance = await economy.addCoins(
            username,
            guildID,
            userID,
            coinsToTake
        )
        
        let embed = new Discord.MessageEmbed()
            .setTitle("Steal") 
            .setDescription(`You have stolen a SMALL cut of ${numberWithCommas(coinsToTake)} coins! You now have ${numberWithCommas(newBalance)} coins and they have ${numberWithCommas(remainingCoins)} coins!`)
            .setColor("#197419")
            .setTimestamp();

        message.channel.send(embed);
        

        //Update the status that they got the reward
        //await dailyStealsSchema.findOneAndUpdate(obj, obj, {upsert: true})

        //Update cache so they cant claim again
        //claimedCache.push(id)
    }
    //Nice cut
    else if(odds == 9)
    {
        //Take 20% of victums coins
        let coinsToTake = Math.ceil(coinsOwned * .005)

        //Take away their money
        const remainingCoins = await economy.addCoins(
            username,
            guildID,
            userID,
            coinsToTake * -1
        )

        //Get the theif user info
        username = message.member.user.tag
        guildID = guild.id
        userID = member.id

        //Add stolen coins to their balance
        const newBalance = await economy.addCoins(
            username,
            guildID,
            userID,
            coinsToTake
        )
        
        let embed = new Discord.MessageEmbed()
            .setTitle("Steal") 
            .setDescription(`You have stolen a NICE cut of ${numberWithCommas(coinsToTake)} coins! You now have ${numberWithCommas(newBalance)} coins and they have ${numberWithCommas(remainingCoins)} coins!`)
            .setColor("#197419")
            .setTimestamp();

        message.channel.send(embed);
    }
    //Motherload
    else if(odds == 10)
    {
        //Take 30% of victums coins
        let coinsToTake = Math.ceil(coinsOwned * .001)

        //Take away their money
        const remainingCoins = await economy.addCoins(
            username,
            guildID,
            userID,
            coinsToTake * -1
        )

        //Get the theif user info
        username = message.member.user.tag
        guildID = guild.id
        userID = member.id

        //Add stolen coins to their balance
        const newBalance = await economy.addCoins(
            username,
            guildID,
            userID,
            coinsToTake
        )
        
        let embed = new Discord.MessageEmbed()
            .setTitle("Steal") 
            .setDescription(`You have stolen the MOTHERLOAD cut of ${numberWithCommas(coinsToTake)} coins! You now have ${numberWithCommas(newBalance)} coins and they have ${numberWithCommas(remainingCoins)} coins!`)
            .setColor("#197419")
            .setTimestamp();

        message.channel.send(embed);
    }
    //They got caught
    else if(odds < 7)
    {

        //Get the theif user  info
        username = message.member.user.tag
        userID = member.id

        let coinsOwned = await economy.getCoins(username, guildID, userID)

        //Take 10% of victums coins
        let coinsToTake = Math.ceil(coinsOwned * .05)

        console.log(coinsToTake)

        username = user.tag
        userID = user.id

        //Take away their money
        const remainingCoins = await economy.addCoins(
            username,
            guildID,
            userID,
            coinsToTake
        )



        //Get the theif user  info
        username = message.member.user.tag
        guildID = guild.id
        userID = member.id

        console.log("______________________")
        console.log("USER: ", username)
        console.log("GUILD: ", guildID)
        console.log("USER: ", userID)
        console.log("______________________")

        //Take stolen coins from their balance
        const newBalance = await economy.addCoins(
            username,
            guildID,
            userID,
            coinsToTake * -1
        )

        let embed = new Discord.MessageEmbed()
            .setTitle("Steal") 
            .setDescription(`You got busted! The sticky authorties have confiscated your coins! With the legal fees you now have ${numberWithCommas(newBalance)} coins and they have ${numberWithCommas(remainingCoins)} coins!`)
            .setColor("#197419")
            .setTimestamp();

        message.channel.send(embed);

        //Update the status that they got the reward
        //await dailyStealsSchema.findOneAndUpdate(obj, obj, {upsert: true})

        //Update cache so they cant claim again
        //claimedCache.push(id)
    }
}