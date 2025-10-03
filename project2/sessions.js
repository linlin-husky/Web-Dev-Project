const uuid = require('crypto').randomUUID;
const users = require('./users');
const sessions = {};
const userToSids = {};

function addSession(username) {
    const sid = uuid();
    sessions[sid] = {
        username,
    };

    if (!userToSids[username]) {
        userToSids[username] = { [sid]: username, };
    } else {
        userToSids[username][sid] = username;
    }

    return sid;
}

function getSessionUser(sid) {
    return sessions[sid]?.username;
}

function deleteSession(sid) {
    const username = sessions[sid]?.username;
    delete sessions[sid];
    const userSids = userToSids[username];

    if (userSids[sid]) {
        delete userSids[sid];
        if (Object.keys(userSids).length === 0) {
            delete userToSids[username];
        }
    }
}

function getAllLoggedInUsers() {
    return Object.keys(userToSids);
}

function sessionCheck(req, res, next) {
    const sid = req.cookies.sid;
    const username = sid ? getSessionUser(sid) : '';

    if (!sid || !users.isValid(username)) {
        return res.status(401).json({ error: 'auth-missing' });
    }

    req.username = username;
    next();
}

module.exports = {
    addSession,
    getSessionUser,
    deleteSession,
    getAllLoggedInUsers,
    sessionCheck,
};