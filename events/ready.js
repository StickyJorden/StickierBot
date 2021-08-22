//Mongo Listeners
//const messageCount = require('@listeners/message-counter');
const levels = require('@listeners/levels');
const mongo = require('@storage/mongo');
const client = require("../index");

client.on("ready", async () => {
    console.log('Stickier Bot: Online');
    //Uncomment to enable counter the number of messages sent per user
    //messageCount.run(bot);
    await mongo();
    levels.run(client);
});
