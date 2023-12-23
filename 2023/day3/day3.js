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

class SpecialToken extends Token {
    constructor(char, pos, lineNum, linePos) {
        super(char, pos, lineNum, linePos)
    }
}

let i = 0;
class Lexer {
    constructor(input) {
        this.input = input;
        this.lines = this.input.split('\n')
        this.char = '\0';

        //these two are only used for reading in the input, adjusted positions are required for line position
        this.pos = -1;
        this.readPos = 0;

        this.lineNum = 1;
        this.linePos = -1;

        this.tokens = [];
        this.specialTokens = [];
    }

    //updates char to read position, advances position and read position
    //position represents the current char. 
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
        let nextToken = undefined;

        this.skipInvalidChars();

        if (Number.isInteger(Number.parseInt(this.char))) {
            nextToken = this.readNumber();
        } else {
            nextToken = this.readSymbol();
        }
        return nextToken;
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

    createSpecialToken(char, pos, lineNum, linePos) {
        this.specialTokens.push(new Token(char, pos, lineNum, linePos))
    }

    validateTokens() {
        let adjacentPos = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [1, 1], [0, 1], [-1, 1]]

        //perform a check for every token
        this.tokens.forEach(token => {
            let { linePos: x, lineNum: y } = token

            //for each direction possible
            adjacentPos.forEach(dir => {

                //for each char in token.chars
                for (let i = x; i < x + token.chars.length; i++) {
                    if (this.checkSurrounding(x, y - 1, dir)) {
                        token.isValid = true;
                        console.log('we got a live one \n')
                    } else {
                        console.log('invalid position \n')
                    }
                }
            })
        })
    }

    checkSurrounding(x, y, adjacentPos) {
        console.log('original token pos ', x, y)
        let newX = x - adjacentPos[0] 
        let newY = y - adjacentPos[1]
        console.log('for each num ', newX, newY, adjacentPos)
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
}

const input = fs.readFileSync('./input.txt', { encoding: "ascii" });

let lexer = new Lexer(input)
lexer.readChar();

while (lexer.char != "") {
    lexer.nextToken();
}

lexer.validateTokens();

// console.log(lexer.tokens);
// console.log(lexer.specialTokens);

