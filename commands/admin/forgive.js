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
    name: "forgive",
    alias: [],
    description: 'remove timeout role from selected user',
    run: async (client, message, args) => { 

    //Make sure someone has been selected to be put in timeout
    if(!getUserFromMention(args[0])) return message.reply({content: "Please select someone to be put in timeout."});

    //Make sure the user has permissions to put someone else in timeout
    if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.channel.send({content: "You aren't sticky enough for that."});

    //Find the user to be put in timeout
    let rMember = message.mentions.members.first() || message.guild.members.fetch((args[0]));

    //If user is not found exit
    if(!rMember) return message.reply({content: "That user is not currently present. Find them."});

    //Role to be given
    let role = "Timeout";

    //If role is not mentioned exit
    if(!role) return message.reply({content: "I need a sticky role."})

    //Find the role
    let gRole = message.guild.roles.cache.find(x => x.name === role);

    //If role is not found exit
    if(!gRole) return message.reply({content: "That role does not exist."});

    //Remove role to the victum
    rMember.roles.remove(gRole.id);

    message.channel.send({content: `Congrats, you have lost the role ${gRole.name}!`})
    }
}