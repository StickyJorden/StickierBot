
const Discord = require('discord.js'); 

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const line = `**\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF**`
const bank = "<a:money_bag:854228919376543754>"

module.exports = {
    name: "justice",
    alias: [],
    description: 'check your balance',
    run: async (client, message, args) => { 
   
        const user = await client.users.cache.get('386588748365824010');
        const userID = user.id

        const guildID = message.guild.id
        const username = user.tag
        
        const coins = 0

        let embed = new Discord.MessageEmbed()
            .setTitle("Balance") 
            .addFields(
                {name: `${line}`, value: `**User: \`${username}\`**`, inline: false},
                {name: `**Balance: \`${numberWithCommas(coins)} tokens\` ${bank}**`, value: `${line}`, inline: false},
                )
            .setColor("#197419")
            .setTimestamp();
        
        message.channel.send({embeds: [embed]});
    }
}