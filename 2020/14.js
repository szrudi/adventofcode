const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        // mem[2056] = 356
        // mask = 10000000001XX000101000X0X11000X10110
        const capturingRegex = /(?<type>(mem|mask))(\[(?<address>\d+)])? = (?<value>.*)/;
        const found = line.match(capturingRegex);
        // console.log(found.groups);
        let command = {
            type: found.groups.type,
            address: parseInt(found.groups.address),
            value: found.groups.type === "mem" ? parseInt(found.groups.value) : found.groups.value,
        };
        data.push(command);
    }
    return data;
}

processLineByLine().then(program => {
    let memory = new Map();
    const maxLength = 36;
    let mask = new Array(maxLength).fill(0).join("");
    // console.log(program);
    for (let command of program) {
        if (command.type === "mask") {
            mask = command.value;
        } else {
            const binaryValue = command.value.toString(2).padStart(maxLength,"0");
            let maskedValue = new Array(maxLength).fill(0);
            for (let i = maxLength-1; i >= 0; i--) {
                maskedValue[i] = parseInt(mask[i] === "X" ? binaryValue[i] : mask[i]);
            }
            memory.set(command.address, maskedValue);
        }
    }
    // console.log(memory);
    let sum = 0;
    for (let memoryElement of memory.values()) {
        sum += parseInt(memoryElement.join(""),2)
    }
    console.log(sum);
});