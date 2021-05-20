const mongoose = require('mongoose')

const reqString = {
    type:String,
    required: true
}

const dailyStealsSchema = mongoose.Schema(
    {
        username: reqString,
        guildID: reqString,
        userID: reqString,
    }, 
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('daily-steals', dailyStealsSchema)