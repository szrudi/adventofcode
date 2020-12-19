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
        let stack = [];

        for (let [index, x] of line.entries()) {
            if (x === ")") {
                x = stack.pop();
            }
            if (typeof x === "number") {
                if (typeof stack[stack.length - 1] === "string") {
                    let operand = stack.pop();
                    if (operand === "+") {
                        stack[stack.length - 1] += x;
                    } else if (operand === "*") {
                        stack[stack.length - 1] *= x;
                    } else if (operand === "(") {
                        stack.push(x);
                    }
                } else {
                    stack.push(x);
                }
            } else if (["*", "+", "("].includes(x)) {
                stack.push(x);
            }
            // console.log(stack, "<<<", line.slice(index+1));
        }
        lineResults[lineNumber] = stack.shift();
    }
    // 71, 51, 26, 437, 12240, 13632.
    console.log(lineResults);
    console.log(lineResults.reduce((sum, v) => sum + v));
})
