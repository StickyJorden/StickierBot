function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    name: "pick",
    alias: ["choose"],
    run: async (client, message, args) => { 

    if(!args[0]) return message.reply("I have nothing to choose from.");

    let choice = getRandomInt(args.length);

    message.channel.send(args[choice]);

    }
}