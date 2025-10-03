'use strict';

const crypto = require('crypto');
const gameView = require('../game-view');

const sessionStore = {};

function generateSessionId() {
    return crypto.randomUUID();
}

function createSession(username) {
    const newSessionId = generateSessionId();
    sessionStore[newSessionId] = username;
    return newSessionId;
}

function getUsername(sessionId) {
    return sessionStore[sessionId] || null;
}

function sessionCheck(req, res, next) {
    const sessionId = req.cookies.sessionId;
    const username = getUsername(sessionId);

    if (!username) {
        res.status(400).send(gameView.getLoginPageHTML('Failed to log in. Please try again.'))
        return;
    }

    req.username = username;
    next();
}

function destroySession(sessionId) {
    delete sessionStore[sessionId];
}


module.exports = {
    generateSessionId,
    createSession,
    getUsername,
    sessionCheck,
    destroySession,
};