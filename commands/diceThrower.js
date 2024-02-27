/**
 * OctoDice
 * Copyright (C) 2024  Nathan Menny
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const path = require("path");

const { SlashCommandBuilder } = require("discord.js");

const { parseCmd } = require(path.join("..", "utils", "cmdParserUtils"));

const command = new SlashCommandBuilder()
    .setName("throw")
    .setNameLocalizations({ fr: "lancer" })
    .setDescription("Throws dice.")
    .setDescriptionLocalizations({ fr: "Lance des dés." })
    .addStringOption(opt =>
        opt.setName("dices")
            .setNameLocalizations({ fr: "dés" })
            .setDescription("What to throw.")
            .setDescriptionLocalizations({ fr: "Quoi lancer." })
            .setMaxLength(300)
            .setRequired(true)
    )
    .addBooleanOption(opt =>
        opt.setName("verbose")
            .setNameLocalizations({ fr: "verbeux" })
            .setDescription("Display the details of each dice.")
            .setDescriptionLocalizations({ fr: "Affiche les détails du lancé." })
    )

function throwDice(dices) {
    const detail = {};
    let result = 0;
    for (const diceType in dices) {
        detail[diceType] = [];
        for (let diceCnt = 0; diceCnt < dices[diceType]; diceCnt++) {
            const res = Math.round(Math.random() * (diceType - 1)) + 1;

            result += res;
            detail[diceType].push(res);
        }
    }

    return { result: result, detail: detail };
}

async function execute(interact) {
    const args = interact.options.getString("dices");
    try {
        const parsed = parseCmd(args.toLowerCase());
        const throwRes = throwDice(parsed.dices);
        const finalResult = parsed.modifier + throwRes.result;
        let reply = "";

        if (parsed.modifier !== 0) {
            const sign = parsed.modifier > 0 ? "+" : "-";
            reply = `\`${args}\` => **${finalResult}** (${throwRes.result} ${sign} ${parsed.modifier})`;
        } else {
            reply = `\`${args}\` => **${finalResult}**`;
        }

        if (interact.options.getBoolean("verbose") ?? false) {
            reply += '\n';

            for (let diceType in throwRes.detail) {
                const diceDetails = throwRes.detail[diceType];
                let totalCnt = 0;
                reply += `\n- ${diceDetails.length}d${diceType} :`;
                for (let diceCnt in diceDetails) {
                    totalCnt += diceDetails[diceCnt];
                    if (diceCnt === '0') {
                        reply += ` ${diceDetails[diceCnt]}`;
                    } else {
                        reply += ` + ${diceDetails[diceCnt]}`
                    }
                }

                reply += ` (${totalCnt})`;
            }
        }

        await interact.reply(reply);
    } catch (err) {
        await interact.reply({ content: `[ERR] ${err.message}`, ephemeral: true });
    }
}

module.exports = {
    data: command,
    execute,
}