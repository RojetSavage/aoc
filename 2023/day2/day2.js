const fs = require('fs');

const input = fs.readFileSync('./input.txt', {encoding: 'ascii'});
let lines = input.trim().split('\n')

let failedRounds = new Set();
let games = [];
let rounds = {};
let idx = 1;

let gameLimits = { green : 13, red : 12, blue : 14 }

for (let line of lines) {
    let [, allGames] = line.split(':')
    let games = allGames.trim().split(';')
    games.forEach(game => {
        if (!rounds[idx]) {
            rounds[idx] = [];
        }  

        rounds[idx].push(game.trim().split(','));
    })
    idx++
}

for (let [roundNumber, games] of Object.entries(rounds)) {
    games.forEach(game => { checkGame(game, roundNumber) })
}

function checkGame(game, roundNumber) {
    let gamePicks = { green : 0, red : 0, blue : 0 }

    game.forEach(cubes => {
        let [num, color] = cubes.trim().split(' ');
        gamePicks[color] += Number.parseInt(num);

        if (gamePicks[color] > gameLimits[color]) {
            console.log(color, num)
            failedRounds.add(roundNumber)
        }
    })
}

function getResults() {
    let totalLines = lines.length;
    let sum = 0;

    while (totalLines) {
        sum += totalLines
        totalLines--;
    }

    failedRounds.forEach(num => sum -= Number.parseInt(num))
    return sum;
}

console.log(getResults())