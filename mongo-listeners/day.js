const mongo = require('@storage/mongo.js')
const dailyRewardsSchema = require('@schemas/daily-rewards-schema.js')
const mongoose = require('mongoose')

const dayCache = {} // guildID-userID: day


module.exports.run = async (bot, message, args) => {

    

}

//Add number of day based off arg
module.exports.addDays = async (username, guildID, userID, day) => {

    mongoose.set('useFindAndModify', false);
    
    //Look for user day based off guild and user ID
    const result = await dailyRewardsSchema.findOneAndUpdate(
        {
            username,
            guildID,
            userID
        },
        {
            username,
            guildID,
            userID,
            $inc: {
                day
            }    
        },
        {
            upsert: true,
            new: true
        })
    
    dayCache[`${guildID}-${userID}`] = result.day
    
    return result.day
} 

//Return number of day based off ID
module.exports.getDays = async (username, guildID, userID) => {

    //check cache to see if we already know the users balance
    const cachedValue = dayCache[`${guildID}-${userID}`]
    
    if(cachedValue){
        return cachedValue
    }
    
    //Look for user day based off guild and user ID
    const result = await dailyRewardsSchema.findOne({
        username, 
        guildID,
        userID
    })

    //Result of search
    let day = 0

    //If day are found use that value
    //If not then make a coin profile for the user
    if(result) {
        day = result.day
    }else {
        await new dailyRewardsSchema({
            username, 
            guildID,
            userID,
            day
        }).save()
    }

    //cache user data
    dayCache[`${guildID}-${userID}`]

    return day
}
