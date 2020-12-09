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
    let invalidNumber;
    for (let i = PREAMBLE_SIZE; i < allNumbers.length; i++) {
        const validNumbers = calculateValidNumbers(allNumbers[i].previousNumbers);
        if (!validNumbers.includes(allNumbers[i].number)) {
            invalidNumber = allNumbers[i].number;
            break;
        }
    }
    console.log(invalidNumber);

    const justNumbers = allNumbers.map(n => n.number);
    for (let i = 0; i < justNumbers.length; i++) {
        let numbers = [justNumbers[i]];
        let sum = justNumbers[i];
        for (let j = i + 1; j < justNumbers.length; j++) {
            numbers.push(justNumbers[j]);
            sum += justNumbers[j];
            if (sum === invalidNumber) {
                const max = Math.max(...numbers);
                const min = Math.min(...numbers);
                console.log(min, "+", max, "=", min + max);
                return;
            }
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


