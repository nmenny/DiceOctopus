const fs = require("fs");
const path = require("path");

const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");


// --------------
// Get the configurations
dotenv.config();

// --------------
// Setup Discord Bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// --------------
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

// --------------
// Interaction

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const cmd = interaction.client.commands.get(interaction.commandName);

    if(!cmd) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await cmd.execute(interaction);
    } catch(err) {
        console.error(err);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }
});

// client.login(process.env.TOKEN);