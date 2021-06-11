const mongo = require('@storage/mongo.js')
const animalSchema = require('@schemas/animal-schema.js')
const mongoose = require('mongoose')

const animalCache = {} // guildID-userID: coins


module.exports.run = async (bot, message, args) => {

    

}

//Add number of coins based off arg
module.exports.addPet = async (username, guildID, userID, animal, name) => {

    mongoose.set('useFindAndModify', false);
    
    //Look for user coins based off guild and user ID
    const result = await animalSchema.findOneAndUpdate(
        {
            username,
            guildID,
            userID
        },
        {
            username,
            guildID,
            userID,
            animal,
            name
        },
        {
            upsert: true,
            new: true
        })
    
    animalCache[`${guildID}-${userID}`] = result
    
    return result
} 

//Return number of coins based off ID
module.exports.getPet = async (username, guildID, userID) => {

    //check cache to see if we already know the users balance
    const cachedValue = animalCache[`${guildID}-${userID}`]
    if(cachedValue){
        return cachedValue
    }

    //Look for user coins based off guild and user ID
    const result = await animalSchema.findOne({
        username, 
        guildID,
        userID
    })

    //Result of search
    let animal = "no pet"
    let name = "no name"

    //If coins are found use that value
    //If not then make a coin profile for the user
    if(result) {
        animal = result.animal
    }else {
        await new animalSchema({
            username, 
            guildID,
            userID,
            animal,
            name
        }).save()
    }

    //cache user data
    animalCache[`${guildID}-${userID}`]

    return result
}
