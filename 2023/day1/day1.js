const fs = require('fs')

const input = fs.readFileSync('./input.txt', {encoding: 'ascii'});

let strToNum = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
}

const lines = input.trim().split('\n');
let sum = 0;

for (let i = 0; i < lines.length; i++) {
    let first = undefined;
    let last = undefined;

    let { firstStrNum, lastStrNum, firstStrNumIdx, lastStrNumIdx } = checkForStrings(lines[i].trim())
    let  firstNum, lastNum, firstNumIdx, lastNumIdx;

    for (let j = 0; j < lines[i].length; j++) {
        if (Number.isInteger(Number.parseInt(lines[i][j]))) {
            if (!firstNum) {
                firstNum = Number.parseInt(lines[i][j]);
                firstNumIdx = j;
                lastNum = Number.parseInt(lines[i][j])
                lastNumIdx = j;
            } else {
                lastNum = Number.parseInt(lines[i][j])
                lastNumIdx = j;
            }
        }
        
        if (!firstNum) first = firstStrNum;
        if (!lastNum) last = lastStrNum;
        
        if (!firstStrNum) first = firstNum;
        if (!lastStrNum) last = lastNum;

        if (firstNum && firstStrNum) {
            first = firstNumIdx < firstStrNumIdx ? firstNum : firstStrNum;
        }

        if (lastNum && lastStrNum) {
            last = lastNumIdx > lastStrNumIdx ? lastNum : lastStrNum;
        }
        
    }
    console.log(first, last)
    sum += Number(`${first}${last}`)
}

function checkForStrings(line) {
    let regex = /(one|two|three|four|five|six|seven|eight|nine|zero)/gi 
    let firstStrNum = Number.POSITIVE_INFINITY;
    let lastStrNum = Number.NEGATIVE_INFINITY;
    let firstStrNumIdx = Number.POSITIVE_INFINITY;
    let lastStrNumIdx = Number.NEGATIVE_INFINITY;

    while ((result = regex.exec(line)) !== null) {
        if (firstStrNum === Number.POSITIVE_INFINITY) {
            firstStrNum = strToNum[result[0]]
            firstStrNumIdx = result.index;
        }

        lastStrNum = strToNum[result[0]];
        lastStrNumIdx = result.index;

        regex.lastIndex--; 
    }
    return { firstStrNum, lastStrNum, firstStrNumIdx, lastStrNumIdx } 
}


console.log(sum);
 
