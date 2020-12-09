const fs = require('fs');
const readline = require('readline');
const path = require('path');

const PREAMBLE_SIZE = 25;

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    let previousNumbers = [];
    for await (const line of rl) {
        const number = parseInt(line);
        data.push({
            number: number,
            previousNumbers: [...previousNumbers],
        });

        previousNumbers.push(number);
        if (previousNumbers.length > PREAMBLE_SIZE) {
            previousNumbers.shift();
        }
    }
    return data;
}

processLineByLine().then(allNumbers => {
    // console.log(allNumbers);
    for (let i = PREAMBLE_SIZE; i < allNumbers.length; i++) {
        const validNumbers = calculateValidNumbers(allNumbers[i].previousNumbers);
        if (!validNumbers.includes(allNumbers[i].number)) {
            console.log(allNumbers[i]);
        }
    }
});

function calculateValidNumbers(numbers) {
    let validNumbers = [];
    for (let number1 of numbers) {
        for (let number2 of numbers) {
            validNumbers.push(number1 + number2);
        }
    }
    return validNumbers;
}


