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
    let blackTilePositions = new Set();
    for (let steps of flips) {
        let position = [0, 0].join("|");
        for (let step of steps) {
            position = doStep(step, position);
        }
        if (blackTilePositions.has(position)) {
            blackTilePositions.delete(position);
        } else {
            blackTilePositions.add(position);
        }
    }
    console.log(`Day 0:`, blackTilePositions.size);

    for (let i = 0; i < 100; i++) {
        let tempTiles = new Set([...blackTilePositions]);
        // drawFullMap(tempTiles);
        let checked = new Set();
        for (let blackPosition of blackTilePositions) {
            let positionsToCheck = getNeighbours(blackPosition);
            positionsToCheck.push(blackPosition);
            for (let tilePosition of positionsToCheck) {
                if (checked.has(tilePosition)) {
                    continue;
                }
                checked.add(tilePosition);
                const isBlack = blackTilePositions.has(tilePosition);
                let neighboursCount = countNeighbours(tilePosition, blackTilePositions);
                if (isBlack && ![1,2].includes(neighboursCount)) {
                    tempTiles.delete(tilePosition);
                } else if (!isBlack && neighboursCount === 2) {
                    tempTiles.add(tilePosition);
                }
            }
        }

        blackTilePositions = tempTiles;
        console.log(`Day ${i + 1}:`, blackTilePositions.size);
    }
    //drawFullMap(blackTilePositions);
});

function getNeighbours(position) {
    let neighbourPositions = [];
    let directions = ["w", "nw", "sw", "e", "ne", "se"];
    for (let direction of directions) {
        neighbourPositions.push(doStep(direction, position));
    }
    return neighbourPositions;
}

/**
 * @param {string} position
 * @param {Set} blackTiles
 */
function countNeighbours(position, blackTiles) {
    let neighbours = 0;
    let neighbourPositions = getNeighbours(position);

    for (let neighbour of neighbourPositions) {
        if (blackTiles.has(neighbour)) {
            neighbours++
        }
    }
    return neighbours;
}

function doStep(step, position) {
    let [x, y] = position.split("|").map(n => parseInt(n));
    // console.log(position, x, y)

    if (step === "w") {
        x -= 2;
    } else if (step === "nw") {
        x--;
        y++;
    } else if (step === "sw") {
        x--;
        y--;
    } else if (step === "e") {
        x += 2;
    } else if (step === "ne") {
        x++;
        y++;
    } else if (step === "se") {
        x++;
        y--;
    }
    return [x, y].join("|");
}


/**
 * To visualize the map (it is from day 20)
 *
 * @param {Map<string,Tile>} map
 * @returns {string[][]}
 */
function drawFullMap(map) {
    let buffer = [];
    let size = getMapSize(map);
    console.log(size.x.min, size.y.min);
    for (let y = size.y.min; y <= size.y.max; y++) {
        let line = [];
        for (let x = size.x.min; x <= size.x.max; x++) {
            let isTile = !((x % 2 === 0) ^ (y % 2 === 0));
            let isBlack = map.has([x, y].join("|"));
            let tile = isTile ? (isBlack ? "X" : "-") : " ";
            line.push(tile);
        }
        buffer.push(line);
    }
    buffer.forEach(l => console.log(l.join("")));
    return buffer;
}

function getMapSize(map) {
    let axis = {
        x: {min: null, max: null},
        y: {min: null, max: null},
    };
    for (let tile of map.values()) {
        let [x, y] = tile.split("|").map(n => parseInt(n));
        axis.x.min = Math.min(x, axis.x.min)
        axis.x.max = Math.max(x, axis.x.max)
        axis.y.min = Math.min(y, axis.y.min)
        axis.y.max = Math.max(y, axis.y.max)
    }
    return axis;
}
