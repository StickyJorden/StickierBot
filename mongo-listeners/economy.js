const mongo = require('C:/Users/bigbo/OneDrive/Desktop/StickierBot-jordan/mongo.js')
const profileSchema = require('C:/Users/bigbo/OneDrive/Desktop/StickierBot-jordan/schemas/profile-schema.js')

const coinsCache = {} // guildID-userID: coins


module.exports.run = async (bot, message, args) => {

    

}

//Add number of coins based off arg
module.exports.addCoins = async (guildID, userID, coins) => {

    return await mongo().then(async mongoose => {

        mongoose.set('useFindAndModify', false);

        try{
            
            //Look for user coins based off guild and user ID
            const result = await profileSchema.findOneAndUpdate(
                {
                    guildID,
                    userID
                },
                {
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
        }finally{
            mongoose.connection.close()
        }
    })
} 

//Return number of coins based off ID
module.exports.getCoins = async (guildID, userID) => {

    //check cache to see if we already know the users balance
    const cachedValue = coinsCache[`${guildID}-${userID}`]
    if(cachedValue){
        return cachedValue
    }

    return await mongo().then(async mongoose => {
        try{
            
            //Look for user coins based off guild and user ID
            const result = await profileSchema.findOne({
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
                    guildID,
                    userID,
                    coins
                }).save()
            }

            //cache user data
            coinsCache[`${guildID}-${userID}`]

            return coins
        }finally{
            mongoose.connection.close()
        }
    })
}
