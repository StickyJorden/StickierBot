const mongoose = require('mongoose')

const reqString = {
    type:String,
    required: true
}

const dailyRewardsSchema = mongoose.Schema(
    {
        username: reqString,
        guildID: reqString,
        userID: reqString,
        day: {
            type:Number,
            default: 0 
        }
    }, 
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('daily-rewards', dailyRewardsSchema)