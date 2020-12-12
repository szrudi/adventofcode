const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        data.push(parseInt(line));
    }
    return data;
}

processLineByLine().then(data => {
    for (let i = 0; i < data.length; i++) {
        for (let j = data.length - 1; j >= i; j--) {
            if (data[i] + data[j] === 2020) {
                console.log("Multiple of two:", data[i], data[j], data[i] * data[j]);
            }
            for (let k = i; k < j; k++) {
                if (data[i] + data[j] + data[k] === 2020) {
                    console.log("Multiple of three:", data[i], data[j], data[k], data[i] * data[j] * data[k]);
                }
            }
        }
    }
});