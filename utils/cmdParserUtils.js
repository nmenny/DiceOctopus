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

function skipSpace(idx, str) {
    for (; idx < str.length; idx++) {
        if (str[idx] !== ' ') break;
    }
    return idx;
}

function extractInt(idx, str) {
    let currNb = 0;

    for (; idx < str.length; idx++) {
        const nb = parseInt(str[idx]);
        if (isNaN(nb)) {
            break;
        }
        currNb = currNb * 10 + nb;
    }

    return { nb: currNb, newIdx: idx }
}

function parseCmd(cmd) {
    const dices = {};
    let modifier = 0;

    let currNb = NaN;
    let res;
    let carIdx = 0;
    while (carIdx < cmd.length) {
        const car = cmd[carIdx];
        switch (car) {
            case 'd':
                if (isNaN(currNb)) throw Error("The number of dice to throw is not specified");
                if (currNb <= 0) throw Error("Cannot throw a negative number or zero dice");
                if (carIdx + 1 >= cmd.length) throw Error("Invalid format, should specify the type of dice to throw");
                if (cmd[carIdx - 1] === ' ' || cmd[carIdx + 1] === ' ') throw Error(`Should not have space between the 'd'`);

                res = extractInt(carIdx + 1, cmd);
                if (res.newIdx === carIdx) throw Error(`Character ${cmd[carIdx + 1]} is not "d", "+", "-" or a number.`);

                if (res.nb > 0 && currNb > 0) {
                    if (!(res.nb in dices)) dices[res.nb] = 0;
                    dices[res.nb] += currNb;
                }

                carIdx = skipSpace(res.newIdx, cmd);
                currNb = NaN;
                break;
            case '+':
                carIdx = skipSpace(carIdx + 1, cmd);
                res = extractInt(carIdx, cmd);
                if (res.newIdx === carIdx) throw Error(`Character ${car} is not "d", "+", "-" or a number.`);

                modifier += res.nb;
                currNb = NaN;
                break;
            case '-':
                carIdx = skipSpace(carIdx + 1, cmd);
                res = extractInt(carIdx, cmd);
                if (res.newIdx === carIdx) throw Error(`Character ${car} is not "d", "+", "-" or a number.`);

                modifier -= res.nb;
                currNb = NaN;
                break;
            case ' ':
                currNb = NaN;
                carIdx = skipSpace(carIdx, cmd);
                continue;
            default:
                res = extractInt(carIdx, cmd);
                if (res.newIdx === carIdx) throw Error(`Character ${car} is not "d", "+", "-" or a number.`);

                currNb = res.nb;
                carIdx = skipSpace(res.newIdx, cmd);
        }
    }

    if (Object.keys(dices).length === 0) {
        throw Error("You must throw at least one dice");
    }

    return { dices: dices, modifier: modifier };
}

module.exports = { parseCmd };