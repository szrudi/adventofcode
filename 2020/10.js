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

processLineByLine().then(numbers => {
    numbers.sort((a, b) => a - b);
    numbers.unshift(0);
    numbers.push(numbers[numbers.length - 1] + 3)
    // console.log(numbers);
    firstPart(numbers);
    secondPart(numbers);
});

function firstPart(numbers) {
    let previousNumber = null;
    let differenceCounts = {1: 0, 2: 0, 3: 0};

    for (let number of numbers) {
        differenceCounts[number - previousNumber]++;
        previousNumber = number;
    }
    console.log(differenceCounts);
    console.log(differenceCounts[1], "*", differenceCounts[3], "=", differenceCounts[1] * differenceCounts[3]);
}

function secondPart(numbers) {
    let possibleSteps = calculatePossibleSteps(numbers);
    console.log(possibleSteps);
    console.log("All possible arrangements: ", sumTree(possibleSteps, 0));
}

function calculatePossibleSteps(numbers) {
    let possibleSteps = numbers.map(adapter => {
        return {adapter, validNextIndexes: [], numberOfPaths: null}
    })
    for (let index = 0; index < possibleSteps.length; index++) {
        for (let j = 1; j <= 3; j++) {
            let adapter = possibleSteps[index].adapter;
            let nextIndex = index + j;
            if (nextIndex < possibleSteps.length) {
                let nextAdapter = possibleSteps[nextIndex].adapter;
                if (nextAdapter - adapter <= 3) {
                    // console.log(adapter, "-->", nextAdapter);
                    possibleSteps[index].validNextIndexes.push(nextIndex)
                }
            }
        }
    }
    return possibleSteps;
}

function sumTree(steps, index) {
    let currentStep = steps[index];
    if (currentStep.validNextIndexes.length === 0) {
        currentStep.numberOfPaths = 1;
    }
    if (currentStep.numberOfPaths === null) {
        for (let nextStepIndex of currentStep.validNextIndexes) {
            currentStep.numberOfPaths += sumTree(steps, nextStepIndex);
            // console.log(steps);
        }
    }

    return currentStep.numberOfPaths;
}
