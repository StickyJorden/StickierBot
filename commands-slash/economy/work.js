const cooldown = new Set();
const Discord = require('discord.js');
const economy = require('@listeners/economy.js'); 

const jobs = ["Programmer", "Waiter", "Chef", "Mechanic", "Doctor", "Teacher", "Architect", "Accountant", "Postman", "Clown", "Magician", "Lifeguard", "Student"]

const badReport = ["You don't know how to program.", "You dropped a few orders.", "You set the kitchen on fire.", 
                    "You don't know how to drive.", "You forgot where the heart is.", "No one learned anything.", 
                    "The house was as sturdy as a house of cards.", "You don't know how to count.", "You forgot to deliever the packages.", 
                    "You are not a very good clown.", "You did not guess their card correctly.", "You let someone drown.", "You failed all your classes."]

const normReport = ["You managed to Google everything you needed.", "Another day another dollar.", "You made a great piece of toast.",
                    "You made some oil changes.", "You recommended rest and hydration.", "You taught a class in something.",
                    "You designed some homes.", "You looked at some charts.", "You delievered some mail.", "You made some balloon animals.",
                    "You pulled some rabbits out of a hat.", "You sat in the sun all day.", "You studied something."]

const goodReport = ["You developed a new programming language!", "You got a big tip!", "You cooked the finest Ratatouille! 5 stars!", 
                    "You fixed a car so good it can go underwater!", "You overcharged on some medicine!", "You taught a class on Thermodynamics!", "You designed a world wonder!",
                    "Your investments paid off!", "You delivered all the mail!", "You showed off your knownledge from Clown College University! #CCU",
                    "The tickets to your show sold out!", "You saved puppies from a river! National News!", "You cheated on your final! Easy A!"]

const coin =  '<a:COIN:854221264343138304>'
const bank = "<a:money_bag:854228919376543754>"
const dance = "<a:dance:835016357245485056>"
const line = `**\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF\u23AF**`

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('work for some tokens'),
	async execute(interaction, message, args) {
		if (cooldown.has(message.author.id)) {
            //Let user know that they got the goods.
            let embed = new Discord.MessageEmbed()
               .setTitle(`Work`) 
               .setDescription(`We'll call you when we need you. (Wait a minute before working again)`)
               .setColor("#7DF9FF")
               .setTimestamp();
   
           message.channel.send({embeds: [embed]});
       } else {
   
           // the user can type the command ... your command code goes here :)
           const {guild, member} = message
           const { id } = member
           let username = message.member.user.tag
   
           let report = "";
   
           const job = Math.floor(Math.random() * jobs.length)
           const payment = Math.floor(Math.random() * 209) + 1; 
   
   
           //Update their balance with daily reward
           const newBalance = await economy.addCoins(
               username,
               guild.id,
               id,
               payment
           )
   
           //Depending on how much they did their report of the day
           if(payment <= 70)
           {
               report = badReport[job]
           }
           else if(70 < payment && payment <= 140)
           {
               report = normReport[job]
           }
           else if(140 < payment && payment <= 211)
           {
               report = goodReport[job]
           }
           
           //Let user know that they got the goods.
           let embed = new Discord.MessageEmbed()
               .setTitle(`Work`) 
               .setDescription(`You worked as a **${jobs[job]}**!`)
               .addFields(
                   {name: `${line}`, value: `**Payment: \`+${numberWithCommas(payment)} tokens\` ${coin}**`, inline: false},
                   {name: `**Balance: \`${numberWithCommas(newBalance)} tokens\` ${bank}**`, value: `${line}`, inline: false},
                   {name: `Progress Report`, value: `${report}`, inline: false}
                   )
               .setColor("#7DF9FF")
               .setTimestamp();
   
           message.channel.send({embeds: [embed]});
           
           // Adds the user to the set so that they can't talk for a minute
           cooldown.add(message.author.id);
           setTimeout(() => {
           // Removes the user from the set after a minute
           cooldown.delete(message.author.id);
           }, 60000);
           
       }
	},
};
   