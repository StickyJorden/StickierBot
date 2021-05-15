const mongoose = require('mongoose')

const reqString = {
    type:String,
    required: true
}

const profileSchema = mongoose.Schema({
    //User ID
    guildID: reqString,
    userID: reqString,
    //How many messages sent
    coins: {
        type:Number,
        required:true,
    }
})

module.exports = mongoose.model('profiles', profileSchema)