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
        opt.setName("silent")
            .setNameLocalizations({ fr: "silencieux" })
            .setDescription("Do not display the details of each dice.")
            .setDescriptionLocalizations({ fr: "N'affiche pas les détails du lancé." })
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

        if (!interact.options.getBoolean("silent") ?? true) {
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