const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    let buffer = [];

    for await (const line of rl) {
        if (line !== "") {
            buffer.push(line);
            continue;
        }
        data.push(buffer);
        buffer = [];
    }
    if (buffer.length !== 0) {
        data.push(buffer);
    }

    return data;
}

processLineByLine().then(allAnswers => {
    let anyTrueAnswerCount = 0;
    let allTrueAnswerCount = 0;
    for (let groupAnswers of allAnswers) {
        const groupSize = groupAnswers.length;
        const flatGroupAnswers = groupAnswers.flatMap(e => e.split(""));
        const groupAnswersSet = new Set(flatGroupAnswers);
        anyTrueAnswerCount += groupAnswersSet.size;

        let answerLetters = {};
        for (let answer of flatGroupAnswers) {
            if (!answerLetters.hasOwnProperty(answer)) {
                answerLetters[answer] = 0;
            }
            answerLetters[answer]++;
            allTrueAnswerCount += (answerLetters[answer] === groupSize) ? 1 : 0
        }
    }
    console.log("any true: ", anyTrueAnswerCount);
    console.log("all true: ", allTrueAnswerCount);
});
