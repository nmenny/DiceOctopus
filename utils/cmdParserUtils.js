function skipSpace(idx, str) {
    for(; idx < str.length; idx++) {
        if(str[idx] !== ' ') break;
    }
    return idx;
}

function extractInt(idx, str) {
    let currNb = 0;

    for(; idx < str.length; idx++) {
        const nb = parseInt(str[idx]);
        if(isNaN(nb)) {
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
    while(carIdx < cmd.length) {
        const car = cmd[carIdx];
        switch(car) {
            case 'd':
                if(isNaN(currNb)) throw Error("The number of dice to throw is not specified");
                if(carIdx + 1 >= cmd.length) throw Error("Invalid format, should specify the type of dice to throw");
                if(cmd[carIdx-1] === ' ' || cmd[carIdx+1] === ' ') throw Error(`Should not have space between the 'd'`);

                res = extractInt(carIdx+1, cmd);
                if(res.newIdx === carIdx) throw Error(`Character ${cmd[carIdx+1]} is not "d", "+", "-" or a number.`);

                if(res.nb > 0 && currNb > 0) {
                    if(!(res.nb in dices)) dices[res.nb] = 0;
                    dices[res.nb] += currNb;
                }

                carIdx = skipSpace(res.newIdx, cmd);
                currNb = NaN;
                break;
            case '+':
                carIdx = skipSpace(carIdx+1, cmd);
                res = extractInt(carIdx, cmd);
                if(res.newIdx === carIdx) throw Error(`Character ${car} is not "d", "+", "-" or a number.`);

                modifier += res.nb;
                currNb = NaN;
                break;
            case '-':
                carIdx = skipSpace(carIdx+1, cmd);
                res = extractInt(carIdx, cmd);
                if(res.newIdx === carIdx) throw Error(`Character ${car} is not "d", "+", "-" or a number.`);

                modifier -= res.nb;
                currNb = NaN;
                break;
            case ' ':
                currNb = NaN;
                carIdx = skipSpace(carIdx, cmd);
                continue;
            default:
                res = extractInt(carIdx, cmd);
                if(res.newIdx === carIdx) throw Error(`Character ${car} is not "d", "+", "-" or a number.`);

                currNb = res.nb;
                carIdx = skipSpace(res.newIdx, cmd);
        }
    }

    return { dices: dices, modifier: modifier };
}

module.exports = { parseCmd };