const economy = require('@listeners/economy.js'); 
const Discord = require('discord.js'); 
const { SlashCommandBuilder } = require('@discordjs/builders');

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const line = `**\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF**`
const bank = "<a:money_bag:854228919376543754>"

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bal')
		.setDescription('show users balance'),
	async execute(interaction, message, args) {
		const user = message.mentions.users.first() || message.author
        const userID = user.id

        const guildID = message.guild.id
        const username = user.tag
        
        const coins = await economy.getCoins(username, guildID, userID)

        let embed = new Discord.MessageEmbed()
            .setTitle("Balance") 
            .addFields(
                {name: `${line}`, value: `**User: \`${username}\`**`, inline: false},
                {name: `**Balance: \`${numberWithCommas(coins)} tokens\` ${bank}**`, value: `${line}`, inline: false},
                )
            .setColor("#197419")
            .setTimestamp();
        
        message.channel.send({embed: embed});
	},
};
