const fs = require('fs');
const readline = require('readline');
const path = require('path');
const md5 = require('md5');

let LOG = false;

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [[], []];
    let playerIndex = -1;
    for await (const line of rl) {
        if (line === "") {
            continue;
        }
        if (line.startsWith("Player")) {
            playerIndex++;
            continue;
        }
        data[playerIndex].push(parseInt(line));
    }
    return data;
}

processLineByLine().then(startingDecks => {
    combatGame([[...startingDecks[0]], [...startingDecks[1]]])

    // LOG = true;
    let decks = [[...startingDecks[0]], [...startingDecks[1]]];
    let winnerIndex = recursiveCombat(decks);

    console.log(`\n\n== Post-game results ==`);
    console.log(`Player 1's deck: ${decks[0]}`);
    console.log(`Player 2's deck: ${decks[1]}`);
    console.log(`\nRecursive game winner: Player ${winnerIndex + 1}`);
    console.log("Score:", calculateScore(decks[winnerIndex]));
});

function combatGame(decks) {
    while (decks[0].length !== 0 && decks[1].length !== 0) {
        gameLog("\nplayer 1 deck: ", decks[0].join(", "));
        gameLog("player 2 deck: ", decks[1].join(", "));
        const player1Card = decks[0].shift();
        const player2Card = decks[1].shift();
        if (player1Card > player2Card) {
            decks[0].push(player1Card, player2Card);
        } else {
            decks[1].push(player2Card, player1Card);
        }
    }
    let winnerIndex = decks[0].length === 0 ? 1 : 0;
    console.log(`Combat game winner: Player ${winnerIndex + 1}`);
    console.log("Score:", calculateScore(decks[winnerIndex]));
}

function recursiveCombat(decks, game = 1, gameHashes = new Map()) {
    const gameHash = getHash(decks);
    gameLog(`\n=== Game ${game} === ${gameHash}`);
    let gameWinnerIndex;
    try {
        let round = 1;
        let roundHashes = new Set();
        while (decks[0].length !== 0 && decks[1].length !== 0) {
            recursiveCombatRound(decks, game, round++, roundHashes, gameHashes);
        }
        gameWinnerIndex = decks[0].length === 0 ? 1 : 0;
    } catch (e) {
        if (typeof e === "number") {
            gameWinnerIndex = e;
        } else {
            throw e;
        }
    }

    gameLog(`The winner of game ${game} is player ${gameWinnerIndex + 1}!`);
    gameHashes.set(gameHash, gameWinnerIndex);
    return gameWinnerIndex;
}

function recursiveCombatRound(decks, game, round, roundHashes, gameHashes) {
    gameLog(`\n-- Round ${round} (Game ${game}) --`);
    gameLog(`Player 1's deck: ${decks[0]}`);
    gameLog(`Player 2's deck: ${decks[1]}`);
    gameLog('Round hashes', roundHashes);
    const roundHash = getHash(decks);
    if (gameHashes.has(roundHash)) {
        gameLog(`Found a past game with same decks!`);
        throw gameHashes.get(roundHash);
    }
    if (roundHashes.has(roundHash)) {
        throw 0;
    }
    roundHashes.add(roundHash);

    const playedCards = [
        decks[0].shift(),
        decks[1].shift(),
    ];
    gameLog(`Player 1 plays: ${playedCards[0]}`);
    gameLog(`Player 2 plays: ${playedCards[1]}`);
    let roundWinnerIndex;
    if (
        playedCards[0] <= decks[0].length &&
        playedCards[1] <= decks[1].length
    ) {
        gameLog(`Playing a sub-game to determine the winner...`);
        let subDecks = [
            decks[0].slice(0, playedCards[0]),
            decks[1].slice(0, playedCards[1]),
        ];
        roundWinnerIndex = recursiveCombat(subDecks, gameHashes.size + 1, gameHashes);
        gameLog(`\n...anyway, back to game ${game}.`);
    } else {
        roundWinnerIndex = playedCards[0] > playedCards[1] ? 0 : 1;
    }

    if (roundWinnerIndex === 1) {
        playedCards.reverse();
    }
    decks[roundWinnerIndex].push(...playedCards);

    gameLog(`Player ${roundWinnerIndex + 1} wins round ${round} of game ${game}!`);
    return roundWinnerIndex;
}

function calculateScore(winnerDeck) {
    return winnerDeck.reduce((sum, card, index) => sum + card * (winnerDeck.length - index), 0);
}

function getHash(decks) {
    return md5(JSON.stringify(decks));//`${decks[0]}-${decks[1]}`);
}

function gameLog(...toLog) {
    if (LOG) {
        console.log(...toLog);
    }
}

