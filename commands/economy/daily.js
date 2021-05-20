const mongo = require('@storage/mongo.js')
const dailyRewardsSchema = require('@schemas/daily-rewards-schema.js')
const economy = require('@listeners/economy.js'); 

let claimedCache = []

const clearCache = () => {
    claimedCache = []
    setTimeout(clearCache, 1000 * 60 * 10) //cache cleared every 10 min
    
}
clearCache()

const alreadyClaimed = "You have already claimed your daily rewards."


module.exports.run = async (bot, message, args) => {
   
   const {guild, member} = message
   const { id } = member
   let username = message.member.user.tag


   //Check if user already claimed daily reward
   if(claimedCache.includes(id)){
        message.reply(alreadyClaimed)
        return
   }

   //Obj for user daily reward schema
   const obj = {
       username: message.member.user.tag,
       guildID: guild.id,
       userID: id,
   }

   //look for user in schema
   const results = await dailyRewardsSchema.findOne(obj)

   //if bot restarts make sure the user cant reclaim rewards before 24 hours
   if(results){
        const then = new Date(results.updatedAt).getTime() //last time user got reward
        const now = new Date().getTime() //time at current moment 

        const diffTime = Math.abs(now - then)
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays <= 1)
        {
            claimedCache.push(id)
            message.reply(alreadyClaimed)
            return
        }
   }

   //Update the status that they got the reward
   await dailyRewardsSchema.findOneAndUpdate(obj, obj, {upsert: true})

   //Update cache so they cant claim again
   claimedCache.push(id)

   //Find users coin balance
   const coins = await economy.getCoins(username, guild.id, id)

   //Update their balance with daily reward
   const newBalance = await economy.addCoins(
        username,
        guild.id,
        id,
        50
    )

    //Let user know that they got the goods.
    message.reply(`You have claimed your daily rewards of 50 coins! You new balance is ${newBalance}`)

}