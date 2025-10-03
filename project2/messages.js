const { randomUUID } = require('crypto');

const publicMessages = {};
const dmMessages = {};

function sendMessage({ sender, text, recipient }) {
    const message = {
        id: randomUUID(),
        sender,
        recipient: recipient || null,
        text,
        timestamp: Date.now(),
    };

    if (!recipient) {
        publicMessages[message.id] = message;
    } else {
        const key = [sender, recipient].sort().join('|');

        if (!dmMessages[key]) {
            dmMessages[key] = {};
        }

        dmMessages[key][message.id] = message;
    }
    return message;
}

function getMessages({ username, selectedUser }) {

    if (!selectedUser) {
        return publicMessages;
    }

    const key = [username, selectedUser].sort().join('|');
    return dmMessages[key] || {};
}

module.exports = {
    sendMessage,
    getMessages,
};