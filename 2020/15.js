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

    let numbers = new Array(2020);
    numbers.splice(0, startingNumbers.length, ...startingNumbers);

    for (let i = startingNumbers.length; i < numbers.length; i++) {
        let lastIndexOf = numbers.lastIndexOf(numbers[i - 1], i - 2);
        numbers[i] = lastIndexOf === -1 ? 0 : i - 1 - lastIndexOf;
    }
    console.log(numbers.pop());
});