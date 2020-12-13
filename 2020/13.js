const fs = require('fs');
const readline = require('readline');
const path = require('path');

Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
};

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        data.push(line.split(","));
    }
    return {
        departTime: parseInt(data[0]),
        buses: data[1].map(b => b === "x" ? b : parseInt(b))
    };
}

processLineByLine().then(data => {
    let arrivals = new Map();
    for (let bus of data.buses) {
        if (bus === "x") {
            continue;
        }
        bus = parseInt(bus);
        arrivals.set(bus, bus - data.departTime.mod(bus));
    }
    console.log("arrivals:", arrivals);
});
