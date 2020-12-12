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
        data.push({
            action: line.slice(0, 1),
            value: parseInt(line.slice(1)),
        });
    }
    return data;
}

processLineByLine().then(instructions => {
    let ship = new Ship(0, 0, new WayPoint(10, 1));

    for (let instruction of instructions) {
        ship.execute(instruction);
    }
    console.log("ship:", ship);
    console.log("Distance:", Math.abs(ship.x) + Math.abs(ship.y));
});

/**
 * @property {number}  x
 * @property {number}  y
 * @property {WayPoint}  wayPoint
 */
class Ship {
    x = 0;
    y = 0;
    wayPoint;

    constructor(x, y, wayPoint) {
        this.x = x;
        this.y = y;
        this.wayPoint = wayPoint;
    }

    execute(instruction) {
        if (instruction.action === "F") {
            this.move(instruction.value);
        } else {
            this.wayPoint.execute(instruction);
        }
    }

    move(speed) {
        this.x += this.wayPoint.x * speed;
        this.y += this.wayPoint.y * speed;
    }
}

class WayPoint {
    static axisAndDirections = new Map([
        ["E", {axis: "x", direction: 1}],
        ["N", {axis: "y", direction: 1}],
        ["W", {axis: "x", direction: -1}],
        ["S", {axis: "y", direction: -1}],
    ]);
    static turnActions = new Set(["R", "L"]);
    static moveActions = new Set(WayPoint.axisAndDirections.keys());

    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    execute(instruction) {
        if (WayPoint.moveActions.has(instruction.action)) {
            this.#move(instruction);
        } else if (WayPoint.turnActions.has(instruction.action)) {
            this.#turn(instruction);
        }
    }

    #move(instruction) {
        const movement = WayPoint.axisAndDirections.get(instruction.action);
        this[movement.axis] += instruction.value * movement.direction;
    }

    #turn(instruction) {
        if (instruction.action === "R") {
            instruction.action = "L";
            instruction.value = 360 - instruction.value;
        }
        const turns = Math.floor(instruction.value / 90).mod(4);
        for (let i = 0; i < turns; i++) {
            const signX = Math.sign(this.y) > 0 ? -1 : 1;
            const signY = Math.sign(this.x) < 0 ? -1 : 1;
            [this.x, this.y] = [
                signX * Math.abs(this.y),
                signY * Math.abs(this.x)
            ];
        }
    }
}
