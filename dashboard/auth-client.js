const OAuthClient = require('disco-oauth');
require('dotenv').config();

const client = new OAuthClient(process.env.ID, process.env.SECRET);
client.setRedirect(`${process.env.DASHBOARD_URL}/auth`);
client.setScopes('identify', 'guilds');

module.exports = client;