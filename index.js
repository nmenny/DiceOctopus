const fs = require("fs");
const path = require("path");

const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");


// Get the configurations
dotenv.config();

// Setup Discord Bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Gets the commands
client.commands = new Collection();

const commandFolderPath = path.join(__dirname, "commands");

function addCommand(currPath) {
    const command = require(currPath);

    if("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${currPath} is missing a required "data" or "execute" property.`);
    }
}

function exploreCommandsFolder(currPath, fileName = "") {
    if(fs.lstatSync(currPath).isFile() && fileName.endsWith(".js")) {
        addCommand(currPath);
    } else {
        const folder = fs.readdirSync(currPath);

        for(const content of folder) {
            const commandPath = path.join(currPath, content);
            exploreCommandsFolder(commandPath, content);
        }
    }
}

exploreCommandsFolder(commandFolderPath);

// client.login(process.env.TOKEN);