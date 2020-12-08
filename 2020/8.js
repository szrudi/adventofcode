const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        const instruction = line.split(" ");
        data.push({
            operation: instruction[0],
            argument: parseInt(instruction[1]),
            executionCount: 0
        });
    }
    return data;
}

processLineByLine().then(allInstructions => {
    console.log(allInstructions);
    let current = 0;
    let accumulator = 0;
    while (true) {
        console.log(allInstructions[current]);
        if (allInstructions[current].executionCount > 0) {
            break;
        }
        allInstructions[current].executionCount++;

        if (allInstructions[current].operation === "acc") {
            accumulator += allInstructions[current].argument;
        }
        if (allInstructions[current].operation === "jmp") {
            current += allInstructions[current].argument;
        } else {
            current++;
        }
    }
    console.log("Accumulator:", accumulator);

});

