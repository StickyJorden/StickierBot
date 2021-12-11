module.exports = {
    name: "!volume",
    aliases: ["v", "set", "set-volume"],
    description: 'adjust the current song volume',
    inVoiceChannel: true,
    run: async (client, message, args) => {

        emotes = {"play": "▶️", "stop": "⏹️", "queue": "📄", "success": "☑️", "repeat": "🔁", "error": "❌"}

        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`${emotes.error} | There is nothing in the queue right now!`)
        const volume = parseInt(args[0])
        if (isNaN(volume)) return message.channel.send(`${emotes.error} | Please enter a valid number!`)
        client.distube.setVolume(message, volume)
        message.channel.send(`${emotes.success} | Volume set to \`${volume}\``)
    }
}