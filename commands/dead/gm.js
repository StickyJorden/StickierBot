const Discord = require('discord.js');
const { rm } = require('fs');
const { getPriority } = require('os');
const cron = require("node-cron");

module.exports = {
    name: "gm",
    alias: [],
    run: async (client, message, args) => { 

    let scheduledMessage = new cron.schedule('00 00 09 * * *', () => {
        // This runs every day at 10:00:00, you can do anything you want
        message.channel.send("Good Morning!");
        });

    // When you want to start it, use:
    scheduledMessage.start();

    }
}