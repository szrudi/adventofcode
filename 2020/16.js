const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = {
        ticket: null,
        nearBy: []
    };

    let states = ["validators", "ticket", "nearby"];
    let stateIndex = 0;
    for await (const line of rl) {
        if (line === "your ticket:" ||
            line === "nearby tickets:") {
            stateIndex++;
            continue;
        } else if (line === "") {
            continue;
        }
        let state = states[stateIndex];
        if (state === "validators") {
            // departure location: 49-920 or 932-950
            const capturingRegex = /(?<field>[\w ]+): (?<from1>\d+)-(?<to1>\d+) or (?<from2>\d+)-(?<to2>\d+)/;
            const found = line.match(capturingRegex);
            Ticket.validators.push(new Validator(found.groups));
        } else {
            //101,179,193,103,53,89,181,139,137,97,61,71,197,59,67,173,199,211,191,131
            const ticket = new Ticket(line.split(",").map(v => parseInt(v)));
            if (state === "ticket") {
                data.ticket = ticket;
            } else if (state === "nearby") {
                data.nearBy.push(ticket);
            }
        }
    }
    return data;
}

processLineByLine().then(
    /**
     * @type {Object} data
     * @param {Ticket} data.ticket
     * @param {Ticket[]} data.nearBy
     */
    data => {
        console.log(data);
        let ticketScanningErrorRate = 0;
        for (let ticket of data.nearBy) {
            let invalidValues = ticket.getInvalidValues();
            if (invalidValues.length > 0) {
                ticketScanningErrorRate += invalidValues.reduce((sum, v) => sum + v, 0);
            }
        }
        console.log(ticketScanningErrorRate);
    });

/**
 * @property { number[] } values
 * @property { boolean | null } isValid
 * @property { Array<Validator> } validators
 */
class Ticket {
    values = [];
    isValid = null;
    static validators = [];

    constructor(values) {
        this.values = values;
    }

    getInvalidValues() {
        let invalidValues = [];
        for (let value of this.values) {
            const someValid = Ticket.validators.some(validator => validator.isValid(value));
            if (!someValid) {
                invalidValues.push(value);
            }
        }
        return invalidValues;
    }
}

/**
 * @property {string} fieldName
 * @property {Object} lowerRange
 * @property {number} lowerRange.min
 * @property {number} lowerRange.max
 * @property {number} upperRange.min
 * @property {number} upperRange.max
 */
class Validator {
    fieldName;
    lowerRange = {};
    upperRange = {};

    /**
     * @param {Object} data
     * @param {string} data.field
     * @param {number} data.from1
     * @param {number} data.to1
     * @param {number} data.from2
     * @param {number} data.to2
     */
    constructor(data) {
        this.fieldName = data.field;
        this.lowerRange.min = data.from1;
        this.lowerRange.max = data.to1;
        this.upperRange.min = data.from2;
        this.upperRange.max = data.to2;
    }

    /**
     * @param {number} value
     * @returns {boolean}
     */
    isValid(value) {
        return this.lowerRange.min <= value && value <= this.lowerRange.max ||
            this.upperRange.min <= value && value <= this.upperRange.max;
    }
}
