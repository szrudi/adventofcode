const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        const capturingRegex = /(w|nw|sw|e|ne|se)!*/g;
        data.push(line.match(capturingRegex));
    }
    return data;
}

processLineByLine().then(flips => {
    let toFlip = new Set();
    for (let steps of flips) {
        let position = [0, 0];
        for (let step of steps) {
            switch (step) {
                case "w":
                    position[0] -= 2;
                    break;
                case "nw":
                    position[0]--;
                    position[1]++;
                    break;
                case "sw":
                    position[0]--;
                    position[1]--;
                    break;
                case "e":
                    position[0] += 2;
                    break;
                case "ne":
                    position[0]++;
                    position[1]++;
                    break;
                case "se":
                    position[0]++;
                    position[1]--;
                    break;
            }
        }
        const coordinate = position.join("|");
        if (toFlip.has(coordinate)) {
            toFlip.delete(coordinate);
        } else {
            toFlip.add(coordinate);
        }
    }
    console.log(toFlip.size);
});
