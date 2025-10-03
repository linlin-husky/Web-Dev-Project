const users = {};

function isValid(username) {
    let isValid = true;
    isValid = !!username && username.trim();
    isValid = isValid && username.match(/^[A-Za-z0-9]+$/);
    return isValid;
}

function isPermitted(username) {
    return username !== 'dog';
}

function getUserData(username) {
    return users[username];
}

function addUserData(username, userData) {
    users[username] = userData;
}

module.exports = {
    isValid,
    isPermitted,
    getUserData,
    addUserData,
};