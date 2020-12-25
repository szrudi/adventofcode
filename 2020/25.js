const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (let line of rl) {
        data.push(parseInt(line));
    }
    // data = [5764801, 17807724];
    return data;
}

processLineByLine().then(data => {
    console.log(data);
    let loopSizes = [0,0];
    let publicKeys = [1,1];
    do {
        if (data[1] !== publicKeys[1]) {
            publicKeys[1] = transformStep(publicKeys[1], 7);
            loopSizes[1]++;
        }
        if (data[0] !== publicKeys[0]) {
            publicKeys[0] = transformStep(publicKeys[0], 7);
            loopSizes[0]++;
        }
    } while (data[0] !== publicKeys[0] || data[1] !== publicKeys[1]);

    console.log(loopSizes);

    const encryptionKey = transform(publicKeys[0],loopSizes[1]);

    console.log(encryptionKey);
    // console.log(transform(publicKeys[1],loopSizes[0]));
});

function transform(subject, loop) {
    let value = 1;
    for (let i = 0; i < loop; i++) {
        value = transformStep(value, subject);
    }
    return value;
}

function transformStep(value, subject) {
    return (value * subject) % 20201227;
}
