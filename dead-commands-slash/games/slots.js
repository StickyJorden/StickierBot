const Discord = require('discord.js');
const economy = require('@listeners/economy.js'); 


//Function to get random number with the max being the total number of quotes in JSON file
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

//Add commas to numbers(we use this for the balance of users)
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Find the min of three number(we use this to find the multiplier)
function minimum3(num1, num2, num3) {
  return Math.min(num1, num2, num3);
}

module.exports = {
	name: 'slots', 
    description: 'play the slot machine',
	async execute(client, interaction, args) {
		 //Make sure the user gives us either the table or money to gamble with
     if(!args[0]) return message.reply({content: 'You need to bet something or use `!slots table` to see the odds of winning.'});

     //Show the odds of winning table
     if(args[0] == "table")
     {
         let embed = new Discord.MessageEmbed()
           .setColor(000000)
           .setDescription(`**ICON** - **MULTIPLIER** \n\n 🤡🤡 -1x \n 💥💥 - 1x \n 🎉🎉 - 2x \n 💎💎💎 - 3x \n ${"<a:dance:835016357245485056>"}${"<a:dance:835016357245485056>"}${"<a:dance:835016357245485056>"} - 5x \n 🍉🍉🍉 -10x `);
   
         message.channel.send({embeds: [embed]})
     }
     //If the user submits a whole number play the game
     else if(!isNaN(args[0]) && args[0] % 1 == 0 && args[0] > 0)
     {
         //Instance Variables
         const {guild, member} = message
         const { id } = member
         let username = message.member.user.tag
         let guildID = guild.id
         let userID = id
   
         //Emojis and Multipliers for slots
         const slots = ["🤡","💥", "🎉", "💎", `${"<a:dance:835016357245485056>"}`, `🍉`]; 
         const multi = [ 1, 2, 3, 5, 10]
       
         //Find what the player roles for the slots
         const max = slots.length;
         let rowOne = getRandomInt(max)
         let rowTwo = getRandomInt(max) 
         let rowThree = getRandomInt(max)
   
         //Get the smallest number for the multiplier
         let smallest = minimum3(rowOne, rowTwo, rowThree)
   
         //If the user got all three in a row
         if(rowOne == rowTwo && rowTwo == rowThree)
         {
           //Add users coin balance
           await economy.addCoins(username, guild.id, id, (Math.floor(args[0] * multi[smallest])))
   
           //Find users coin balance
           const coins = await economy.getCoins(username, guild.id, id)
   
           //Send user their winnings
           let embed = new Discord.MessageEmbed()
             .setColor('#008080')
             .setTitle(`Sticky Slots`)
             .setDescription(`>${slots[rowOne]}${slots[rowTwo]}${slots[rowThree]}<`)
             .addField(`\u200B`,`${message.author} won ${Math.floor(args[0] * multi[smallest])} tokens`, false)
             .addField(`Multiplier \`${multi[smallest]}x\``,`**Balance:** ${numberWithCommas(coins)}`,false)
   
           message.channel.send({embeds: [embed]})
         }
         //If the user got two out of three
         else if(rowOne == rowTwo || rowTwo == rowThree || rowOne == rowThree)
         {   
           //Make sure the two that matched are the correct emojis
           if(((rowOne == 0 || rowOne == 1 ) && (rowTwo == 0 || rowTwo == 1)) || ((rowTwo == 0 || rowTwo == 1 ) && (rowThree == 0 || rowThree == 1 )) || ((rowOne == 0 || rowOne == 1 ) && (rowThree == 0 || rowThree == 1 )))
           {
             //Add users coin balance
             await economy.addCoins(username, guild.id, id, (Math.floor(args[0] * multi[smallest])))
   
             //Find users coin balance
             const coins = await economy.getCoins(username, guild.id, id)
   
             //Send user their winnings
             let embed = new Discord.MessageEmbed()
               .setColor('#008080')
               .setTitle(`Sticky Slots`)
               .setDescription(`>${slots[rowOne]}${slots[rowTwo]}${slots[rowThree]}<`)
               .addField(`\u200B`,`${message.author} won ${Math.floor(args[0] * multi[smallest])} tokens`, false)
               .addField(`Multiplier \`${multi[smallest]}x\``,`**Balance:** ${numberWithCommas(coins)}`,false)
   
             message.channel.send({embeds: [embed]})
           }
           //Did not match the correct two so they lose
           else
           {
             //Add users coin balance
             await economy.addCoins(username, guild.id, id, (Math.floor(-1 * args[0])))
   
             //Find users coin balance
             const coins = await economy.getCoins(username, guild.id, id)
   
             //Send user their loses
             let embed = new Discord.MessageEmbed()
               .setColor('#BC3823')
               .setTitle(`Sticky Slots`)
               .setDescription(`>${slots[rowOne]}${slots[rowTwo]}${slots[rowThree]}<`)
               .addField(`\u200B`,`${message.author} lost ${args[0]} tokens`, false)
               .addField(`Multiplier \`${multi[smallest]}x\``,`**Balance:** ${numberWithCommas(coins)}`,false)
   
             message.channel.send({embeds: [embed]})
           }
         }
         //Did not match anything so they lose
         else
         {
           //Add users coin balance
           await economy.addCoins(username, guild.id, id, (Math.floor(-1 * args[0])))
   
           //Find users coin balance
           const coins = await economy.getCoins(username, guild.id, id)
   
           //Send user their loses
           let embed = new Discord.MessageEmbed()
             .setColor('#BC3823')
             .setTitle(`Sticky Slots`)
             .setDescription(`>${slots[rowOne]}${slots[rowTwo]}${slots[rowThree]}<`)
             .addField(`\u200B`,`${message.author} lost ${args[0]} tokens`, false)
             .addField(`Multiplier \`${multi[smallest]}x\``,`**Balance:** ${numberWithCommas(coins)}`,false)
   
           message.channel.send({embeds: [embed]})
         }
     }
     //User error tell them the rules
     else
     {
       let embed = new Discord.MessageEmbed()
       .setColor(000000)
       .setTitle(`Sticky Slots`)
       .addField(`Rules When Playing`,`1. Be sure to use positive numbers. \n 2. No characters. \n 3. Whole numbers only please. \n 4. I am really good at taking your money.`, false)
   
       message.channel.send({embeds: [embed]})
     }
	},
};
