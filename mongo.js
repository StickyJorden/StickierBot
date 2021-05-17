const mongoose = require('mongoose')
//const mongoPath = "mongodb://localhost:27017/StickierBot"

const mongoPath = 'mongodb+srv://StickierBot:VH3wsQiar8NPWVJ@stickier-bot.c0vgp.mongodb.net/StickyDatabase?retryWrites=true&w=majority'

//Connect with database
module.exports = async () => {

    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose

}