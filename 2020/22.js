const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [[], []];
    let playerIndex = -1;
    for await (const line of rl) {
        // mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
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
    let player1Deck = startingDecks[0];
    let player2Deck = startingDecks[1];
    while (player1Deck.length !== 0 && player2Deck.length !== 0) {
        // console.log(player1Deck, player2Deck);
        const player1Card = player1Deck.shift();
        const player2Card = player2Deck.shift();
        if (player1Card > player2Card) {
            player1Deck.push(player1Card, player2Card);
        } else {
            player2Deck.push(player2Card, player1Card);
        }
    }
    let winnerDeck = player1Deck.length === 0 ? player2Deck : player1Deck;
    console.log(winnerDeck.reduce(
        (sum, card, index) => sum + card * (winnerDeck.length - index), 0));
});
