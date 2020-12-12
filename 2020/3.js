const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        //.#...#..#...#.#..........#.....
        data.push(line.split(""));
    }
    return data;
}

processLineByLine().then(forest => {
    const slopes = [
        {"right": 1, "down": 1},
        {"right": 3, "down": 1},
        {"right": 5, "down": 1},
        {"right": 7, "down": 1},
        {"right": 1, "down": 2},
    ];
    let treesEncountered = new Array(slopes.length).fill(0);
    const forestWidth = forest[0].length;
    for (let y = 1; y < forest.length; y++) {
        for (let i = 0; i < slopes.length; i++) {
            if (y % slopes[i].down === 0) {
                const x = y * slopes[i].right / slopes[i].down % forestWidth;
                if (forest[y][x] === "#") {
                    treesEncountered[i]++;
                }
            }
        }
    }
    console.log(treesEncountered);
    console.log(treesEncountered.reduce((sum, current) => sum * current, 1),);
});
