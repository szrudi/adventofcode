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
    let previousNumber = null;
    let differenceCounts = {1: 0, 2: 0, 3: 0};

    for (let number of numbers) {
        differenceCounts[number - previousNumber]++;
        previousNumber = number;
    }
    console.log(differenceCounts);
    console.log(differenceCounts[1], "*", differenceCounts[3], "=", differenceCounts[1] * differenceCounts[3]);

    let allPossibilities = [{adapters: [], indexToCheck: 0}];
    while (true) {
        const runningThreads = allPossibilities.filter(e => e.indexToCheck < numbers.length - 1);
        if (runningThreads <= 0) {
            break;
        }

        for (let thread of runningThreads) {
            const currentIndex = thread.indexToCheck;
            const adapter = numbers[currentIndex];
            let validAdapterCount = 0;
            for (let j = 1; j <= 3; j++) {
                const nextIndex = currentIndex + j;
                if (nextIndex >= numbers.length) {
                    break;
                }
                const nextAdapter = numbers[nextIndex];
                if (nextAdapter - adapter > 3) {
                    break;
                }
                // console.log(adapter, "-->", nextAdapter);
                validAdapterCount++;
                if (validAdapterCount > 1) {
                    thread = JSON.parse(JSON.stringify(thread));
                    allPossibilities.push(thread);
                }
                thread.indexToCheck = nextIndex;
                thread.adapters.push(nextAdapter);
            }
            // console.log(validAdapters);
        }
    }
    console.log(allPossibilities.length);
});

