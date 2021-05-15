const mongoose = require('mongoose')
const mongoPath = "mongodb://localhost:27017/StickierBot"

//Connect with database
module.exports = async () => {

    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose

}