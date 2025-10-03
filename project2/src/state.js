import { ERROR_MESSAGES } from './constants';

const state = {
    publicMessages: {},
    dmMessages: {},
    users: {},
    isLoggedIn: false,
    isLoginPending: true,
    isMessagePending: false,
    isLoadingUsers: false,
    username: '',
    lastAddedMessageId: '',
    lastPublicMessageTimestamp: 0,
    lastDmMessageTimestampByUser: {},
    error: '',
    messageInput: '',
    selectedUser: null,
}

export function setPublicMessages(messages) {
    state.publicMessages = messages;
    state.isMessagePending = false;
    state.error = '';
    state.lastAddedMessageId = '';
}

export function setDmMessages(messages, selectedUser, username) {
    if (!selectedUser) return;
    const key = [username, selectedUser].sort().join('|');
    state.dmMessages[key] = messages || {};
    state.isMessagePending = false;
    state.error = '';
    state.lastAddedMessageId = '';
}

export function setPollingId(id) {
    state.pollingId = id;
}

export function getPollingId() {
    return state.pollingId;
}

export function waitOnLogin() {
    state.isLoggedIn = false;
    state.isLoginPending = true;
    state.username = '';
    state.publicMessages = {};
    state.dmMessages = {};
    state.users = {};
    state.error = '';
    state.messageInput = '';
}

export function login(username) {
    state.isLoggedIn = true;
    state.isLoginPending = false;
    state.username = username;
    state.error = '';
    state.lastAddedMessageId = '';
    state.messageInput = '';
}

export function logout() {
    state.isLoggedIn = false;
    state.isLoginPending = false;
    state.username = '';
    state.publicMessages = {};
    state.dmMessages = {};
    state.users = {};
    state.error = '';
    state.messageInput = '';
}

export function waitOnUsers() {
    state.users = {};
    state.isLoadingUsers = true;
    state.error = '';
}

export function waitOnMessages() {
    state.publicMessages = {};
    state.dmMessages = {};
    state.isMessagePending = true;
    state.error = '';
}

export function setUsers(users) {
    if (Array.isArray(users)) {
        state.users = users.reduce((acc, username) => {
            acc[username] = true;
            return acc;
        }, {});
    } else {
        state.users = users || {};
    }
}

export function addMessage(message) {
    if (!message.recipient) {
        state.publicMessages[message.id] = message;
    } else {
        const key = [message.sender, message.recipient].sort().join('|');
        if (!state.dmMessages[key]) {
            state.dmMessages[key] = {};
        }
        state.dmMessages[key][message.id] = message;
    }
    state.lastAddedMessageId = message.id || '';
}

export function setMessageInput(value) {
    state.messageInput = value;
}

export function setMessagePending(isPending) {
    state.isMessagePending = isPending;
}

export function setError(error) {
    if (!error) {
        state.error = '';
        return;
    }

    state.isLoginPending = false;

    if (ERROR_MESSAGES[error]) {
        state.error = ERROR_MESSAGES[error];
    } else {
        state.error = error;
    }
}

export function clearError() {
    state.error = '';
}

export function setSelectedUser(username) {
    state.selectedUser = username;
}

export default state;