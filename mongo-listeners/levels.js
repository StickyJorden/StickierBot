const mongo = require('@storage/mongo.js')
const profileSchema = require('@schemas/profile-schema.js');

const levelsCache = {} // guildID-userID: level

module.exports.run = (bot) => {
   
    bot.on('message', message => {
    const { guild, member} = message

    if(!message.member || message.member == null)
    {
        return
    }
    else
    {
        addXP(guild.id, member.id, 23, message)
    }
    
    })

}

//Find out how much xp until the next level
const getNeededXP = level => level * level * 100

const addXP = async (guildID, userID, xpToAdd, message) => {

    const result = await profileSchema.findOneAndUpdate(
        {
            guildID,
            userID
        },
        {
            guildID,
            userID,
            $inc: {
                xp: xpToAdd
            }
        },
        {
            upsert: true,
            new: true
        }
    )

    let { xp, level } = result
    const needed = getNeededXP(level)

    //If user levels up let them know
    if (xp >= needed)
    {
        ++level
        xp -= needed

        message.reply(`You are now level ${level} with ${xp} experience! You now need ${getNeededXP(level)} xp to level up again!`);

        await profileSchema.updateOne(
            {
                guildID,
                userID
            },
            {
                level,
                xp
            }
        )
    }
}

//Return number of levels based off ID
module.exports.getLevels = async (guildID, userID) => {

    //check cache to see if we already know the users balance
    const cachedValue = levelsCache[`${guildID}-${userID}`]
    if(cachedValue){
        return cachedValue
    }

    //Look for user levels based off guild and user ID
    const result = await profileSchema.findOne({
        guildID,
        userID
    })

    //Result of search
    let level = 0

    //If levels are found use that value
    //If not then make a coin profile for the user
    if(result) {
        level = result.level
    }else {
        await new profileSchema({
            guildID,
            userID,
            level
        }).save()
    }

    //cache user data
    levelsCache[`${guildID}-${userID}`]

    return level
}

module.exports.addXP = addXP