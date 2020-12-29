const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (let line of rl) {
        data = line.split("").map(n => parseInt(n));
    }
    return data;
}

let LOG = true;
processLineByLine().then(data => {
    console.time('from-start');
    LOG = false;

    let solutionCups;
    const dataExample = "389125467".split("").map(n => parseInt(n));
    /* Part 1 - Example */
    let crabCupGameExample = new CrabCups(dataExample, 100);
    solutionCups = crabCupGameExample.play();
    console.log("Part 1 - Example:\n" + CrabCups.cupsString(solutionCups));

    /* Part 1 */
    let crabCupGamePart1 = new CrabCups(data);
    solutionCups = crabCupGamePart1.play();
    console.log("Part 1:\n" + CrabCups.cupsString(solutionCups));

    LOG = false;
    /* Part 2 - Example */
    let crabCupGamePart2Example = new CrabCups(dataExample, 10000000, 1000000);
    solutionCups = crabCupGamePart2Example.play(2);
    console.log("Part 2 - Example:\n",
        CrabCups.cupsString(solutionCups),
        solutionCups.reduce((m, c) => m * c.label, 1)
    );

    /* */
    let crabCupGamePart2 = new CrabCups(data, 10000000, 1000000);
    solutionCups = crabCupGamePart2.play(2);
    console.log("Part 2:\n",
        CrabCups.cupsString(solutionCups),
        solutionCups.reduce((m, c) => m * c.label, 1)
    );

    /* */
    console.timeEnd('from-start');
});

class CrabCups {
    /** @type Cup */
    cupOne;
    cups = new Map();
    currentId = 0;

    constructor(data, rounds = 100, numberOfCups = null) {
        this.numberOfCups = numberOfCups || data.length;
        this.rounds = rounds;

        for (let id = 0; id < this.numberOfCups; id++) {
            let label = id < data.length ? data[id] : id + 1;
            let destinationLabel = label > 1 ? label - 1 : this.numberOfCups;

            let destinationId = destinationLabel <= data.length ?
                data.indexOf(destinationLabel) :
                destinationLabel - 1;

            destinationId = destinationId < 0 ? this.numberOfCups - 1 : destinationId;

            const cup = new Cup(id, label);
            this.cups.set(id, cup);
            cup.destinationId = destinationId;
            cup.idOfNext = (id + 1).mod(this.numberOfCups);
            cup.game = this;
            if (cup.label === 1) {
                this.cupOne = cup;
            }
        }
        // console.log(data);
        // console.log(this.cups);
        // console.log(CrabCups.cupsString([...this.cups.values()], false));
    }

    play(solutionCupsCount = null) {
        for (let round = 0; round < this.rounds; round++) {
            if (round % 1000000 === 0 && round > 0) {
                console.timeLog('from-start', 'round:', round);
            }
            const currentCup = this.cups.get(this.currentId);
            let pickedUpCups = this.pickupCups(3);
            let destinationCup = this.getDestinationCup(currentCup);

            gameLog(`\n --- move ${round + 1} ---`);
            gameLog(`cups: ${this.getCupsLoopString()}`);
            gameLog(`pick up: ${pickedUpCups.map(c => c.label)}`);
            gameLog(`destination: ${destinationCup.label}`);

            this.insertCupsAfterCup(pickedUpCups, destinationCup);
            this.currentId = currentCup.idOfNext;
        }

        return this.cupOne.getNextCups(
            solutionCupsCount || this.cups.size - 1);
    }

    pickupCups() {
        const currentCup = this.cups.get(this.currentId);
        let pickedUpCups = currentCup.getNextCups(3);
        pickedUpCups.map(c => c.pickedUp = true);
        currentCup.idOfNext = pickedUpCups[2].idOfNext;
        return pickedUpCups;
    }

    getDestinationCup(currentCup) {
        let destinationCup = currentCup;
        do {
            destinationCup = this.cups.get(destinationCup.destinationId);
        } while (destinationCup.pickedUp);
        return destinationCup;
    }

    insertCupsAfterCup(pickedUpCups, destinationCup) {
        let nextId = destinationCup.idOfNext;
        destinationCup.idOfNext = pickedUpCups[0].id
        pickedUpCups[2].idOfNext = nextId;
        pickedUpCups.map(c => c.pickedUp = false);
    }

    getCupsLoopString() {
        if (!LOG) {
            return "Sorry, log is turned off...";
        }

        let cupLabels = []
        let cup = this.cups.get(0);
        do {
            let label = cup.label;
            if (cup.id === this.currentId) {
                label = `(${label})`;
            }
            cupLabels.push(label);
            cup = this.cups.get(cup.idOfNext);
        } while (cup.id !== 0);
        return cupLabels.join(" ")
    }

    static cupsString(cups, onlyLabels = true) {
        return cups.map(
            c => onlyLabels ?
                c.label :
                JSON.stringify(c, ['id', 'label', 'destinationId', 'idOfNext'])
        ).join(onlyLabels ? " " : "\n");
    }
}

class Cup {
    id;
    label;
    destinationId = null;
    pickedUp = false;
    idOfNext = null;
    /** @type {CrabCups} */
    game = null;

    constructor(id, label) {
        this.id = id;
        this.label = label;
    }

    /**
     * @param {number} count
     * @return {Cup[]}
     */
    getNextCups(count = 3) {
        let cups = [];
        let nextCup = this;
        for (let i = 0; i < count; i++) {
            nextCup = nextCup.getNextCup();
            cups.push(nextCup);
        }
        return cups;
    }

    getNextCup() {
        return this.game.cups.get(this.idOfNext);
    }
}

function gameLog(...toLog) {
    if (LOG) {
        console.log(...toLog);
    }
}

Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
};
