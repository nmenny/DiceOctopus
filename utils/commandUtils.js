const fs = require("fs");
const path = require("path");


function addCommand(currPath) {
    const command = require(currPath);

    if ("data" in command && "execute" in command) {
        return command;
    } else {
        console.log(`[WARNING] The command at ${currPath} is missing a required "data" or "execute" property.`);
    }
}

function exploreCommandsFolder(currPath, fileName = "", res = []) {
    if (fs.lstatSync(currPath).isFile() && fileName.endsWith(".js")) {
        res.push(addCommand(currPath));
    } else {
        const folder = fs.readdirSync(currPath);

        for (const content of folder) {
            const commandPath = path.join(currPath, content);
            exploreCommandsFolder(commandPath, content, res);
        }
    }
}

module.exports = { exploreCommandsFolder };