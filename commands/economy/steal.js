const mongo = require('@storage/mongo.js')
const dailyStealsSchema = require('@schemas/daily-steals-schema.js')
const economy = require('@listeners/economy.js'); 

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
    message.reply(alreadyClaimed)
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
                message.reply(alreadyClaimed)
                return
            }
    }

    

    //If user is not found yell at them
    if(!user)
    {
        message.reply("We gonna do this or what!? I need a name. Usage !user <user> <amount>")
        return
    }

    //Make sure we get a useable amount
    const coinsToTake = args[1]
    if(isNaN(coinsToTake))
    {
        message.reply('What are you on? How much we takin?? Usage !steal <user> <amount>')
        return
    }

    //Make sure user doesnt take too much!
    if(coinsToTake > 10)
    {
        message.reply('Thats too big for a two man job! (Max you can take is 10 coins)')
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
        message.reply(`The jig is up they only have ${coinsOwned} coins!`)
        return
    }

    if(odds <= 3)
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
        console.log(username)
        guildID = guild.id
        userID = member.id

        //Add stolen coins to their balance
        const newBalance = await economy.addCoins(
            username,
            guildID,
            userID,
            coinsToTake
        )

        message.reply(`You have stolen <@${user.id}> ${coinsToTake} coins! They now have ${newBalance} coins and you have ${remainingCoins} coins!`)

        //Update the status that they got the reward
        await dailyStealsSchema.findOneAndUpdate(obj, obj, {upsert: true})

        //Update cache so they cant claim again
        claimedCache.push(id)
    }
    else if(odds >=4)
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
        console.log(username)
        guildID = guild.id
        userID = member.id

        //Take stolen coins from their balance
        const newBalance = await economy.addCoins(
            username,
            guildID,
            userID,
            coinsToTake * -1
        )

        message.reply(`You got busted! The sticky authorties have confiscated your coins! With the legal fees you now have ${newBalance} coins and they have ${remainingCoins} coins!`)

        //Update the status that they got the reward
        await dailyStealsSchema.findOneAndUpdate(obj, obj, {upsert: true})

        //Update cache so they cant claim again
        claimedCache.push(id)
    }
}