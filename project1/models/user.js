'user strict';

const game = require('./game');
const userData = require('./user-data');

function ensureUserExists(username) {
    let userInfo = userData.getUserInfo(username);

    if (!userInfo) {
        userInfo = {
            personalBest: null,
            currentGame: null,
        };
        userData.setUserInfo(username, userInfo);
    }
}

function createNewUserGame(username) {
    ensureUserExists(username);

    const userInfo = userData.getUserInfo(username);
    const newGameData = game.startNewGame(username);

    newGameData.personalBest = userInfo.personalBest;

    userInfo.currentGame = newGameData;
    userData.setUserInfo(username, userInfo);

    console.log(`New game started for ${username}. Secret word: ${newGameData.secretWord}`);

    return newGameData;
}

function getUserGameData(username) {
    const userInfo = userData.getUserInfo(username);
    return userInfo ? userInfo.currentGame : null;
}

function setUserGameData(username, gameData) {
    let userInfo = userData.getUserInfo(username);

    if (!userInfo) {
        userInfo = {
            personalBest: null,
            currentGame: null,
        };
    }

    userInfo.currentGame = gameData;
    userData.setUserInfo(username, userInfo);
}

function getUserGameData(username) {
    const userInfo = userData.getUserInfo(username);
    return userInfo ? userInfo.currentGame : null;
}

function setUserGameData(username, gameData) {
    let userInfo = userData.getUserInfo(username);

    if (!userInfo) {
        userInfo = {
            personalBest: null,
            currentGame: null,
        };
    }

    userInfo.currentGame = gameData;
    userData.setUserInfo(username, userInfo);
}

function getUserPersonalBest(username) {
    const userInfo = userData.getUserInfo(username);
    return userInfo ? userInfo.personalBest : null;
}

function setUserPersonalBest(username, score) {
    let userInfo = userData.getUserInfo(username);

    if (!userInfo) {
        userInfo = {
            personalBest: null,
            currentGame: null,
        };
    }

    if (userInfo.personalBest === null || score < userInfo.personalBest) {
        userInfo.personalBest = score;
        userData.setUserInfo(username, userInfo);
    }
}

function hasUserGameData(username) {
    return !!userGames[username];
}

module.exports = {
    createNewUserGame,
    getUserPersonalBest,
    setUserPersonalBest,
    getUserGameData,
    setUserGameData,
    hasUserGameData,
};
