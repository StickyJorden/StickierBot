const mongo = require('@storage/mongo.js')
const profileSchema = require('@schemas/profile-schema.js');
const Discord = require('discord.js'); 
const mongoose = require('mongoose')

const levelsCache = {} // guildID-userID: level

module.exports.run = (bot) => {
   
    bot.on('message', message => {
    const { guild, member} = message
    const username = message.member.user.tag

    if(!message.member || message.member == null)
    {
        return
    }
    else
    {
        addXP(username, guild.id, member.id, 23, message)
    }
    
    })

}

//Find out how much xp until the next level
const getNeededXP = level => level * level * 100

const addXP = async (username, guildID, userID, xpToAdd, message) => {

    mongoose.set('useFindAndModify', false);
    
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

        let embed = new Discord.MessageEmbed()
            .setTitle("Level Up") 
            .setDescription(`You are now level ${level} with ${xp} experience! You now need ${getNeededXP(level)} xp to level up again!`)
            .setColor("#197419")
            .setTimestamp();
    
        message.channel.send(embed);

        await profileSchema.updateOne(
            {
                username,
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
module.exports.getLevels = async (username, guildID, userID) => {

    //check cache to see if we already know the users balance
    const cachedValue = levelsCache[`${guildID}-${userID}`]
    if(cachedValue){
        return cachedValue
    }

    //Look for user levels based off guild and user ID
    const result = await profileSchema.findOne({
        username,
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
            username,
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