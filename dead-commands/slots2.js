const Discord = require('discord.js');
const economy = require('@listeners/economy.js'); 
const {SlotMachine, SlotSymbol, Results} = require('slot-machine')

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

module.exports.run = async (bot, message, args) => {

  //Make sure the user gives us either the table or money to gamble with
  if(!args[0]) return message.reply('You need to bet something or use `!slots table` to see the odds of winning.');

  //Show the odds of winning table
  if(args[0] == "table")
  {
      let embed = new Discord.MessageEmbed()
        .setColor(000000)
        .setDescription(`**ICON** - **MULTIPLIER** \n\n 🍎🍎  - 1x \n 🍏🍏  - 1x \n 🍊🍊  - 1x \n 🎃🎃🎃 - 2x \n ⚡️⚡️⚡️ - 3x \n ⭐️⭐️⭐️ - 4x \n 💥💥💥 - 5x \n 🌈🌈🌈 - 10x \n 🎉🎉🎉 - 15x \n 💎💎💎 - 25x \n 🎇🎇🎇 - 50x \n 💍💍💍 - 75x \n ${"<a:dance:835016357245485056>"}${"<a:dance:835016357245485056>"}${"<a:dance:835016357245485056>"} - 250x`);

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
      const slots = ["🍎", "🍏", "🍊", "🎃", "⚡️", "⭐️", "💥", "🌈", "🎉", "💎", "🎇", "💍", `${"<a:dance:835016357245485056>"}`]; 
      const multi = [ 1, 1, 1, 2, 3, 4, 5, 10, 15, 25, 50, 75, 250,]

      const cherry = new SlotSymbol('cherry', {
        display: '🍒',
        points: 10,
        weight: 100
    });
     
    const money = new SlotSymbol('money', {
        display: '💰',
        points: 100,
        weight: 50
    });
     
    const wild = new SlotSymbol('wild', {
        display: '❔',
        points: 10,
        weight: 50,
        wildcard: true
    });
     
    const machine = new SlotMachine(3, [cherry, money, wild]);
    const results = machine.play();
    
    console.log(results.visualize());
    //console.log(results.lines.map(l => l.isWon));
    console.log(results.totalPoints, results.winCount);
    console.log(results.lines[0].symbols);
    console.log(results.lines[1].points);
    console.log(results.lines[2].isWon);
    console.log(results.lines[3].diagonal);
    
  }
}
