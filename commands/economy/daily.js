const dailyRewardsSchema = require('@schemas/daily-rewards-schema.js')
const economy = require('@listeners/economy.js'); 
const days = require('@listeners/day.js'); 
const Discord = require('discord.js'); 
const fs = require('fs');

//const line = `**\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF**`
const line = `**\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF**`
const coin =  '<a:COIN:854221264343138304>'
const bank = "<a:money_bag:854228919376543754>"
const dance = "<a:dance:835016357245485056>"

//We can call the JSON file for punishments
const streak = JSON.parse(fs.readFileSync('storage/streaks.json','utf8'));

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let claimedCache = []

const clearCache = () => {
    claimedCache = []
    setTimeout(clearCache, 1000 * 60 * 10) //cache cleared every 10 min
    
}
clearCache()

const alreadyClaimed = "You have already claimed your daily rewards."


module.exports = {
    name: "daily",
    alias: ["d"],
    run: async (client, message, args) => { 
   
        const {guild, member} = message
        const { id } = member
        let username = message.member.user.tag
        let guildID = guild.id
        let userID = id
        let dayCount = await days.getDays(username, guildID, userID)
        let bonus = false
     
        //If they completed the 6 day streak then reset the day counter and reward them/give them bonus
        if(dayCount > 5)
        {
            //add coins to mentioned user
            dayCount = await days.addDays(
                 username,
                 guildID,
                 userID,
                 -6
             )
        }
        else if(dayCount == 5)
        {
             bonus = true
        }
     
        //Find users coin balance
        const coins = await economy.getCoins(username, guild.id, id)
     
        //Update the counter for days left to complete
        let counter = 5 - dayCount
        let rewards = 0
     
        //Update how much they are getting from the daily rewards
        if(dayCount == 0)
        {
            rewards = 500
        }
        else
        {
            rewards = (dayCount+1) * 500
        }
       
        //Apply the bonus if they completed the streak
        if(bonus == true)
        {
            rewards = rewards * 100
            bonus = false
        }
     
        //Obj for user daily reward schema
        const obj = {
             username: message.member.user.tag,
             guildID: guild.id,
             userID: id,
         }
      
     
        //Check cache to see if the user already claimed
        if(claimedCache.includes(id)){
     
             if(dayCount == 0)
             {
                 dayCount = 0
             }
             else
             {
             dayCount--
             rewards-=500
             counter++
             }
     
             //Let user know that they got the goods.
             let embed = new Discord.MessageEmbed()
                 .setTitle(`Daily Rewards!`) 
                 .setDescription(`${alreadyClaimed} ${dance}`)
                 .addFields(
                     {name: `${line}`, value: `**Reward: \`+${numberWithCommas(rewards)} tokens\` ${coin}**`, inline: false},
                     {name: `**Balance: \`${numberWithCommas(coins)} tokens\` ${bank}**`, value: `${line}`, inline: false},
                     {name: `Daily Streak!`, value: `\`${counter}\` more claims to bonus!`, inline: false}
                     )
                 .setColor("#197419")
                 .setImage(`${streak[(dayCount)].link}`)
                 .setTimestamp();
     
             message.channel.send({embeds: [embed]});
             return
        }
        
        //look for user in schema
        const results = await dailyRewardsSchema.findOne(obj)
        
        //if bot restarts make sure the user cant reclaim rewards before 24 hours
        if(results){
     
             const then = new Date(results.updatedAt).getTime() //last time user got reward
             const now = new Date().getTime() //time at current moment 
     
             const diffTime = Math.abs(now - then)
             const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
     
             //Calculate time left until the next reward
             let timeHour = Math.abs(diffTime / (1000 * 60 * 60))
             let timeMin = Math.abs(diffTime / (1000 * 60))
     
             //console.log("timeHour: ", timeHour)
             //console.log("timeMin: ", timeMin)
     
             //Calculate time left
             let totalMin = 1440 - 60 * timeHour - timeMin
     
             let timeLeftHour = Math.round(Math.abs(totalMin / 60))
             //console.log("timeLeftHour:", timeLeftHour)
     
             let timeLeftMin = Math.round(Math.abs(totalMin % 60))
             //console.log("timeLeftMin: ", timeLeftMin)
             
     
             //If it has not been a full day yet do not give them the reward
             if (diffDays <= 1)
             {
                 if(dayCount == 0)
                 {
                     dayCount = 0
                 }
                 else
                 {
                 dayCount--
                 rewards-=500
                 counter++
                 }
                 //claimedCache.push(id)
                
                 //Let user know that they got the goods.
                 let embed = new Discord.MessageEmbed()
                     .setTitle(`Daily Rewards!`) 
                     .setDescription(`${alreadyClaimed} ${dance}`)
                     .addFields(
                         {name: `${line}`, value: `**Reward: \`+${numberWithCommas(rewards)} tokens\` ${coin}**`, inline: false},
                         {name: `**Balance: \`${numberWithCommas(coins)} tokens\` ${bank}**`, value: `${line}`, inline: false},
                         {name: `Daily Streak!`, value: `\`${counter}\` more claims to bonus!`, inline: false}
                         )
                     .setColor("#197419")
                     .setImage(`${streak[dayCount].link}`)
                     .setFooter(`${timeLeftHour} hour(s) ${timeLeftMin} min(s) until your next reward!`,"")
                     .setTimestamp();
                 message.channel.send({embeds: [embed]});
                 return
             }
             /*
             //If user hasnt keep streak then reset them
             if(diffDays >= 3)
             {
                 
                 //add coins to mentioned user
                 dayCount = await days.addDays(
                     username,
                     guildID,
                     userID,
                     -dayCount
                 )
     
                 rewards = (dayCount+1)*500
                 counter = 5 - dayCount
     
                 //add coins to mentioned user
                 const newDay = await days.addDays(
                     username,
                     guildID,
                     userID,
                     1
                 )
     
                 //Update the status that they got the reward
                 await dailyRewardsSchema.findOneAndUpdate(obj, obj, {upsert: true})
     
                 //Update cache so they cant claim again
                 //claimedCache.push(id)
     
                 //Update their balance with daily reward
                 const newBalance = await economy.addCoins(
                     username,
                     guild.id,
                     id,
                     rewards
                 )
     
                 //Let user know that they got the goods.
                 let embed = new Discord.MessageEmbed()
                     .setTitle(`Daily Rewards!`) 
                     .setDescription(`You claimed your daily reward. ${dance}`)
                     .addFields(
                         {name: `${line}`, value: `**Reward: \`+${numberWithCommas(rewards)} tokens\` ${coin}**`, inline: false},
                         {name: `**Balance: \`${numberWithCommas(newBalance)} tokens\` ${bank}**`, value: `${line}`, inline: false},
                         {name: `Daily Streak!`, value: `\`${counter}\` more claims to bonus!`, inline: false}
                         )
                     .setImage(`${streak[dayCount].link}`)
                     .setColor("#197419")
                     .setTimestamp();
     
                 message.channel.send({embeds: [embed]});
     
                 return
     
             }
             */
        }
        
        //add coins to mentioned user
        const newDay = await days.addDays(
             username,
             guildID,
             userID,
             1
         )
     
        //Update the status that they got the reward
        await dailyRewardsSchema.findOneAndUpdate(obj, obj, {upsert: true})
     
        //Update cache so they cant claim again
        //claimedCache.push(id)
     
        //Update their balance with daily reward
        const newBalance = await economy.addCoins(
             username,
             guild.id,
             id,
             rewards
         )
     
         //Let user know that they got the goods.
         let embed = new Discord.MessageEmbed()
             .setTitle(`Daily Rewards!`) 
             .setDescription(`You claimed your daily reward. ${dance}`)
             .addFields(
                 {name: `${line}`, value: `**Reward: \`+${numberWithCommas(rewards)} tokens\` ${coin}**`, inline: false},
                 {name: `**Balance: \`${numberWithCommas(newBalance)} tokens\` ${bank}**`, value: `${line}`, inline: false},
                 {name: `Daily Streak!`, value: `\`${counter}\` more claims to bonus!`, inline: false}
                 )
             .setImage(`${streak[dayCount].link}`)
             .setColor("#197419")
             .setTimestamp();
         
         message.channel.send({embeds: [embed]});
    }
}