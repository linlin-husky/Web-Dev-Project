const messages = require('./messages');
const sessions = require('./sessions');

const messageController = {};

messageController.getMessages = function (req, res) {
    const selectedUser = req.query.selectedUser;
    const userList = sessions.getAllLoggedInUsers();

    const sinceTimestamp = req.query.sinceTimestamp ? Number(req.query.sinceTimestamp) : 0;
    const username = req.username;

    let allMessages = messages.getMessages({ username, selectedUser });

    if (sinceTimestamp) {
        allMessages = Object.fromEntries(
            Object.entries(allMessages).filter(([id, message]) => message.timestamp > sinceTimestamp)
        );
    }

    res.json({
        messages: allMessages,
        users: userList,
    });
};

messageController.sendMessage = function (req, res) {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';

    const { text, recipient } = req.body;

    if (!text || !text.trim()) {
        res.status(400).json({ error: 'required-message' });
        return;
    }

    const newMessage = messages.sendMessage({ sender: username, text, recipient });

    res.json({ message: newMessage });
};

module.exports = messageController;