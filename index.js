const path = require("path");

const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");

const { exploreCommandsFolder } = require(path.join(__dirname, "utils", "commandUtils"));


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
const myCommands = [];

exploreCommandsFolder(commandFolderPath, "", myCommands);

for(const cmd of myCommands) {
    client.commands.set(cmd.data.name, cmd);
}

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

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN);