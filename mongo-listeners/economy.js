const mongo = require('@storage/mongo.js')
const profileSchema = require('@schemas/profile-schema.js')
const mongoose = require('mongoose')

const coinsCache = {} // guildID-userID: coins


module.exports.run = async (bot, message, args) => {

    

}

//Add number of coins based off arg
module.exports.addCoins = async (username, guildID, userID, coins) => {

    mongoose.set('useFindAndModify', false);
    
    //Look for user coins based off guild and user ID
    const result = await profileSchema.findOneAndUpdate(
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
                coins
            }    
        },
        {
            upsert: true,
            new: true
        })
    
    coinsCache[`${guildID}-${userID}`] = result.coins
    
    return result.coins
} 

//Return number of coins based off ID
module.exports.getCoins = async (username, guildID, userID) => {

    //check cache to see if we already know the users balance
    const cachedValue = coinsCache[`${guildID}-${userID}`]
    if(cachedValue){
        return cachedValue
    }

    //Look for user coins based off guild and user ID
    const result = await profileSchema.findOne({
        username, 
        guildID,
        userID
    })

    //Result of search
    let coins = 0

    //If coins are found use that value
    //If not then make a coin profile for the user
    if(result) {
        coins = result.coins
    }else {
        await new profileSchema({
            username, 
            guildID,
            userID,
            coins
        }).save()
    }

    //cache user data
    coinsCache[`${guildID}-${userID}`]

    return coins
}
