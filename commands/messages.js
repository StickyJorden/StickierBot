//Now we fetch their level & messages
const db = require('quick.db'); //we need to require quick.db in every file it's used in.

exports.run = (bot, messages, args, func) => {

  db.fetch(message.author.id + message.guild.id),then(i => { //This is object of messgaes sent
    db.fetch(`userLevel_${message.author.id + message.guild.id}`).then(o => { //This is the object of their level
        message.channel.send('Messags sent: `' + (i.value + 1) + '`\nLevel: `' + o.value + '`'); //This returns their messages and level, the reason we used +1 for the messages is because when someone calls this command, it also adds 1 eailer at the same time but this is fetching the previous value we need to add 1 to the answer seconds after This
    })
  })


}
