const fs = require('fs');
const readline = require('readline');
const path = require('path');

const PREAMBLE_SIZE = 25;

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
    // console.log(allNumbers);
    let invalidNumber = findInvalidNumber(allNumbers);
    console.log(invalidNumber);

    for (let [index, number1] of allNumbers.entries()) {
        let numbers = [number1];
        let sum = number1;
        for (let number2 of allNumbers.slice(index+1)) {
            numbers.push(number2);
            sum += number2;
            if (sum === invalidNumber) {
                const max = Math.max(...numbers);
                const min = Math.min(...numbers);
                console.log(min, "+", max, "=", min + max);
                return;
            }
        }

    }
});

function findInvalidNumber(allNumbers) {
    let checkedNumbers = [...allNumbers];
    let previousNumbers = checkedNumbers.splice(0, PREAMBLE_SIZE);

    for (let number of checkedNumbers) {
        if (!calculateValidNumbers(previousNumbers).includes(number)) {
            return number;
        }
        previousNumbers.push(number);
        if (previousNumbers.length > PREAMBLE_SIZE) {
            previousNumbers.shift();
        }
    }
    return null;
}

function calculateValidNumbers(numbers) {
    let validNumbers = [];
    for (let number1 of numbers) {
        for (let number2 of numbers) {
            validNumbers.push(number1 + number2);
        }
    }
    return validNumbers;
}


