const Discord = require('discord.js');

exports.run = (bot, message, args, func) => {

  if(!args[0]) return message.reply("Please select someone to face the wheel of punishment.");

  let replies = ["Bed of nails","Whipping post","Boiled in oil","Eaten by shark","Razor pit", "Mauled by platypus bear", "Burned alive", "Community Service"];
  let images = ["./images/wopPins.png", "./images/wopPole.png", "./images/wopOil.png", "./images/wopShark.png", "./images/wopPit.png", "./images/wopBear.png", "./images/wopStake.png", "./images/wopCom.png"];

  let result = Math.floor((Math.random() * replies.length));

  let victum = args.slice(0).join(" ");

  const attachment = new Discord.Attachment(images[result], 'wopPins.png');

  let ballembed = new Discord.MessageEmbed()
    .setTitle("Wheel of Punishment")
    .setColor("#FF990")
    .addField("Victum ", victum)
    .addField("Sentence ", replies[result])
    .attachFile(attachment)
    .setImage('attachment://wopPins.png');

  message.channel.send(ballembed);
}
