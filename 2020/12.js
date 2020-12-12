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
            action: line.slice(0,1),
            value: parseInt(line.slice(1)),
        });
    }
    return data;
}

processLineByLine().then(instructions => {
    let ship = new Ship();

    for (let instruction of instructions) {
        // console.log("instruction:", instruction);
        if (ship.isPossibleMoveAction(instruction.action)) {
            ship.moveShip(instruction);
        } else if (ship.isPossibleTurnAction(instruction.action)) {
            ship.turnShip(instruction);
        }
    }
    console.log("ship:", ship);
    console.log("Distance:", Math.abs(ship.x) + Math.abs(ship.y));
});

class Ship {
    static #moveDirections = new Map([
        ["E", {axis: "x", value: 1}],
        ["N", {axis: "y", value: 1}],
        ["W", {axis: "x", value: -1}],
        ["S", {axis: "y", value: -1}],
    ]);
    static #possibleActions = new Map([
        ["turn", new Set(["R", "L"])],
        ["move", new Set(["F", ...Ship.#moveDirections.keys()])]
    ]);
    static #faceDirection = new Map([[0, "E"], [90, "N"], [180, "W"], [270, "S"]]);

    x = 0;
    y = 0;
    #face = 0;

    moveShip = (instruction) => {
        if (instruction.action === "F") {
            instruction.action = Ship.#faceDirection.get(this.#face);
        }
        const movement = Ship.#moveDirections.get(instruction.action);
        this[movement.axis] += instruction.value * movement.value;
    };

    turnShip(instruction) {
        let angleChange = instruction.value * (instruction.action === "L" ? 1 : -1);
        this.#face = (this.#face + angleChange).mod(360);
    }

    isPossibleMoveAction(action) {
        return Ship.#isPossibleAction("move", action);
    }

    isPossibleTurnAction(action) {
        return Ship.#isPossibleAction("turn", action);
    }

    static #isPossibleAction(type, action) {
        if (Ship.#possibleActions.has(type)) {
            return Ship.#possibleActions.get(type).has(action);
        }
        return false;
    }
}
