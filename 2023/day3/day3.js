const fs = require('fs');

class Token {
    constructor(chars, pos, lineNum, linePos) {
        this.chars = chars;
        this.pos = pos;
        this.lineNum = lineNum;
        this.linePos = linePos;
        this.isValid = false;
    }
}

class Gear extends Token {
    constructor(char, pos, lineNum, linePos) {
        super(char, pos, lineNum, linePos)
        this.surroundingNumbers = 0;
    }
}

let i = 0;
class Lexer {
    constructor(input) {
        this.input = input;
        this.lines = this.input.split('\n').map(line => line.trim());
        this.char = '\0';

        this.pos = -1;
        this.readPos = 0;

        this.lineNum = 1;
        this.linePos = -1;

        this.tokens = [];
        this.specialTokens = [];
        this.gearTokens = [];
    }

    go() {
        this.readChar();

        while (this.char != "") {
            this.nextToken();
            console.log(this.char)
        }
    }

    readChar() {
        if (this.readPos >= this.input.length) {
            this.char = '';
        } else {
            this.char = this.input[this.readPos]
        }

        if (this.input[this.readPos - 1] == '\n') {
            this.linePos = -1;
            this.lineNum++;
        }

        this.pos = this.readPos;
        this.readPos++;
        this.linePos++;
    }

    nextToken() {
        this.skipInvalidChars();

        if (Number.isInteger(Number.parseInt(this.char))) {
            this.readNumber();
        } else if (this.char == "*") {
            this.readGear();
        } else {
            this.readSymbol();
        }
    }

    readNumber() {
        let currentPos = this.pos;
        let linePos = this.linePos;
        while (Number.isInteger(Number.parseInt(this.peekChar()))) {
            this.readChar();
        }
        let endPos = this.pos;
        this.createToken(this.input.slice(currentPos, endPos + 1), currentPos, this.lineNum, linePos)
        this.readChar();
    }

    readSymbol() {
        let nextToken = this.createSpecialToken(this.char, this.pos, this.lineNum, this.linePos);
        this.readChar();
        return nextToken;
    }

    readGear() {
        this.createGearToken(this.char, this.pos, this.lineNum, this.linePos);
        this.readChar();
    }

    skipInvalidChars() {
        while (this.char == '\n' || this.char == '.') {
            this.readChar();
        }
    }

    peekChar() {
        if (this.pos >= this.input.length) return '';
        else return this.input[this.readPos]
    }

    createToken(char, pos, lineNum, linePos) {
        this.tokens.push(new Token(char, pos, lineNum, linePos))
    }

    createGearToken(char, pos, lineNum, linePos) {
        this.gearTokens.push(new Gear(char, pos, lineNum, linePos))
    }

    createSpecialToken(char, pos, lineNum, linePos) {
        this.specialTokens.push(new Token(char, pos, lineNum, linePos))
    }

    validateTokens() {
        let adjacentPos = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [1, 1], [0, 1], [-1, 1]];

        this.tokens.forEach(token => {
            let { linePos: x, lineNum: y, pos: pos } = token

            for (let i = x; i < x + token.chars.length; i++) {
                adjacentPos.forEach(direction => {
                    if (this.checkSurrounding(i, y-1, direction)) {
                        token.isValid = true;
                    } 
                })
            }
        }) 
    }

    checkSurrounding(x, y, adjacentPos, token) {
        let newX = x - adjacentPos[0] 
        let newY = y - adjacentPos[1]

        if (newX < 0 || newX >= this.lines[y].length) return false;
        if (newY < 0 || newY >= this.lines.length) return false;

        if (this.isSymbol(this.lines[newY][newX])) {
            return true;
        }
    }

    isSymbol(char) {
        if (char != '\n' && !Number.isInteger(Number.parseInt(char)) && char != '.') {
            return true;
        }
    }
    
    sumValidTokens() {
        let sum = 0;

        this.tokens.forEach(token => {
            if (token.isValid) {
                sum += Number.parseInt(token.chars);
                console.log(token)
            }
        })

        return sum;
    }
}

const input = fs.readFileSync('./input.txt', { encoding: "ascii" });

let lexer = new Lexer(input)

lexer.go();

lexer.validateTokens();

console.log(lexer.gearTokens)

