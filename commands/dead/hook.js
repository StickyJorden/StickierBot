exports.run = (bot, message, args, func) => {
  //delete user message
  message.delete();

  if (msg === prefix + 'HOOK') //this checks if the only thing they sent was "hook"
  {
      return func.hook(message.channel, 'Hook Usage', `${prefix}hook <title>, <message>, [HEXcolor], [avatarURL]\n\n**<> is required\n[] is optional**`, 'FF00FF', 'https://i.ytimg.com/vi/4TNasSi6hAM/hqdefault.jpg')
  }

  let hookArgs = message.content.slice(prefix.length + 4).split(",")//This slice the first 6 letters prefix & and the work hook then splits them by Commnands

  func.hook(message.channel, hookArgs[0], hookArgs[1], hookArgs[2], hookArgs[3]); //This is where it actually calls the hook.



}
