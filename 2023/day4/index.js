const fs = require('fs');

const cards = fs.readFileSync('./input.txt', {encoding:'ascii'}).trim().split('\n').map(card => card.trim())

let cardPoints = 0;
let cardWinCounts = {}
let cardCounts = {}

for (let i = 0; i < cards.length; i++) {
        let myNums = cards[i].split('|')[1].trim().split(' ').filter(num => {if (num) return true});
        let winningNums = cards[i].split('|')[0].split(':')[1].trim().split(' ').filter(num => { if (num) return true})
    
        let winMap = {}
        winningNums.forEach(num => {
            winMap[num] = true;
        })
        
        let winCount = 0;
        myNums.forEach(myNum => {
            if (winMap[myNum]) {
                winCount++
            }
        })
    
        if (winCount) {
            cardPoints += Math.pow(2, winCount - 1)
            cardWinCounts[i+1] = winCount
        }
}    

// for (let i = 0; i < cards.length; i++) {
//     let winCount = cardWinCounts[i+1] || 0 

//     while (i + 1 + winCount > cards.length) {
//         winCount--;
//     }
// }


for (let i = 0; i < cards.length; i++) {
    cardCounts[i+1] = 1;
}

for (let i = 0; i < cards.length; i++) {
    let cardCount = cardCounts[i+1];
    let winCount = cardWinCounts[i+1];

    while (cardCount > 0) {
        
        for (let j = i+2; j<i+2+winCount; j++) {
            if (j  >= cards.length + 1) break; 
            cardCounts[j]++
        }

        cardCount--;
    }
}

console.log(Object.values(cardCounts).reduce((sum, card) => { return sum + card }, 0))
