module.exports = {
    name: "play",
    alias: [],
    run: async (client, message, args) => { 

    if(!message.member.voice.channel) return message.channel.send({content: "You must be in a voice channel to use this commmand."})

    if(!args[0]) return message.channel.send({content: "What song should I play?"});

    const music = args.join(" ");

    await client.distube.play(message, music);
    }
}
