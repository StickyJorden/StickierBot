const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: "video",
    alias: [],
    run: async (client, message, args) => { 

    if(!message.member.voice.channel) return message.channel.send("You must be in a voice channel to use this commmand.")
        
    let channel = message.member.voice.channel;

    fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
            max_age: 86400,
            max_uses: 0,
            target_application_id: "755600276941176913",
            target_type: 2,
            temporary: false,
            validate: null
        }),
        headers: {
            "Authorization": `Bot ${client.token}`,
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
    .then(invite => {
        if(!invite.code) return message.channel.send("I cannot start youtube together")

        const embed = new Discord.MessageEmbed()
            .setDescription(`[Click Me](https://discord.com/invite/${invite.code})`);

        message.channel.send({embeds: [embed]}); 

    })
}
}

