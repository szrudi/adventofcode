const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];

    // data.push({row: "FBFBBFF", col: "RLR"});
    // return data;

    for await (const line of rl) {
        const row = line.slice(0, 7);
        const col = line.slice(7, 10);
        data.push({row, col});
    }
    // console.log(data);
    return data;
}

processLineByLine().then(seats => {
    let lastSeatId = 0;
    let takenSeatIds = [];
    for (let seat of seats) {
        const row = convertDecimal(seat.row, 0, 127);
        const col = convertDecimal(seat.col, 0, 7);
        const seatId = row * 8 + col;
        takenSeatIds.push(seatId);
        lastSeatId = lastSeatId > seatId ? lastSeatId : seatId;
    }
    console.log(lastSeatId);
    takenSeatIds.sort((a, b) => a - b);
    // console.log(takenSeatIds);
    for (let i = 1; i < takenSeatIds.length; i++) {
        if (takenSeatIds[i - 1] + 1 !== takenSeatIds[i]) {
            console.log('Missing seat: ', takenSeatIds[i] - 1);
        }
    }
});

function convertDecimal(code, min, max) {
    //row: 'FBFBBFF', col: 'RLR'
    for (const half of code.split("")) {
        const change = Math.ceil((max - min) / 2);
        if (["F", "L"].includes(half)) {
            max -= change;
        } else {
            min += change;
        }
        // console.log(half, min, max);
    }
    // console.log(code, min, max);
    return min;
}
