const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        const number = parseInt(line);
        data.push(number);
    }
    return data;
}

processLineByLine().then(allNumbers => {
    allNumbers.sort((a, b) => a - b);
    // console.log(allNumbers);
    let previousNumber = 0;
    let differanceCounts = {1: 0, 2: 0, 3: 1};

    for (let number of allNumbers) {
        differanceCounts[number - previousNumber]++;
        previousNumber = number;
    }
    console.log(differanceCounts);
    console.log(differanceCounts[1], "*", differanceCounts[3], "=", differanceCounts[1] * differanceCounts[3]);
});
