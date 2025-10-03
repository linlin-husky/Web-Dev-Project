'use strict';

const words = require('./words');
const score = require('./score');
const compare = require('./compare.js');
const turn = require('./turn.js');

function generateSecretWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex].toLowerCase();
}

function startNewGame(username) {
    const secretWord = generateSecretWord();
    return {
        username: username,
        secretWord: secretWord,
        guessedWords: [],
        guessCount: 0,
        validGuessedWords: [],
        successfullyGuessedWord: null,
        lastTurnInfo: { type: 'none', message: 'Ready to play!', word: '', matches: 0 },
        hasWon: false,
    };
}

function makeGuess(gameData, rawGuess) {
    if (!gameData) {
        throw new Error('Game data is missing. Cannot process guess.');
    }

    const cleanedGuess = rawGuess.replace(/[^a-zA-Z]/g, '');

    if (!cleanedGuess) {
        gameData.lastTurnInfo = turn.turnIllegal();
        return gameData.lastTurnInfo;
    }

    const guess = cleanedGuess.toLowerCase().trim();

    if (gameData.hasWon) {
        gameData.lastTurnInfo = turn.turnWon(guess, gameData.guessedWords)

        return;
    }

    const isValidWord = words.includes(guess);
    const isAlreadyGuessed = gameData.guessedWords.some(g => g.word === guess);

    if (!isValidWord || isAlreadyGuessed) {
        gameData.lastTurnInfo = turn.turnInvalid(guess)

    } else {
        gameData.guessCount++;
        gameData.validGuessedWords.push(guess);

        const letterCounts = compare.compareWords(guess, gameData.secretWord);
        gameData.guessedWords.push({ word: guess, matches: letterCounts });

        if (guess === gameData.secretWord) {
            gameData.successfullyGuessedWord = guess;
            gameData.hasWon = true;

            score.updatePersonalBestIfNeeded(gameData.username, gameData.guessCount);

            gameData.lastTurnInfo = turn.turnCorrect(cleanedGuess, letterCounts);

        } else {
            gameData.lastTurnInfo = turn.turnIncorrect(cleanedGuess, letterCounts);
        }
    }
    return gameData.lastTurnInfo;
}

function getAllWords() {
    return words;
}

module.exports = {
    generateSecretWord,
    startNewGame,
    makeGuess,
    getAllWords,
};