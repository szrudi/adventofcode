const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = new Map();
    for await (const line of rl) {
        const rule = parseLine(line);
        data.set(rule["bagType"], rule.quantities);
    }
    return data;
}

function parseLine(line) {
    // plaid chartreuse
    //     bags contain
    //      2 clear cyan bags,
    //      1 bright blue bag,
    //      2 dark violet bags,
    //      1 dark chartreuse bag.

    const splitLine = line.split(" bags contain ");
    const bagType = splitLine[0];
    let rule = {bagType, quantities: []};

    const capturingRegex = /(?<number>\d|no*) (?<type>.*?) bag[s]?[,.] ?/g;
    const matchArrays = splitLine[1].matchAll(capturingRegex);
    for (let match of matchArrays) {
        rule.quantities.push(Object.assign({}, match.groups));
    }
    // console.log(rule);
    return rule;
}

processLineByLine().then(allRules => {
    // console.log(allRules);
    let goldCount = 0;
    for (let type of allRules.keys()) {
        const foundGold = findGold(allRules, type);
        if (foundGold) {
            // console.log("found gold in", type);
            goldCount++;
        }
    }
    console.log("colors with gold: ", goldCount);
    console.log("sum under gold: ", sumTree(allRules, "shiny gold"));
});

function findGold(allRules, type) {
    const quantities = allRules.get(type);
    let foundGold = false;
    for (let quantity of quantities) {
        // console.log(quantity);
        if (quantity['number'] === 'no') {
            // console.log('the end');
            return false;
        } else {
            // console.log(quantity['type']);
            if (quantity['type'] === "shiny gold") {
                // console.log("found a shiny gold");
                return true;
            } else {
                foundGold |= findGold(allRules, quantity['type']);
            }
        }
    }
    return foundGold;
}

function sumTree(allRules, type) {
    const quantities = allRules.get(type);
    let sum = 0;
    for (let quantity of quantities) {
        // console.log(quantity);
        if (quantity['number'] !== 'no') {
            sum +=
                parseInt(quantity['number']) + (
                    parseInt(quantity['number']) *
                    sumTree(allRules, quantity['type'])
                );
        }
    }
    return sum;
}

