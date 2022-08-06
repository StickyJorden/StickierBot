const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: 32767,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();

// Initializing the project
require("./handler")(client);

//Connect to port 3000
require("./dashboard/server");

//Get Token
require('dotenv').config();

client.login(process.env.TOKEN);
