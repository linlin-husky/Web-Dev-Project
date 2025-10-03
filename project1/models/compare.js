'use strict';

function compareWords(guessWord, secretWord) {
    function letterCountsOf(someWord) {
        const letterCounts = {};

        someWord.toLowerCase().split('').forEach(letter => {
            letterCounts[letter] = letterCounts[letter] + 1 || 1;
        });

        return letterCounts;
    }

    const guessCounts = letterCountsOf(guessWord);
    const secretCounts = letterCountsOf(secretWord);
    let matched = 0;

    for (const letter in secretCounts) {
        const guessCount = guessCounts[letter] || 0;
        const secretCount = secretCounts[letter] || 0;
        matched += Math.min(guessCount, secretCount);
    }
    return matched;
}

module.exports = {
    compareWords,
};