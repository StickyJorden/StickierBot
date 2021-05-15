const { Guild } = require('discord.js')
const mongo = require('C:/Users/bigbo/OneDrive/Desktop/StickierBot-jordan/mongo.js')
const welcomeSchema = require('C:/Users/bigbo/OneDrive/Desktop/StickierBot-jordan/schemas/welcome-schema.js')

module.exports.run = async (bot, message, args) => {

    const cache = {} // guildId: [channelId, text]

    //If user not an admin tell them no
    if(!message.member.hasPermission('ADMINISTRATOR')){
        message.channel.send("You aren't sticky enough for that yo.")
        return
    }

    //Make sure we have data to enter into the database
    if(!args[0]) return message.reply("Provide a message silly.");

    //Cut off prefix and command
    let text = message.content.slice(9)

    cache[message.guild.id] = [message.channel.id, text]
    
    //Establish connection with database
    //Add contents to database, if the contents already exists update
    //Close connection 
    await mongo().then(async (mongoose) => {
        try{
            await welcomeSchema.findOneAndUpdate(
                {
                    _id: message.guild.id
                }, 
                {
                    _id: message.guild.id,
                    channelId: message.channel.id,
                    text,
                }, 
                {
                    upsert: true
                }
            )
        }finally{
            mongoose.connection.close()
        }
    })

    const onJoin = async member => {
        const {guild} = member
        
        let data = cache[message.guild.id]
        if(!data)
        {
            console.log('FETCHING FROM DATABASE')

            await mongo().then(async mongoose => {
                try{
                    const result = await welcomeSchema.findOne({ _id: guild.id})

                    cache[message.guild.id] = data = [result.channelId, result.text]
                }finally{
                    mongoose.connection.close()
                }
            })
        }

        const channelId = data[0]
        const text = data[1]

        const channel = guild.channels.cache.get(channelId)
        message.channel.send(text)
    }

    bot.on('guildMemberAdd', member => {
        onJoin(member)
    })

}
  