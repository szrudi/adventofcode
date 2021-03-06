const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        // ##...###
        data.push(line.split("").map(p => p === "#"));
    }
    return data;
}

processLineByLine().then(data => {
    let pocketUniverse = new Universe(data);
    for (let i = 0; i < 6; i++) {
        pocketUniverse.printActiveUniverse()
        pocketUniverse.generatePointsToCheck();
        // pocketUniverse.printPointsToCheck();
        pocketUniverse.nextCycle();
        // pocketUniverse.printPointsToCheck()
    }
    console.log(pocketUniverse.countActivePoints());
})

class Universe {
    /** @type {Map<string, Point>} */
    #activePoints = new Map();
    #pointsToCheck = new Map();
    universeBounds = {xMin: 0, xMax: 0, yMin: 0, yMax: 0, zMin: 0, zMax: 0, wMin: 0, wMax: 0}

    constructor(data) {
        for (const [y, row] of data.entries()) {
            row.forEach((activeState, x) => {
                    this.addToActive(new Point(x, y, 0, 0, activeState));
                }
            )
        }
    }

    addToActive(point) {
        if (!point.active) {
            return;
        }
        if (this.#activePoints.has(point.coordinate)) {
            return;
        }
        this.#activePoints.set(point.coordinate, point);
        this.updateBounds(point);
    }

    updateBounds(point) {
        for (let axis of ["x", "y", "z", "w"]) {
            this.universeBounds[axis + "Min"] = Math.min(this.universeBounds[axis + "Min"], point[axis]);
            this.universeBounds[axis + "Max"] = Math.max(this.universeBounds[axis + "Max"], point[axis]);
        }
    }

    printActiveUniverse() {
        this.print(this.#activePoints, "active");
    }

    printPointsToCheck() {
        this.print(this.#pointsToCheck, "to check");
    }

    /**
     * @param {Map<string,Point>} points
     * @param {string} [title]
     */
    print(points, title = "") {
        console.log("****** " + (title + " ").padEnd(15, "*"))
        let xAxisHeader = ""
        for (let x = this.universeBounds.xMin; x <= this.universeBounds.xMax; x++) {
            xAxisHeader += x.toString().padStart(2, " ");
        }
        for (let w = this.universeBounds.wMin; w <= this.universeBounds.wMax; w++) {
            for (let z = this.universeBounds.zMin; z <= this.universeBounds.zMax; z++) {
                console.log((z + "z " + w + "w ").padStart(5, " ") + xAxisHeader);
                for (let y = this.universeBounds.yMin; y <= this.universeBounds.yMax; y++) {
                    let line = y.toString().padStart(4, " ") + ": ";
                    for (let x = this.universeBounds.xMin; x <= this.universeBounds.xMax; x++) {
                        let p = points.get(Point.joinCoordinates(x, y, z, w));
                        line += ((p === undefined) ? "_" : (p.active ? "#" : ".")).padStart(2, " ")
                    }
                    console.log(line);
                }
                console.log("")
            }
        }
    }

    generatePointsToCheck() {
        for (/** @type {Point} */ const point of this.#activePoints.values()) {
            this.#pointsToCheck.set(point.coordinate, point);
            for (const neighbourCoordinate of point.neighbourCoordinates) {
                if (
                    this.#pointsToCheck.has(neighbourCoordinate) ||
                    this.#activePoints.has(neighbourCoordinate)
                ) {
                    continue;
                }
                let coordinates = Point.splitCoordinate(neighbourCoordinate);
                let point = new Point(...coordinates);
                this.#pointsToCheck.set(neighbourCoordinate, point);
                this.updateBounds(point);
            }
        }
    }

    nextCycle() {
        for (let point of this.#pointsToCheck.values()) {
            point.calculateNextState(this.#activePoints);
        }
        for (let point of this.#pointsToCheck.values()) {
            if (point.nextState) {
                point.active = point.nextState;
                point.nextState = null
                this.#activePoints.set(point.coordinate, point);
            } else {
                this.#activePoints.delete(point.coordinate);
            }
        }
        this.#pointsToCheck.clear();
    }

    countActivePoints() {
        return this.#activePoints.size;
    }
}

class Point {
    active = false;
    nextState = null;
    neighbourCoordinates = [];

    static splitCoordinate(coordinate) {
        return coordinate.split("|").map(n => parseInt(n));
    }

    static joinCoordinates(...coordinates) {
        return coordinates.join("|");
    }

    /**
     * @param {number} x
     * @param {number} y y coordinate or state
     * @param {number} z
     * @param {number} w
     * @param {boolean} state
     */
    constructor(x, y, z, w, state = false) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.active = state;
        this.generateNeighbourCoordinates();
    }

    get coordinate() {
        return Point.joinCoordinates(this.x, this.y, this.z, this.w);
    }

    generateNeighbourCoordinates() {
        this.neighbourCoordinates = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {
                        if (i === j && j === k && k === l && l === 0) {
                            continue;
                        }
                        this.neighbourCoordinates.push(
                            Point.joinCoordinates(this.x + i, this.y + j, this.z + k, this.w + l)
                        );
                    }
                }
            }
        }
    }

    calculateNextState(activePoints) {
        let neighbourCount = this.neighbourCoordinates.reduce(
            (sum, coordinate) => sum + (activePoints.has(coordinate) ? 1 : 0),
            0
        );
        if (this.active) {
            this.nextState = neighbourCount === 3 || neighbourCount === 2;
        } else {
            this.nextState = neighbourCount === 3;
        }
        // console.log(this.coordinate, neighbourCount, this.active, this.nextState);
    }
}
