'use strict';

const userData = require('./user-data');

function updatePersonalBestIfNeeded(username, currentScore) {
    const currentBest = userData.getUserPersonalBest(username);

    if (!currentBest || currentScore < currentBest) {
        userData.setUserPersonalBest(username, currentScore);
    }
    userData.addUserScore(username, currentScore);
}

function getLeaderboard() {
    return userData.getLeaderboard();
}

function getUserPersonalBest(username) {
    return userData.getUserPersonalBest(username);
}

function getUserAllScores(username) {
    return userData.getUserAllScores(username);
}

module.exports = {
    updatePersonalBestIfNeeded,
    getLeaderboard,
    getUserPersonalBest,
    getUserAllScores,
};