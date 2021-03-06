const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {

    //Make sure someone has been selected to be put in timeout
    //if(!getUserFromMention(args[0])) return message.reply("Please select someone to be put in timeout.");

    //Make sure the user has permissions to put someone else in timeout
    if(!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("You aren't sticky enough for that.");

    //Find the user to be put in timeout
    var aMember = [ '213176827676590080',
                    '351095646796906497', 
                    '386588748365824010', 
                    '280276704411254784', 
                    '426990470674251788',
                    '309483414141140994',
                    '423837609081700352',
                    '324970235436204034'];
    var rMember;

    for(var i in aMember)
    {

        rMember = await message.guild.members.fetch(aMember[i]);
        //console.log(rMember);
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
        setTimeout(function(){},10000); 
    }

    //message.channel.send(`Congrats, you have been given the role ${gRole.name}!`)

    
}