const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (let line of rl) {
        // line = "389125467";
        data.push(line.split("").map(n => parseInt(n)));
    }
    return data;
}

processLineByLine().then(data => {
    let cups = data[0];
    let currentIndex = 0;
    let destinationIndex = null;
    for (let round = 0; round < 100; round++) {
        console.log(`\n --- move ${round+1} ---`);
        console.log(`cups: ${cups}`);
        let pickUpIndex = (currentIndex + 1) % cups.length;
        let pickedUp = cups.splice(pickUpIndex, 3);
        console.log(`picked up: ${pickedUp}`);

        let destinationLabel = cups[currentIndex];
        do {
            destinationLabel--;
            destinationLabel = destinationLabel < Math.min(...cups) ?
                Math.max(...cups) : destinationLabel;
            destinationIndex = cups.indexOf(destinationLabel);
        } while (destinationIndex === -1);

        console.log(`destination: ${destinationLabel}`);
        cups.splice(destinationIndex + 1, 0, ...pickedUp);
        cups.push(cups.shift());
    }
    while (cups[0] !== 1) {
        cups.push(cups.shift());
    }
    cups.shift();
    console.log(`\nCups after 1: ${cups.join("")}`);
});
