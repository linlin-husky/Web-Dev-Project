'use strict';

const users = {};

function ensureUser(username) {
    if (!users[username]) {
        users[username] = {
            personalBest: null,
            currentGame: null,
            allScores: [],
        };
    }
}

function getUserInfo(username) {
    ensureUser(username);
    return users[username];
}

function setUserInfo(username, userInfo) {
    users[username] = userInfo;
}

function getUserPersonalBest(username) {
    ensureUser(username);
    return users[username].personalBest;
}

function setUserPersonalBest(username, score) {
    ensureUser(username);
    users[username].personalBest = score;
}

function getLeaderboard() {
    return Object.entries(users)
        .filter(([_, u]) => u.personalBest !== null)
        .map(([username, u]) => ({ username, score: u.personalBest }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 10);
}

function getCurrentGame(username) {
    ensureUser(username);
    return users[username].currentGame;
}

function setCurrentGame(username, gameData) {
    ensureUser(username);
    users[username].currentGame = gameData;
}

function addUserScore(username, score) {
    ensureUser(username);
    users[username].allScores.push({
        score: score,
        timestamp: new Date(),
        gameNumber: users[username].allScores.length + 1
    });
}

function getUserAllScores(username) {
    ensureUser(username);
    return users[username].allScores.slice().sort((a, b) => a.score - b.score);
}

module.exports = {
    getUserInfo,
    setUserInfo,
    getUserPersonalBest,
    setUserPersonalBest,
    getLeaderboard,
    getCurrentGame,
    setCurrentGame,
    addUserScore,
    getUserAllScores,
};
