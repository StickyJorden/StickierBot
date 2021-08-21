const { SlashCommandBuilder } = require('@discordjs/builders');

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
	data: new SlashCommandBuilder()
		.setName('rrole')
		.setDescription('remove a role from another user'),
	async execute(interaction, message, args) {
		//Make sure someone has been selected to be put in timeout
        //if(!getUserFromMention(args[0])) return message.reply("Please select someone to be put in timeout.");

        //Make sure the user has permissions to put someone else in timeout
        if(!message.member.permission.has('MANAGE_ROLES')) return message.channel.send({content: "You aren't sticky enough for that."});

        //Variable to whole role
        var wholeRole = "";

        //See if role is more that one word
        if(args[2] != undefined)
        {   
            //Loop to add each word into whole word
            for(var i in args)
            {
                //Skip arg 0 which is the @ user
                if(i == 0)
                {
                    continue;
                }
                //Add words together
                else if(i != 0)
                {
                    wholeRole = wholeRole + " " + args[i];
                }
            }
            //Get rid of first space
            wholeRole = wholeRole.substring(1);
        }   
        else
        {
            //If role is less than one word then add make it equal
            wholeRole = args[1];
        }

        //Make sure someone has been selected to be put in timeout
        if(!getUserFromMention(args[0])) return message.reply({content: "Please select someone to be given a new role."});

        //Make sure the user has permissions to put someone else in timeout
        if(!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send({content: "You aren't sticky enough for that."});

        //Find the user to be put in timeout
        let rMember = message.mentions.members.first() || message.guild.members.fetch((args[0]));

        //If user is not found exit
        if(!rMember) return message.reply({content: "That user is not currently present. Find them."});

        //Role to be given
        let role = wholeRole;

        //If role is not mentioned exit
        if(!role) return message.reply({content: "I need a sticky role."})

        //Find the role
        let gRole = message.guild.roles.cache.find(x => x.name === role);

        //If role is not found exit
        if(!gRole) return message.reply({content: "That role does not exist."});

        //Add role to the victum
        rMember.roles.remove(gRole.id); 
        
        message.channel.send({content: `Congrats, you have lost the role ${gRole.name}!`})
	},
};
