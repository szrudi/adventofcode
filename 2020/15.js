const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        data = line.split(",").map(n => parseInt(n));
    }
    return data;
}

processLineByLine().then(startingNumbers => {
    // startingNumbers = [0, 3, 6];
    // startingNumbers = [1, 3, 2];
    // startingNumbers = [2, 1, 3];
    // startingNumbers = [3, 1, 2];

    const countTo = 30000000;
    let lastIndexesOf = new Map();
    let numbers = new Array(countTo);
    numbers.splice(0, startingNumbers.length, ...startingNumbers);

    for (let i = 0; i + 1 < countTo; i++) {
        if (i % 1000000 === 0) {
            console.log(i);
        }
        let lastIndexOf = lastIndexesOf.get(numbers[i]);
        lastIndexesOf.set(numbers[i], i);
        if (i + 1 >= startingNumbers.length) {
            numbers[i + 1] = lastIndexOf === undefined ? 0 : i - lastIndexOf;
        }
    }
    console.log(numbers.pop());
});