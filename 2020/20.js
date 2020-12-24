const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = new Map();
    let currentTileId = null;
    for await (const line of rl) {
        if (line.startsWith("Tile ")) {
            currentTileId = parseInt(line.split(" ")[1].slice(0, -1));
            data.set(currentTileId, new Tile(currentTileId));
        } else if (line !== "") {
            data.get(currentTileId).lines.push(line.split(""));
        }
    }
    return data;
}

processLineByLine().then(data => {
    let area = new Area(data);
    area.startSearch();
    area.drawArea();
    area.drawIds();

    // Part 2
    let buffer = area.markSeaMonsters();
    console.log(buffer.reduce((count, line) => count + line.filter(c => c === "#").length,0));
});

class Area {
    /** @type Map<string, Tile> */
    #areaMap = new Map();

    /**
     * Sea Monster:
     * "..................#"    18
     * "#....##....##....###"   0,5,6,11,12,17,18,19
     * ".#..#..#..#..#..#"      1,4,7,10,13,16
     */
    static seaMonster = [[18], [0, 5, 6, 11, 12, 17, 18, 19], [1, 4, 7, 10, 13, 16]];

    /**
     * @param {Map<number, Tile>} tiles
     */
    constructor(tiles) {
        /** @type {Map<number, Tile>} All tiles */
        this.tilesUnplaced = tiles;
    }

    static coordinateString(x, y) {
        return `${x}|${y}`
    }

    static oppositeDirection(direction) {
        return (direction + 2) % Object.values(Dir).length
    }

    startSearch() {
        let tile = this.tilesUnplaced.values().next().value
        // Area.debugDrawOrientations(tile);
        tile.flipped = Flipped.VERTICAL; // just to see the same as the example
        this.addTile(tile, 0, 0);
        tile.findNeighbours();
    }

    addTile(tile, x, y) {
        if (this.#areaMap.has(Area.coordinateString(x, y))) {
            throw new Error(`Already taken coordinates: ${x} ${y}`);
        }
        tile.area = this;
        tile.setCoordinates(x, y);
        this.#areaMap.set(tile.coordinate, tile);
        this.tilesUnplaced.delete(tile.id);
        this.setNeighbours(tile);
    }

    setNeighbours(tile) {
        for (let direction of Object.values(Dir)) {
            let xy = tile.getNeighbourCoordinates(direction);
            let neighbour = this.#areaMap.get(Area.coordinateString(...xy));
            if (neighbour !== undefined) {
                tile.neighbours.set(direction, neighbour);
                neighbour.neighbours.set(Area.oppositeDirection(direction), tile);
            }
        }
    }

    markSeaMonsters() {
        let buffer = Area.getFullMapBuffer(this.#areaMap);
        buffer.forEach(l => console.log(l.join("")));
        let foundMonster = false;
        for (let flip of Object.values(Flipped)) {
            let tempBuffer = Tile.doFlip(buffer, flip);
            console.log("flip", flip);
            for (let rotate of Object.values(Dir)) {
                console.log("rotate", rotate);
                tempBuffer = Tile.doRotate(tempBuffer, 1);
                // tempBuffer.forEach(l => console.log(l.join(" ")));
                for (let lineIndex = 0; lineIndex < tempBuffer.length - 2; lineIndex++) {
                    for (let i = 0; i < tempBuffer[lineIndex].length - 20; i++) {
                        let window = tempBuffer
                            .slice(lineIndex, lineIndex + 3)
                            .map(l => l.slice(i, i + 20));
                        // console.log("check monster", lineIndex, i);
                        // window.forEach(l => console.log(l.join("")));
                        if (Area.checkSeaMonster(window)) {
                            Area.markSeaMonster(tempBuffer, i, lineIndex);
                            console.log("Sea Monster!!");
                            foundMonster = true;
                        }
                    }
                }
                if (foundMonster) {
                    tempBuffer.forEach(l => console.log(l.join("")));
                    return tempBuffer
                }
            }
        }
    }

    static checkSeaMonster(window) {
        for (let i = 0; i < Area.seaMonster.length; i++) {
            for (let j of (Area.seaMonster)[i]) {
                if (window[i][j] !== "#") {
                    return false
                }
            }
        }
        return true;
    }

    static markSeaMonster(buffer, x, y) {
        for (let i = 0; i < Area.seaMonster.length; i++) {
            for (let j of (Area.seaMonster)[i]) {
                buffer[y + i][x + j] = "▓"
            }
        }
        return buffer;
    }

    /**
     * @param {Map<string,Tile>} map
     * @returns {string[][]}
     */
    static getFullMapBuffer(map) {
        let buffer = [];
        let size = Area.getMapSize(map);
        for (let y = size.y.min; y <= size.y.max; y++) {
            for (let i = 1; i < Tile.squareSize - 1; i++) {
                let line = [];
                for (let x = size.x.min; x <= size.x.max; x++) {
                    const tile = map.get(Area.coordinateString(x, y));
                    line.push(...(tile.orientedTileLines[i].slice(1, -1)));
                }
                buffer.push(line);
            }
        }
        return buffer;
    }

    drawArea() {
        Area.drawMap(this.#areaMap);
    }

    drawIds() {
        Area.drawMap(this.#areaMap, true);
    }

    static drawMap(map, onlyIds = false) {
        let size = this.getMapSize(map);
        const squareSize = onlyIds ? 1 : Tile.squareSize;
        const border = onlyIds ? " " : " ";
        const padding = onlyIds ? "" : "";
        for (let y = size.y.min; y <= size.y.max; y++) {
            for (let i = 0; i < squareSize; i++) {
                let line = [];
                for (let x = size.x.min; x <= size.x.max; x++) {
                    const tile = map.get(Area.coordinateString(x, y));
                    let string;
                    if (tile === undefined) {
                        string = "----" + onlyIds ? "" : "------";
                    } else {
                        if (onlyIds) {
                            string = tile.id;
                        } else {
                            string = tile.orientedTileLines[i].join(padding);
                            string = padding + string + padding;
                        }
                    }
                    line.push(string);
                }
                console.log(line.join(border));
            }
            if (!onlyIds) {
                console.log("");
            }
        }
    }

    static getMapSize(map) {
        let axis = {
            x: {min: null, max: null},
            y: {min: null, max: null},
        };
        for (let tile of map.values()) {
            axis.x.min = Math.min(tile.x, axis.x.min)
            axis.x.max = Math.max(tile.x, axis.x.max)
            axis.y.min = Math.min(tile.y, axis.y.min)
            axis.y.max = Math.max(tile.y, axis.y.max)
        }
        return axis;
    }

    static debugDrawTiles(direction, ...tiles) {
        console.log("-----------------------------------")
        const map = new Map();
        let originalCoordinates = [];
        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];
            console.log(
                tile.id, "-",
                Object.entries(Flipped).find(e => e[1] === tile.flipped)[0], "-",
                Object.entries(Dir).find(e => e[1] === tile.rotated)[0],
            );
            originalCoordinates.push([tile.x, tile.y]);
            if (i === 0) {
                tile.setCoordinates(0, 0);
            } else {
                tile.setCoordinates(...tiles[i - 1].getNeighbourCoordinates(direction));
            }
            map.set(tile.coordinate, tile);
        }
        Area.drawMap(map, true);
        Area.drawMap(map, false);
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].setCoordinates(...originalCoordinates[i]);
        }
    }

    static debugDrawOrientations(tile) {
        for (let flip of Object.values(Flipped)) {
            let tilesRotated = [];
            for (let direction of Object.values(Dir)) {
                tile.rotated = direction;
                tile.flipped = flip;
                let cloneTile = new Tile(null);
                cloneTile.populate(tile);
                tilesRotated.push(cloneTile);
            }
            Area.debugDrawTiles(Dir.RIGHT, ...tilesRotated)
        }
    }

}

class Tile {
    /** @type {null | Map<Flipped, number[][]>} */
    #orientations = new Map();
    static squareSize = 10;

    constructor(id) {
        /** @type number */
        this.id = id;
        /** @type number[][] */
        this.lines = [];
        this.x = null;
        this.y = null;
        /** @type Area | null */
        this.area = null;
        /**
         * Facing direction of Tile (original top is facing this direction)
         * @type {Dir}
         */
        this.rotated = Dir.TOP;
        /** @type {Flipped} */
        this.flipped = Flipped.ORIGINAL;
        /** @type {Map<Dir, Tile>} */
        this.neighbours = new Map();
    }

    get coordinate() {
        if (this.x === null || this.y === null) {
            throw new Error("No coordinates set yet!");
        }
        return Area.coordinateString(this.x, this.y);
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    findNeighbours() {
        for (let direction of Object.values(Dir)) {
            if (this.neighbours.has(direction)) {
                continue;
            }
            for (let [id, tile] of this.area.tilesUnplaced) {
                if (id === this.id) {
                    // this should not happen
                    console.log("same tile!");
                    continue;
                }
                if (this.matches(tile, direction)) {
                    let xy = this.getNeighbourCoordinates(direction);
                    try {
                        this.area.addTile(tile, ...xy);
                        tile.findNeighbours();
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }
        }
    }

    /**
     * @param {Tile} tile
     * @param {Dir} direction
     */
    matches(tile, direction) {
        const thisBorder = this.borders[direction];
        for (let rotate of Object.values(Dir)) {
            tile.rotated = rotate;
            for (let flip of Object.values(Flipped)) {
                tile.flipped = flip;
                // Area.debugDrawTiles(direction, this, tile);
                let tileBorder = tile.borders[Area.oppositeDirection(direction)];
                if (thisBorder === tileBorder) {
                    // console.log("********** it's a match *************")
                    return true;
                }
            }
        }
        return false;
    }

    getNeighbourCoordinates(direction) {
        let x = this.x + (direction % 2 === 1 ? (Dir.LEFT === direction ? -1 : 1) : 0);
        let y = this.y + (direction % 2 === 0 ? (Dir.TOP === direction ? -1 : 1) : 0);
        return [x, y];
    }

    get borders() {
        const [sideLeft, sideRight] = this.orientedTileLines.reduce((sides, l) => {
            sides[0] += l[0];
            sides[1] += l[Tile.squareSize - 1];
            return sides
        }, ["", ""]);
        return [
            this.orientedTileLines[0].join(""),
            sideRight,
            this.orientedTileLines[Tile.squareSize - 1].join(""),
            sideLeft,
        ];
    }

    get orientedTileLines() {
        const orientationId = `${this.flipped}|${this.rotated}`;
        let orientedTile = this.#orientations.get(orientationId);
        if (orientedTile === undefined) {
            orientedTile = this.#generateOrientation(this.flipped, this.rotated);
            this.#orientations.set(orientationId, orientedTile);
        }
        return orientedTile;
    }

    #generateOrientation(flip, rotate) {
        let buffer = Tile.doFlip(this.lines, flip);
        return Tile.doRotate(buffer, rotate);
    }

    static doFlip(lines, flip) {
        if (flip === Flipped.ORIGINAL) {
            return Array.from(lines);
        }
        const height = lines.length;
        const width = lines[0].length;
        let axis = {
            x: {
                min: flip === Flipped.HORIZONTAL ? width - 1 : 0,
                increment: flip === Flipped.HORIZONTAL ? -1 : +1,
            },
            y: {
                min: flip === Flipped.VERTICAL ? height - 1 : 0,
                increment: flip === Flipped.VERTICAL ? -1 : +1,
            },
        };

        let buffer = [];
        for (let i = 0; i < height; i++) {
            let y = axis.y.min + i * axis.y.increment;
            for (let j = 0; j < width; j++) {
                let x = axis.x.min + j * axis.x.increment;
                if (buffer[i] === undefined) {
                    buffer[i] = [];
                }
                buffer[i][j] = lines[y][x];
            }
        }
        return buffer;
    }

    static doRotate(lines, times) {
        let buffer = Array.from(lines);
        for (let i = 0; i < times; i++) {
            // thx to https://stackoverflow.com/a/58668351
            buffer = buffer[0].map(
                (val, index) =>
                    buffer.map(row => row[index]).reverse());
        }
        return buffer;
    }

    draw() {
        Area.debugDrawTiles(Dir.RIGHT, this);
    }

    populate(tile) {
        for (let tileKey in tile) {
            if (tile.hasOwnProperty(tileKey))
                this[tileKey] = tile[tileKey]
        }
    }
}

/**
 * Possible directions
 * @enum {string}
 */
const Dir = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
};

/**
 * Orientation of Tile
 * @enum {string}
 */
const Flipped = {
    ORIGINAL: 0,
    VERTICAL: 1,
    HORIZONTAL: 2,
};
