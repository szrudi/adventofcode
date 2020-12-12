const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        // 5-11 r: bhvgmszrpgrgwcdp
        const capturingRegex = /(?<min>\d+)-(?<max>\d+) (?<letter>\w): (?<password>.*)/;
        const found = line.match(capturingRegex);
        // console.log(found.groups);
        data.push(found.groups);
    }
    return data;
}

processLineByLine().then(rules => {
    let validPasswordCount = 0;
    let validPasswordCount2 = 0;
    for (let rule of rules) {
        let letterCount = {};
        let splitPassword = rule.password.split('');
        for (const passwordLetter of splitPassword) {
            if (letterCount.hasOwnProperty(passwordLetter)) {
                letterCount[passwordLetter]++;
            } else {
                letterCount[passwordLetter] = 1;
            }
        }
        if (
            letterCount[rule.letter] >= parseInt(rule.min) &&
            letterCount[rule.letter] <= parseInt(rule.max)
        ) {
            validPasswordCount++;
        }
        if (
            splitPassword[rule.min - 1] === rule.letter ^
            splitPassword[rule.max - 1] === rule.letter
        ) {
            validPasswordCount2++;
        }
        // console.log(letterCount);
    }
    console.log(validPasswordCount);
    console.log(validPasswordCount2);
});