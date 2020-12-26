const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
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
    const allPossibilities = collectPossibilities(data.nodes.get(0), data.nodes);
    // for (let entry of data.nodes.entries()) {
    //     console.log(entry[0], "-->", JSON.stringify(entry[1]));
    // }
    const okMessages = data.messages.filter(m => allPossibilities.includes(m));

    // console.log("************************");
    // console.log("all:", allPossibilities);
    // console.log("messages:", data.messages);
    console.log("ok messages count:", okMessages.length);
});

/**
 *
 * @param {Object} node
 * @param {number} node.id
 * @param {[][]} node.rules
 * @param {string[]|null} node.possibilities
 * @param nodes
 * @returns {[string]|*}
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
