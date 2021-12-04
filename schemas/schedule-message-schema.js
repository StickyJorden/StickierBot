
const mongoose = require('mongoose')


const reqString = {
    type:String,
    required: true
}


const scheduleSchema = mongoose.Schema({
    //User ID
    date: {
        type: Date,
        required: true,
    },
    content: reqString,
    guildId: reqString,
    channelId: reqString
})

module.exports = mongoose.model('schedule-message', scheduleSchema)