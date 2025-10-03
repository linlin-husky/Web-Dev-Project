'use strict';

function turnWon(guess, guessedWords) {
    return {
        type: 'info',
        word: guess,
        matches: guessedWords.find(g => g.word === guess)?.matches || 0
    };
}

function turnInvalid(guess) {
    return {
        type: 'invalid',
        word: guess,
        matches: 0
    };
}

function turnCorrect(guess, matches) {
    return {
        type: 'correct',
        word: guess,
        matches: matches
    };
}

function turnIncorrect(guess, matches) {
    return {
        type: 'incorrect',
        word: guess,
        matches: matches
    };
}

function turnIllegal() {
    return {
        type: 'illegal',
        matches: 0
    };
}

module.exports = {
    turnWon,
    turnInvalid,
    turnCorrect,
    turnIncorrect,
    turnIllegal,
};