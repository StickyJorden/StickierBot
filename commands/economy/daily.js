const dailyRewardsSchema = require('@schemas/daily-rewards-schema.js')
const economy = require('@listeners/economy.js'); 
const days = require('@listeners/day.js'); 
const Discord = require('discord.js'); 
const fs = require('fs');

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


module.exports.run = async (bot, message, args) => {
   
   const {guild, member} = message
   const { id } = member
   let username = message.member.user.tag
   let guildID = guild.id
   let userID = id
   const line = `**\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF**`
   const coin =  '<a:COIN:854221264343138304>'
   const bank = "<a:money_bag:854228919376543754>"
   let dayCount = await days.getDays(username, guildID, userID)
   let bonus = false

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
   let counter = 5 - dayCount
   let rewards = (dayCount+1)*50

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

   /*
   if(claimedCache.includes(id)){

        //Let user know that they got the goods.
        let embed = new Discord.MessageEmbed()
            .setTitle("Daily Rewards!") 
            .setDescription(`${alreadyClaimed} ❌`)
            .addFields(
                {name: `${line}`, value: `**Reward: \`+${numberWithCommas(rewards)} tokens\` ${coin}**`, inline: false},
                {name: `**Balance: \`${numberWithCommas(coins)} tokens\` ${bank}**`, value: `${line}`, inline: false},
                {name: `Daily Streak!`, value: `\`${counter}\` more claims to bonus!`, inline: false}
                )
            .setColor("#197419")
            .setImage(`${streak[dayCount].link}`)
            .setTimestamp();

        message.channel.send(embed);
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

        if (diffDays <= 1)
        {
            claimedCache.push(id)


            //Let user know that they got the goods.
            let embed = new Discord.MessageEmbed()
                .setTitle("Daily Rewards!") 
                .setDescription(`${alreadyClaimed} ❌`)
                .addFields(
                    {name: `${line}`, value: `**Reward: \`+${numberWithCommas(rewards)} tokens\` ${coin}**`, inline: false},
                    {name: `**Balance: \`${numberWithCommas(coins)} tokens\` ${bank}**`, value: `${line}`, inline: false},
                    {name: `Daily Streak!`, value: `\`${counter}\` more claims to bonus!`, inline: false}
                    )
                .setColor("#197419")
                .setImage(`${streak[dayCount].link}`)
                .setTimestamp();
            message.channel.send(embed);
            return
        }
   }
   */
   
   

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
   claimedCache.push(id)

   //Update their balance with daily reward
   const newBalance = await economy.addCoins(
        username,
        guild.id,
        id,
        rewards
    )

    //Let user know that they got the goods.
    let embed = new Discord.MessageEmbed()
        .setTitle("Daily Rewards!") 
        .setDescription("You claimed your daily reward. ✔️")
        .addFields(
            {name: `${line}`, value: `**Reward: \`+${numberWithCommas(rewards)} tokens\` ${coin}**`, inline: false},
            {name: `**Balance: \`${numberWithCommas(newBalance)} tokens\` ${bank}**`, value: `${line}`, inline: false},
            {name: `Daily Streak!`, value: `\`${counter}\` more claims to bonus!`, inline: false}
            )
        .setImage(`${streak[dayCount].link}`)
        .setColor("#197419")
        .setTimestamp();
    
    message.channel.send(embed);

}