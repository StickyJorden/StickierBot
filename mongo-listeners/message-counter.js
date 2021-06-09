//This program is not useful yet but it can be helpful in making user specific data on mongodb. In this case it only tracks messages each user has sent.

const mongo = require('@storage/mongo.js')
const profileSchema = require('@schemas/message-count-schema.js');
const mongoose = require('mongoose')

module.exports.run = (bot) => {

    bot.on('message', async (message) => {

        const { author } = message
        const { id } = author

        mongoose.set('useFindAndModify', false);

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
    })

}
  