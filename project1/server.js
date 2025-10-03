'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('./models/session');
const app = express();
const PORT = 3000;

const gameController = require('./game-controller');

app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.static('public'));

app.get('/', gameController.getHomePage);
app.post('/login', gameController.handleLogin);

app.post('/guess', session.sessionCheck, gameController.handleGuess);
app.post('/new-game', session.sessionCheck, gameController.handleNewGame);

app.post('/logout', gameController.handleLogout);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));