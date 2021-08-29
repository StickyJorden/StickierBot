module.exports = {

    hook: function(channel, title, message, color, avatar){
    //Reassign paramters if they are blank
    if(!channel) return console.log('Channel not specified.');
    if(!title) return console.log('Title not specified.');
    if(!message) return console.log('Message not specified');
    if(!color) color = '00008b';
    if(!avatar) avatar = 'http://i.imgur.com/nF8G1Ho.gif'
  
    //We want to remove spaces from color and url, since they might have it on the sides.
    color = color.replace(/\s/g, '');
    avatar = avatar.replace(/\s/g,'');
  
    //Start of creating webhook
    channel.fetchWebhooks()
        .then(webhook => {
  
          //fetches webhook we will use for each hook
          let foundHook = webhook.find('name', 'Stickier Bot');
  
          //runs if webhook is not found
          if(!foundHook)
          {
            channel.createWebhook('Stickier Bot','http://i.imgur.com/nF8G1Ho.gif')
              .then(webhook => {
  
                //Finally send the webhook
                webhook.send('', {
                  "username": title,
                  "avatarURL":avatar,
                  "embeds": [{
                        "color": parseInt(`0x${color}`),
                        "description": message
                  }]
                })
                    .catch(error => {  //if error is found report in chat
                      console.log(error);
                        return channel.send('**Thats not very cash money yo. Please check the console**');
  
                    })
              })
          } else //Original webhook is found
            {
              foundHook.send('', {
                "username": title,
                "avatarURL":avatar,
                "embeds": [{
                      "color": parseInt(`0x${color}`),
                      "description": message
                }]
              })
                  .catch(error => {  //if error is found report in chat
                    console.log(error);
                      return channel.send('**Thats not very cash money yo. Please check the console**');
  
                  })
            }
  
    })
  }
  
  }
  