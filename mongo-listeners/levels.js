const mongo = require('@storage/mongo.js')
const profileSchema = require('@schemas/profile-schema.js');

module.exports.run = (bot) => {
   
    bot.on('message', async (message) => {
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

    await mongo().then(async (mongoose) =>{

        //Prevents warning
        mongoose.set('useFindAndModify', false);
        
        //find users xp and level or create one for the user
        try{
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
            
        //Close connection    
        }finally{
            mongoose.connection.close()
        }
    })
}

module.exports.addXP = addXP