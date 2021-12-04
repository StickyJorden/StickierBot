
const Discord = require('discord.js')
const momentTimezone = require('moment-timezone');
const scheduleSchema = require('../../schemas/schedule-message-schema');
var Cataas = require('cataas-api')
var cataas = new Cataas()



//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    name: "remind",
    alias: [""],
    run: async (client, message, args) => { 

        if(message.author.id != 338544317427875851)
        {
            return  message.channel.send({content: "You aren't sticky enough for that."});
        }

        const { mentions, guild, channel } = message
        
        const targetChannel = 890807425865777175

        let date =  "2021-10-22"
        const time = "09:00", clockType = "AM", timeZone = "America/Chicago"

        const targetDate = momentTimezone.tz(
            `${date} ${time} ${clockType}`,
            'YYYY-MM-DD HH:mm A',
            timeZone
        )

        message.channel.send("Your daily reminder has been set!")

        let response = await cataas.getCats(['cute'], {Limit: 85});
    
        let image = 'https://cataas.com/cat/' + response[getRandomInt(85)].id

        let embed = new Discord.MessageEmbed()
            .setTitle("I love you very much!")
            .setDescription(`Please remember to take your medicine.`)
            .setColor("RANDOM")
            .setThumbnail(image);

        await new scheduleSchema({
            date: targetDate.valueOf(),
            content: embed,
            guildId: guild.id,
            channelId: targetChannel
        }).save()
    }
}