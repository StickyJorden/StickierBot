module.exports = {
    name: "!queue",
    aliases: ["q"],
    description: 'see the queue of songs',
    run: async (client, message, args) => {

        emotes = {"play": "▶️", "stop": "⏹️", "queue": "📄", "success": "☑️", "repeat": "🔁", "error": "❌"}
        
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`${emotes.error} | There is nothing playing!`)
        const q = queue.songs.map((song, i) => `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``).join("\n")
        message.channel.send(`${emotes.queue} | **Server Queue**\n${q}`)
    }
}