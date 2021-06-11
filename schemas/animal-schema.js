const mongoose = require('mongoose')

const reqString = {
    type:String,
    required: true
}

const animalSchema = mongoose.Schema({
    //User ID
    username: reqString,
    guildID: reqString,
    userID: reqString,
    animal: {
        type: String,
        default: "no pet"
    },
    name: {
        type: String,
        default: "no name"
    }
})

module.exports = mongoose.model('animals', animalSchema)