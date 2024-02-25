const fs = require("fs");
const path = require("path");

const { REST, Routes } = require("discord.js");
const dotenv = require("dotenv");

const { exploreCommandsFolder } = require(path.join(__dirname, "utils", "commandUtils"));


// --------------
// Get the configurations
dotenv.config();
const appEnv = process.env.ENV ?? "deployment";

// --------------
// Get the commands
const commands = [];
const commandFolderPath = path.join(__dirname, "commands");

exploreCommandsFolder(commandFolderPath, "", commands);

for(let cmdIdx in commands) {
    commands[cmdIdx] = commands[cmdIdx].data.toJSON();
}

// --------------
// REST config
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        let route = undefined;

        if(appEnv !== "deployment") {
            route = Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID);
        } else {
            route = Routes.applicationCommands(process.env.CLIENT_ID);
        }
        
        const data = await rest.put(
            route,
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (err) {
		console.error(err);
	}
})();