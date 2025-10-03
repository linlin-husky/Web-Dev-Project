const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

const authController = require('./auth-controller');
const messageController = require('./message-controller');
const sessions = require('./sessions');

app.use(cookieParser());
app.use(express.static('./public'));
app.use(express.json());

app.get('/api/v1/session', authController.checkSession);
app.get('/api/v1/userlist', sessions.sessionCheck, authController.checkUserList);
app.post('/api/v1/session', authController.createSession);
app.delete('/api/v1/session', authController.endSession);

app.get('/api/v1/messages', sessions.sessionCheck, messageController.getMessages);
app.post('/api/v1/messages', sessions.sessionCheck, messageController.sendMessage);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));