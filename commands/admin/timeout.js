const Discord = require('discord.js');
const { Permissions } = require('discord.js');

//Array to get user ID only
function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return mention;
	}
}

module.exports = {
    name: "timeout",
    alias: [],
    run: async (client, message, args) => { 

    //Make sure someone has been selected to be put in timeout
    if(!getUserFromMention(args[0])) return message.reply("Please select someone to be put in timeout.");

    //Make sure the user has permissions to put someone else in timeout
    if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.channel.send("You aren't sticky enough for that.");

    //Find the user to be put in timeout
    let rMember = message.mentions.members.first() || message.guild.members.fetch((args[0]));

    //If user is not found exit
    if(!rMember) return message.reply("That user is not currently present. Find them.");

    //Role to be given
    let role = "Timeout";

    //If role is not mentioned exit
    if(!role) return message.reply("I need a sticky role.")

    //Find the role
    let gRole = message.guild.roles.cache.find(x => x.name === role);

    //If role is not found exit
    if(!gRole) return message.reply("That role does not exist.");

    //Add role to the victum
    rMember.roles.add(gRole.id);

    message.channel.send(`Congrats, you have been given the role ${gRole.name}!`)
    }
}