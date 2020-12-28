const fs = require('fs');
const readline = require('readline');
const path = require('path');

const INPUT = "";

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(`${adventDay}-input${INPUT}.txt`);
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = {
        nodes: new Map(),
        messages: []
    };
    let type = "rules";
    for await (const line of rl) {
        // 22: 75 53 | 18 90
        // aaaaaaaabbbbaabaabbbaaba
        if (line === "") {
            type = "messages";
        } else if (type === "rules") {
            const capturingRegex = /(?<rule>\d+): "?(?<rule1>((\d+|[ab]) ?)+)"?(\| (?<rule2>(\d+ ?)+))?/;
            const found = line.match(capturingRegex);
            const number = parseInt(found.groups.rule);
            const rule1 = parseRule(found.groups.rule1);
            const rule2 = parseRule(found.groups.rule2);
            const node = {
                id: number,
                rules: [],
                possibilities: null
            };
            if (rule1 !== null) {
                node.rules.push(rule1);
            }
            if (rule2 !== null) {
                node.rules.push(rule2);
            }
            data.nodes.set(number, node);
        } else {
            data.messages.push(line);
        }
    }

    return data;
}

function parseRule(rule) {
    if (rule === undefined) {
        return null;
    } else {
        return rule.trim().split(" ").map(n => isNaN(parseInt(n)) ? n : parseInt(n));
    }
}

processLineByLine().then(data => {
    // for (let entry of data.nodes.values()) {
    //     console.log(entry.id, "-->", JSON.stringify(entry));
    // }

    const allPossibilities = new Set(collectPossibilities(data.nodes.get(0), data.nodes));
    // console.log("all:", allPossibilities);
    // console.log("messages:", data.messages);

    // Part 1
    let okMessages = data.messages.filter(m => allPossibilities.has(m));
    console.log("ok messages count:", okMessages.length);
    // console.log("ok messages:", okMessages);

    // Part 2
    const part2OkMessages = collectOkMessagesPart2(data, allPossibilities);
    okMessages = okMessages.concat(part2OkMessages);
    okMessages.sort();
    console.log("ok messages count - Part 2:", okMessages.length);
    // console.log("ok messages 2:", okMessages);
});

/**
 *
 * @param {Object} node
 * @param {number} node.id
 * @param {[][]} node.rules
 * @param {string[]|null} node.possibilities
 * @param {Map<string,Object>} nodes
 * @returns {string[]}
 */
function collectPossibilities(node, nodes) {
    if (node.possibilities !== null) {
        return node.possibilities;
    }

    node.possibilities = [];
    for (let rule of node.rules) {
        let rulePossibilities = [""];
        for (let item of rule) {
            let itemPossibilities;
            if (typeof item === "string") {
                itemPossibilities = [item];
            } else {
                itemPossibilities = collectPossibilities(nodes.get(item), nodes);
            }
            let nextRulePossibilities = [];
            for (let itemPossibility of itemPossibilities) {
                const buffer = rulePossibilities.map(rp => rp + itemPossibility);
                nextRulePossibilities.push(...buffer);
            }
            rulePossibilities = nextRulePossibilities;
        }
        node.possibilities = node.possibilities.concat(rulePossibilities);
    }
    return node.possibilities;
}

/**
 * @param {{
 *      nodes: Map<number, {possibilities: string[]}>,
 *      messages: [] } } data
 * @param {string[]} allPossibilities
 */
function collectOkMessagesPart2(data, allPossibilities) {
    const node42s = `(${data.nodes.get(42).possibilities.join("|")})`;
    const node31s = `(${data.nodes.get(31).possibilities.join("|")})`;
    let doublesRegExp = `${node42s}+${node42s}`;
    const nestedRegExp = `${node42s}${node42s}${node31s}${node31s}`;

    let okMessages = [];
    for (let message of data.messages) {
        let isOkByVariant = isOkByVariants(message, nestedRegExp, doublesRegExp, allPossibilities);
        if (isOkByVariant) {
            okMessages.push(message);
        }
    }
    return okMessages;
}

function isOkByVariants(message, nestedRegExpString, doublesRegExpString, allPossibilities) {
    let variants = new Set([message]);
    while (variants.size > 0) {
        let variantsBuffer = new Set();
        for (const variant of variants) {
            /* */
            let doubleMatch;
            /*
            let doublesRegExp = new RegExp(doublesRegExpString, 'g');
            while ((doubleMatch = doublesRegExp.exec(variant)) !== null) {
                let frontSlice = variant.slice(0, doubleMatch.index);
                let replaced = frontSlice + variant.slice(doubleMatch.index)
                    .replace(doubleMatch[1] + doubleMatch[2], doubleMatch[1]);
            */
            let doublesRegExp = new RegExp(doublesRegExpString);
            if ((doubleMatch = doublesRegExp.exec(variant)) !== null) {
                let frontSlice = variant.slice(0, doubleMatch.index);
                let replaced = frontSlice + variant.slice(doubleMatch.index)
                    .replace(doubleMatch[1] + doubleMatch[2], doubleMatch[1]);
                variantsBuffer.add(replaced);
                // console.log(doubleMatch);
                // console.log(`${variant} ---> ${replaced} (${doubleMatch[1]}, ${doubleMatch[2]})`);
            }
            /* */
            let nestedMatch;
            // let nestedRegExp = new RegExp(nestedRegExpString, 'g');
            // while ((nestedMatch = nestedRegExp.exec(variant)) !== null) {
                // let frontSlice = variant.slice(0, nestedMatch.index);
                // let replaced = frontSlice + variant.slice(nestedMatch.index)
                //     .replace(nestedMatch[0], nestedMatch[1] + nestedMatch[4]);
            let nestedRegExp = new RegExp(nestedRegExpString);
            if ((nestedMatch = nestedRegExp.exec(variant)) !== null) {
                let replaced = variant.replace(nestedMatch[0], nestedMatch[1] + nestedMatch[4]);
                variantsBuffer.add(replaced);
                // console.log(nestedMatch);
                // console.log(`${variant} ---> ${replaced} (${nestedMatch[0]} ${nestedMatch[1]} ${nestedMatch[4]})`);
            }
            /* */
        }
        variants = variantsBuffer;
        let isValid = [...variants].reduce((isValid, b) => isValid || allPossibilities.has(b), false);
        if (isValid) {
            return true;
        }
    }
    return false;
}
