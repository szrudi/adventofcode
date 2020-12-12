let path = "L2, L3, L3, L4, R1, R2, L3, R3, R3, L1, L3, R2, R3, L3, R4, R3, R3, L1, L4, R4, L2, R5, R1, L5, R1, R3, L5, R2, L2, R2, R1, L1, L3, L3, R4, R5, R4, L1, L189, L2, R2, L5, R5, R45, L3, R4, R77, L1, R1, R194, R2, L5, L3, L2, L1, R5, L3, L3, L5, L5, L5, R2, L1, L2, L3, R2, R5, R4, L2, R3, R5, L2, L2, R3, L3, L2, L1, L3, R5, R4, R3, R2, L1, R2, L5, R4, L5, L4, R4, L2, R5, L3, L2, R4, L1, L2, R2, R3, L2, L5, R1, R1, R3, R4, R1, R2, R4, R5, L3, L5, L3, L3, R5, R4, R1, L3, R1, L3, R3, R3, R3, L1, R3, R4, L5, L3, L1, L5, L4, R4, R1, L4, R3, R3, R5, R4, R3, R3, L1, L2, R1, L4, L4, L3, L4, L3, L5, R2, R4, L2";
// let path = "R8, R4, R4, R8  ";
let result = path
    .split(", ")
    .reduce(function (acc, item) {
        item = item.split(/([LR])/);
        item.shift();

        const isRightTurn = item[0] == 'R';
        const addToX = (isRightTurn && acc.dir == 0) || (!isRightTurn && acc.dir != 0) ? 1 : -1;
        const addToY = (!isRightTurn && acc.dir == 1) || (isRightTurn && acc.dir != 1) ? 1 : -1;

        for (let i = 0; i < item[1]; i++) {
            if (acc.dir % 2 == 0) {
                acc.X += addToX;
            } else {
                acc.Y += addToY;
            }
            const coord = acc.X + ";" + acc.Y;
            if (Object.keys(acc.bunnyHQ).length == 0 && acc.visited[coord] == 1) {
                acc.bunnyHQ.X = acc.X;
                acc.bunnyHQ.Y = acc.Y;
                console.log('BunnyHQ found! @'+coord);
                acc.visited[coord] = 2;
            }

            acc.visited[coord] = 1;
        }

        acc.dir = (acc.dir + (isRightTurn ? 1 : -1)) % 4;
        acc.dir += acc.dir < 0 ? 4 : 0;

        return acc;

    }, {X: 0, Y: 0, dir: 0, visited: [], bunnyHQ: []});

// document.write('<pre>'+JSON.stringify([result, result.bunnyHQ, Math.abs(result.bunnyHQ.X) + Math.abs(result.bunnyHQ.Y)]));
console.log(result.visited, result.bunnyHQ, Math.abs(result.bunnyHQ.X) + Math.abs(result.bunnyHQ.Y));
