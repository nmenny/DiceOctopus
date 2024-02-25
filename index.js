const { Client, Events, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");


// Get the configurations
dotenv.config();

// Setup Discord Bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(process.env.TOKEN);