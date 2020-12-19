const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        // 1 + (2 * 3) + (4 * (5 + 6))
        data.push(
            line
                .replaceAll(" ", "")
                .split("")
                .map(x => isNaN(parseInt(x)) ? x : parseInt(x))
        );
    }
    return data;
}

processLineByLine().then(data => {
    let lineResults = [];
    for (let lineNumber = 0; lineNumber < data.length; lineNumber++) {
        let line = data[lineNumber];
        let values = [];
        let operators = []
        // Thanks for the algorithm inspiration:
        // https://www.cis.upenn.edu/~matuszek/cit594-2002/Assignments/5-expressions.html
        for (let [index, next] of line.entries()) {
            if ("number" === typeof next) {
                values.push(next);
            } else if ("(" === next) {
                operators.push(next);
            } else {
                while (operators.length > 0) {
                    const op = operators.pop();
                    if (")" === next && "(" === op) {
                        break;
                    } else if (
                        ["*", "+"].includes(next) &&
                        ("+" === next && "*" === op || "(" === op)
                    ) {
                        operators.push(op);
                        break;
                    }
                    evaluateOperator(values, op);
                }
                if (")" !== next) {
                    operators.push(next);
                }
            }
            // console.log(operators, values, "<<<", line.slice(index + 1));
        }
        // console.log("*******************");
        while (operators.length > 0) {
            evaluateOperator(values, operators.pop());
        }

        lineResults[lineNumber] = values.shift();
    }
    // 71, 51, 26, 437, 12240, 13632
    // 231, 51, 46, 1445, 669060, 23340
    console.log(lineResults);
    console.log(lineResults.reduce((sum, v) => sum + v));
})

function evaluateOperator(values, op) {
    const a = values.pop();
    const b = values.pop();
    values.push("+" === op ? a + b : a * b);
}
