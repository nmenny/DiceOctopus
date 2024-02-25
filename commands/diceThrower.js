const { SlashCommandBuilder } = require("discord.js");

const command = new SlashCommandBuilder()
    .setName("throw")
    .setDescription("Throws dice");

async function execute(interact) {
    // To fill

    await interact.reply("Response...");
}

module.exports = {
    data: command,
    execute,
}