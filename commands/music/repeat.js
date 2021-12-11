module.exports = {
    name: "!repeat",
    aliases: ["loop", "rp"],
    description: 'loop the current song',
    inVoiceChannel: true,
    run: async (client, message, args) => {

        emotes = {"play": "▶️", "stop": "⏹️", "queue": "📄", "success": "☑️", "repeat": "🔁", "error": "❌"}

        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`${emotes.error} | There is nothing playing!`)
        let mode = null
        switch (args[0]) {
            case "off":
                mode = 0
                break
            case "song":
                mode = 1
                break
            case "queue":
                mode = 2
                break
        }
        mode = client.distube.setRepeatMode(message, mode)
        mode = mode ? mode === 2 ? "Repeat queue" : "Repeat song" : "Off"
        message.channel.send(`${emotes.repeat} | Set repeat mode to \`${mode}\``)
    }
}