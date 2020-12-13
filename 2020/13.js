const fs = require('fs');
const readline = require('readline');
const path = require('path');

Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
};

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input1.txt');
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
    // data.buses = [17,"x",13,19];
    // data.buses = [67, 7, 59, 61];
    // data.buses = [67,"x",7,59,61];
    // data.buses = [67,7,"x",59,61];
    // data.buses = [1789,37,47,1889];

    let arrivals = new Map();
    let constraints = new Map();
    for (let [index, bus] of data.buses.entries()) {
        if (bus === "x") {
            continue;
        }
        bus = parseInt(bus);
        arrivals.set(bus, bus - data.departTime.mod(bus));
        constraints.set(bus, index);
    }
    console.log("arrivals:", arrivals);
    console.log("constraints:", constraints);

    let onlyBuses = data.buses.filter(b => b !== "x");
    onlyBuses.sort((a, b) => b - a);
    // console.log(onlyBuses);

    const maxBus = Math.max(...onlyBuses);
    let time = 1;
    while (time++) {
        let currentTime = time * maxBus - constraints.get(maxBus);
        if (time % 10000000 === 0) {
            console.log(currentTime, time * maxBus, time);
        }
        if (isValid(currentTime, onlyBuses, constraints)) {
            console.log(currentTime);
            break;
        }
    }
});

function isValid(time, buses, constraints) {
    for (let bus of buses) {
        if ((time + constraints.get(bus)).mod(bus) !== 0) {
            return false
        }
    }
    return true;
}
