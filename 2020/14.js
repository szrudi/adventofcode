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
            address: parseInt(found.groups.address) || null,
            value: found.groups.type === "mem" ? parseInt(found.groups.value) : found.groups.value,
        };
        data.push(command);
    }
    return data;
}

processLineByLine().then(program => {
    let memoryV1 = new Map();
    let memoryV2 = new Map();
    const maxLength = 36;
    let mask = new Array(maxLength).fill(0).join("");
    // console.log(program);
    for (let command of program) {
        if (command.type === "mask") {
            mask = command.value;
            continue;
        }

        const binaryValue = toBinaryArray(command.value, maxLength);
        const binaryAddress = toBinaryArray(command.address, maxLength);
        let memoryAddresses = [new Array(maxLength).fill(0)];
        for (let i = maxLength - 1; i >= 0; i--) {
            if (mask[i] === "X") {
                let duplicates = JSON.parse(JSON.stringify(memoryAddresses));
                memoryAddresses.map(a => a[i] = 1);
                duplicates.map(a => a[i] = 0);
                memoryAddresses.push(...duplicates);
            } else {
                binaryValue[i] = mask[i];
                if (mask[i] === "1") {
                    memoryAddresses.map(a => a[i] = 1);
                } else {
                    memoryAddresses.map(a => a[i] = binaryAddress[i]);
                }
            }
        }
        memoryV1.set(command.address, parseInt(binaryValue.join(""), 2));
        for (let memoryAddress of memoryAddresses) {
            memoryV2.set(parseInt(memoryAddress.join(""), 2), command.value);
        }
    }

    // console.log(memoryV1);
    let sumV1 = [...memoryV1.values()].reduce((sum, v) => sum + v, 0);
    console.log(sumV1);

    // console.log(memoryV2);
    let sumV2 = [...memoryV2.values()].reduce((sum, v) => sum + v, 0);
    console.log(sumV2);
});

/**
 * @param {number} value
 * @param {number} maxLength
 */
function toBinaryArray(value, maxLength) {
    return value
        .toString(2)
        .padStart(maxLength, "0")
        .slice(0, maxLength)
        .split("")
        .map(v => parseInt(v))
        ;
}




