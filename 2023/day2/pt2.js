const fs = require('fs');

const input = fs.readFileSync('./input.txt', {encoding: 'ascii'});
let lines = input.trim().split('\n')

let rounds = {};
let idx = 1;
let sumOfPowers = 0;

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
    let gameMaxes = { green : 0, red : 0, blue : 0 }

    games.forEach(round => { 
        round.forEach(pick => {
            let [num, color] = pick.trim().split(' ');
            if (gameMaxes[color] < Number.parseInt(num)) {
                gameMaxes[color] = Number.parseInt(num)
            }
        })
    })

    if (!gameMaxes.red) gameMaxes.red = 1;
    if (!gameMaxes.green) gameMaxes.green = 1;
    if (!gameMaxes.blue) gameMaxes.blue = 1;

    let power = gameMaxes.red * gameMaxes.green * gameMaxes.blue; 
    sumOfPowers += power;
    console.log(power)
}


console.log(sumOfPowers)
