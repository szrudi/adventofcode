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
            Validator.list.push(new Validator(found.groups));
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

processLineByLine().then(data => {
    // console.log(data);
    let columnSearch = new TicketColumnSearch(data);
    console.log(columnSearch.getSolution());
});

class TicketColumnSearch {
    /**
     * @param {Object} data
     * @param {Ticket} data.ticket
     * @param {Ticket[]} data.nearBy
     */
    constructor(data) {
        this.myTicket = data.ticket;
        this.nearByTickets = data.nearBy;
    }

    getSolution() {
        let ticketScanningErrorRate = this.validateTickets();
        console.log(ticketScanningErrorRate);

        this.matchColumnsToValidators();
        let columns = this.figureOutColumnNames();
        console.log(columns);
        return this.calculateSolution(columns);
    }

    validateTickets() {
        let ticketScanningErrorRate = 0;
        for (let ticket of this.nearByTickets) {
            let invalidValues = ticket.validate();
            if (invalidValues.length > 0) {
                ticketScanningErrorRate += invalidValues.reduce((sum, v) => sum + v, 0);
            }
        }
        return ticketScanningErrorRate;
    }

    matchColumnsToValidators() {
        const validTickets = [this.myTicket, ...this.nearByTickets.filter(t => t.isValid)];
        for (let column = 0; column < this.myTicket.values.length; column++) {
            validator_checks:
                for (let validator of Validator.list) {
                    for (let ticket of validTickets) {
                        if (!validator.isValid(ticket.values[column])) {
                            continue validator_checks;
                        }
                    }
                    validator.validColumns.push(column);
                }
        }
    }

    figureOutColumnNames() {
        let columns = [];
        while (Validator.list.length > 0) {
            Validator.list.sort((v1, v2) => v1.validColumns.length - v2.validColumns.length);
            const validator = Validator.list.shift();
            columns.push([validator.validColumns[0], validator.fieldName]);
            Validator.list.map(v => {
                v.validColumns = v.validColumns.filter(n => n !== validator.validColumns[0]);
            });
        }
        columns.sort((a, b) => a[0] - b[0]);
        return columns;
    }

    calculateSolution(columns) {
        return columns.reduce((solution, item) => {
            const [colIndex, name] = item;
            if (name.startsWith("departure")) {
                solution *= this.myTicket.values[colIndex]
            }
            return solution;
        }, 1);
    }
}

class Ticket {
    /** @type { number[] } */
    values = [];
    /** @type { boolean | null } */
    isValid = null;

    constructor(values) {
        this.values = values;
    }

    validate() {
        let invalidValues = [];
        for (let value of this.values) {
            if (!Validator.list.some(validator => validator.isValid(value))) {
                invalidValues.push(value);
                this.isValid = false;
            }
        }
        this.isValid = this.isValid === null;
        return invalidValues;
    }
}

class Validator {
    /** @type { Validator[] } */
    static list = [];

    /** @type [string} */
    fieldName;
    /**
     * @type {Object}
     * @property {number} min
     * @property {number} max
     */
    lowerRange = {};
    /**
     * @type {Object}
     * @property {number} min
     * @property {number} max
     */
    upperRange = {};
    validColumns = [];

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
