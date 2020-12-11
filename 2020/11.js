const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('11-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        //LLLL.LL.LL
        data.push(line.split(""));
    }
    return data;
}

processLineByLine().then(waitingArea => {
    let placesToChange;
    let occupied;
    do {
        occupied = 0;
        placesToChange = [];
        for (let y = 0; y < waitingArea.length; y++) {
            // console.log(waitingArea[y].join(" "));
            for (let x = 0; x < waitingArea[y].length; x++) {
                let currentPlace = waitingArea[y][x];
                if (currentPlace === ".") {
                    continue;
                }
                if (currentPlace === "#") {
                    occupied++;
                }
                const neighbours = countNeighbours(x, y, waitingArea);
                if (
                    currentPlace === "L" && neighbours === 0 ||
                    currentPlace === "#" && neighbours >= 4
                ) {
                    placesToChange.push({x, y});
                }

            }
        }
        // console.log("*********************************");
        // console.log("occupied:", occupied);
        // console.log(placesToChange);
        // console.log("*********************************");
        for (let place of placesToChange) {
            const currentType = waitingArea[place.y][place.x];
            waitingArea[place.y][place.x] = currentType === "L" ? "#" : "L";
        }
    } while (placesToChange.length > 0);
    console.log("occupied:", occupied);
});

/**
 * @param {number} x
 * @param {number} y
 * @param {[]} waitingArea
 */
function countNeighbours(x, y, waitingArea) {
    let neighbours = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let neighbourY = y + i;
            let neighbourX = x + j;
            if (
                i === 0 && j === 0 ||
                neighbourY < 0 || neighbourY >= waitingArea.length ||
                neighbourX < 0 || neighbourX >= waitingArea[neighbourY].length
            ) {
                continue;
            }
            if (waitingArea[neighbourY][neighbourX] === "#") {
                neighbours++;
            }
        }
    }
    return neighbours;
}
