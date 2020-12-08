const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        const instruction = line.split(" ");
        data.push({
            operation: instruction[0],
            argument: parseInt(instruction[1]),
        });
    }
    return data;
}

processLineByLine().then(allInstructions => {
    console.log(allInstructions);
    let threads = [{
        id: 0,
        current: 0,
        changeAt: null,
        accumulator: 0,
        loopAt: null,
        finished: null,
        executed: new Set(),
    }];
    bootSequence:
        while (true) {
            const runningThreads = threads.filter(t => t.loopAt === null);
            if (runningThreads <= 0) {
                break;
            }
            for (let thread of runningThreads) {
                // console.log("**********************",);
                // console.log("Threads:", threads);
                const instruction = allInstructions[thread.current];
                if (instruction === undefined) {
                    thread.finished = true;
                    break bootSequence;
                }

                if (thread.executed.has(thread.current)) {
                    thread.loopAt = thread.current;
                    continue;
                } else {
                    thread.executed.add(thread.current);
                }

                if (instruction.operation === "acc") {
                    thread.accumulator += instruction.argument;
                    thread.current += 1;
                } else {
                    if (thread.changeAt === null) {
                        threads.push(startNewThread(
                            threads.length,
                            thread,
                            instruction.operation === "jmp" ? 1 : instruction.argument)
                        );
                    }
                    thread.current += instruction.operation === "jmp" ? instruction.argument : 1;
                }
            }
        }
    console.log("Threads:", threads);
    console.log("Looped threads:", threads.filter(t => t.loopAt !== null).map(t => t.id));
    console.log("Finished threads:", threads.filter(t => t.finished).map(t => t.id));
    console.log("Finished thread:", threads.filter(t => t.finished));
});

function startNewThread(id, thread, jmpValue) {
    let newThread = Object.assign({}, thread);
    newThread.id = id;
    newThread.current += jmpValue;
    newThread.changeAt = thread.current;
    newThread.executed = new Set(thread.executed);
    // console.log("creating new thread",  thread, newThread);
    return newThread;
}

