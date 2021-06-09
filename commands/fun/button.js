
const { MessageButton } = require('discord-buttons'); // Starting the discord-buttons class


module.exports.run = async (bot, message, args) => {

    let yes = new MessageButton()
        .setLabel("I like")
        .setStyle("blurple")
        .setID("like_button")

    message.channel.send('Pizza', yes);
}
