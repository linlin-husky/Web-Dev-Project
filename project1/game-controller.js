'use strict';

const session = require('./models/session');
const user = require('./models/user');
const gameView = require('./game-view');
const game = require('./models/game');
const score = require('./models/score');

function getHomePage(req, res) {
    const sessionId = req.cookies.sessionId;
    const username = session.getUsername(sessionId);
    let gameData = user.getUserGameData(username);
    const possibleWords = game.getAllWords();

    if (!username) {
        res.status(400).send(gameView.getLoginPageHTML());
    } else {
        if (!gameData) {
            gameData = user.createNewUserGame(username);
        }

        const personalBest = score.getUserPersonalBest(username);
        const allScores = score.getUserAllScores(username);
        const leaderboard = score.getLeaderboard();

        res.status(200).send(gameView.getDataPageHTML(username, gameData, possibleWords, personalBest, allScores, leaderboard));
    }
}

function handleLogin(req, res) {
    const username = req.body.username ? req.body.username.trim() : '';

    if (!username) {
        return res.status(400).send(gameView.getLoginPageHTML('Username cannot be empty.'));
    }

    if (username.toLowerCase() === 'dog') {
        return res.status(403).send(gameView.getLoginPageHTML('User not allowed.'));
    }

    const validUsernameChars = /[^a-zA-Z0-9]/;
    if (validUsernameChars.test(username)) {
        return res.status(400).send(gameView.getLoginPageHTML('Username contains invalid characters. Only letters and numbers are allowed.'));
    }

    const newSessionId = session.createSession(username);
    res.cookie('sessionId', newSessionId, { httpOnly: true, secure: false });
    res.redirect('/');
}

function handleGuess(req, res) {
    const username = req.username;

    let gameData = user.getUserGameData(username);

    if (!gameData) {
        user.createNewUserGame(username);
        return res.redirect('/');
    }

    const rawGuess = req.body.guess;


    const result = game.makeGuess(gameData, rawGuess);

    if (result.error) {
        return res.send(gameView.getDataPageHTML(
            username,
            gameData,
            game.getAllWords(),
            score.getUserPersonalBest(username),
            score.getUserAllScores(username),
            score.getLeaderboard(),
            result.error || null
        ));
    }

    user.setUserGameData(username, gameData);

    res.redirect('/');
}

function handleNewGame(req, res) {

    const username = req.username;

    user.createNewUserGame(username);

    res.redirect('/');
}

function handleLogout(req, res) {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
        session.destroySession(sessionId);
        res.clearCookie('sessionId');
    }
    res.redirect('/');
}

module.exports = {
    getHomePage,
    handleLogin,
    handleLogout,
    handleGuess,
    handleNewGame,
};