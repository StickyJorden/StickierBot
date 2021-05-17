let hug = 4;

module.exports.run = async (bot, message, args) => {

    hug++;    
    message.channel.send(`Hug Counter: ${hug}`);
 
}