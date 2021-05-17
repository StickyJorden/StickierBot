//This program is not useful yet but it can be helpful in making user specific data on mongodb. In this case it only tracks messages each user has sent.

const mongo = require('C:/Users/bigbo/OneDrive/Desktop/StickierBot-jordan/util/mongo.js')
const messageCountSchema = require('C:/Users/bigbo/OneDrive/Desktop/StickierBot-jordan/schemas/message-count-schema.js')

module.exports.run = (bot) => {

    bot.on('message', async (message) => {

        const { author } = message
        const { id } = author

        await mongo().then(async (mongoose) => {

            mongoose.set('useFindAndModify', false);

            try{
                await messageCountSchema.findOneAndUpdate(
                    {
                    _id: id
                    },
                    {
                       $inc: 
                       {
                            messageCount: 1,
                       },     
                    },
                    {
                        upsert: true,
                    }
                ).exec()
            }finally{
                mongoose.connection.close()
            }
        })
    })

}
  