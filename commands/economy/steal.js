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
   
   //Check if user already claimed daily reward
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
            .setDescription("We gonna do this or what!? I need a name. Usage !user <user> <amount>")
            .setColor("#197419")
            .setTimestamp();
    
        message.channel.send(embed);
        return
    }

    //Make sure we get a useable amount
    const coinsToTake = args[1]
    if(isNaN(coinsToTake))
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Steal") 
            .setDescription('What are you on? How much we takin?? Usage !steal <user> <amount>')
            .setColor("#197419")
            .setTimestamp();
    
        message.channel.send(embed);
        return
    }

    //Make sure they use whole numbers only
    if(coinsToTake % 1 != 0)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Add Balance") 
            .setDescription('Please whole numbers only. Usage !pay <user> <amount>')
            .setColor("#197419")
            .setTimestamp();
        
        message.channel.send(embed);
        return
    }
    
    //Make sure user doesnt take too much!
    if(coinsToTake > 500)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Steal") 
            .setDescription('Thats too big for a two man job! (Max you can take is 10 coins)')
            .setColor("#197419")
            .setTimestamp();

        message.channel.send(embed);
        return
    }
    //Make sure user does send negative money!
    else if(coinsToTake <= 0)
    {
        let embed = new Discord.MessageEmbed()
            .setTitle("Steal") 
            .setDescription('I think you might be looking for the charity command....')
            .setColor("#197419")
            .setTimestamp();

        message.channel.send(embed);
        return
    }

    const odds = getRandomInt(10)

    //Get the user to steal from info
    let username = user.tag
    let guildID = guild.id
    let userID = user.id

    

    //Make sure they have that much dough
    const coinsOwned = await economy.getCoins(username, guildID, userID)
    if(coinsOwned < coinsToTake)
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
    if(odds <= 2)
    {
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
            .setDescription(`You have stolen <@${user.id}> ${coinsToTake} coins! They now have ${numberWithCommas(newBalance)} coins and you have ${numberWithCommas(remainingCoins)} coins!`)
            .setColor("#197419")
            .setTimestamp();

        message.channel.send(embed);
        

        //Update the status that they got the reward
        //await dailyStealsSchema.findOneAndUpdate(obj, obj, {upsert: true})

        //Update cache so they cant claim again
        //claimedCache.push(id)
    }
    else if(odds >=3)
    {
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