import {
    fetchLogin,
    fetchLogout,
    fetchMessages,
    fetchSendMessage,
    fetchUserList,
} from './services';
import {
    waitOnLogin,
    setError,
    login,
    logout,
    getPollingId,
    setPollingId,
    setSelectedUser,
    waitOnMessages,
    addMessage,
    setUsers,
    clearError,
} from './state';
import render from './view';
import { POLL_TIMING_MSECS } from './constants';

function sanitizeUsername(username) {
    return username.trim().replace(/[^a-zA-Z0-9]/g, '');
}

export function addAbilityToLogin({ state, appEl }) {
    appEl.addEventListener('submit', (e) => {
        if (!e.target.classList.contains('login__form')) {
            return;
        }
        e.preventDefault();

        let username = appEl.querySelector('.login__username').value;
        username = sanitizeUsername(username);

        if (!username) {
            setError('Please enter a valid (letters and/or numbers) username.');
            render({ state, appEl });
            return;
        }

        waitOnLogin();
        render({ state, appEl });
        fetchLogin(username)
            .then(({ username }) => {
                login(username);
                return fetchMessages();
            })
            .then(({ messages, users }) => {
                setUsers(users);
                Object.values(messages || {}).forEach(message => addMessage(message));
                state.lastPublicMessageTimestamp = Math.max(...Object.values(messages || {}).map(m => m.timestamp || 0), 0);
                state.lastDmMessageTimestampByUser = {};
                render({ state, appEl });
                startPolling({ state, appEl });
            })
            .catch(err => {
                setError(err?.error || 'ERROR');
                render({ state, appEl });
            });
    });
}

export function addAbilityToLogout({ state, appEl }) {
    appEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('controls__logout')) {
            return;
        }
        logout();
        stopPolling();
        render({ state, appEl });
        fetchLogout()
            .catch(err => {
                setError(err?.error || 'ERROR');
                render({ state, appEl });
            });
    });
}

export function addAbilityToBackToPublic({ state, appEl }) {
    appEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('public-button')) {
            state.selectedUser = null;
            setError('');
            render({ state, appEl });
        }
    });
}

export function addAbilityToSelectUser({ state, appEl }) {
    appEl.addEventListener('click', (e) => {
        const userEl = e.target.closest('.user');
        if (userEl) {
            const username = userEl.dataset.username;
            const selected = username === state.username ? null : username;
            setSelectedUser(selected);
            waitOnMessages();
            render({ state, appEl });

            if (selected) {
                fetchMessages(selected)
                    .then(({ messages, users }) => {
                        setUsers(users);

                        const dmKey = [state.username, selected].sort().join('|');
                        let maxDmTimestamp = 0;
                        Object.values(messages || {}).forEach(message => {
                            addMessage(message);

                            if (message.timestamp > maxDmTimestamp) {
                                maxDmTimestamp = message.timestamp;
                            }
                        });

                        if (!state.lastDmMessageTimestampByUser) state.lastDmMessageTimestampByUser = {};
                        state.lastDmMessageTimestampByUser[dmKey] = maxDmTimestamp;
                        state.isMessagePending = false;
                        render({ state, appEl });
                    })
                    .catch(err => {
                        setError(err?.error || 'ERROR');
                        state.isMessagePending = false;
                        render({ state, appEl });
                    });
            } else {
                fetchMessages(null)
                    .then(({ messages, users }) => {
                        setUsers(users);
                        Object.values(messages || {}).forEach(message => addMessage(message));
                        state.lastPublicMessageTimestamp = Math.max(...Object.values(messages || {}).map(m => m.timestamp || 0), 0);
                        state.isMessagePending = false;
                        render({ state, appEl });
                    })
                    .catch(err => {
                        setError(err?.error || 'ERROR');
                        state.isMessagePending = false;
                        render({ state, appEl });
                    });
            }
        }
    })
}

export function addAbilityToSendMessage({ state, appEl }) {
    appEl.addEventListener('submit', (e) => {
        if (!e.target.classList.contains('send__form')) {
            return;
        }
        e.preventDefault();

        if (state.isMessagePending) {
            return;
        }

        const isPublic = e.target.classList.contains('send__form--public');
        const message = e.target.querySelector('.send__message').value;
        const recipient = isPublic ? null : state.selectedUser;

        if (!message.trim()) {
            setError("Please enter a valid message, can't be empty.");
            render({ state, appEl });
            return;
        }

        state.isMessagePending = true;

        fetchSendMessage(message, recipient)
            .then(({ message: sentMessage }) => {
                state.isMessagePending = false;
                if (!sentMessage) {
                    setError('Message send failed');
                    render({ state, appEl });
                    return;
                }
                addMessage(sentMessage);
                e.target.querySelector('.send__message').value = '';
                clearError();
                render({ state, appEl });
            })
            .catch(err => {
                state.isMessagePending = false;
                setError(err?.error || 'ERROR');
                render({ state, appEl });
            });
    });

    appEl.addEventListener('input', (e) => {
        if (e.target.classList.contains('send__message')) {
            if (state.error) {
                clearError();
                render({ state, appEl });
            }
        }
    });
}

export function startPolling({ state, appEl }) {
    const timeoutId = setTimeout(() => pollMessages({ state, appEl }), POLL_TIMING_MSECS);
    setPollingId(timeoutId);
}

export function stopPolling() {
    clearTimeout(getPollingId());
    setPollingId(-1);
}

export function pollMessages({ state, appEl }) {
    const publicPromise = state.lastPublicMessageTimestamp
        ? fetchMessages(null, null, state.lastPublicMessageTimestamp)
        : fetchMessages(null);
    const selectedUser = state.selectedUser;
    const dmKey = selectedUser ? [state.username, selectedUser].sort().join('|') : '';
    const dmSinceTimestamp = selectedUser ? state.lastDmMessageTimestampByUser?.[dmKey] : '';
    const dmPromise = selectedUser
        ? (dmSinceTimestamp ? fetchMessages(selectedUser, null, dmSinceTimestamp) : fetchMessages(selectedUser))
        : Promise.resolve({ messages: {} });
    const userListPromise = fetchUserList();

    Promise.all([publicPromise, dmPromise, userListPromise])
        .then(([publicData, dmData, userListData]) => {
            let maxPublicTimestamp = state.lastPublicMessageTimestamp || 0;
            Object.values(publicData.messages || {}).forEach(message => {
                addMessage(message);

                if (message.timestamp > maxPublicTimestamp) {
                    maxPublicTimestamp = message.timestamp;
                }

            });

            state.lastPublicMessageTimestamp = maxPublicTimestamp;

            if (selectedUser) {
                let maxDmTimestamp = state.lastDmMessageTimestampByUser?.[dmKey] || 0;
                Object.values(dmData.messages || {}).forEach(message => {
                    addMessage(message);

                    if (message.timestamp > maxDmTimestamp) {
                        maxDmTimestamp = message.timestamp;
                    }

                });

                if (!state.lastDmMessageTimestampByUser) state.lastDmMessageTimestampByUser = {};
                state.lastDmMessageTimestampByUser[dmKey] = maxDmTimestamp;

            }

            setUsers(userListData.users || []);
            render({ state, appEl });
        })
        .catch(err => {
            if (err?.error === 'auth-missing') {
                stopPolling();
                state.username = '';
                state.isLoggedIn = false;
                setError(err?.error);
                render({ state, appEl });
                return;
            }
            setError(err?.error || 'ERROR');
            render({ state, appEl });
        })
        .then(() => {
            if (getPollingId() !== -1) {
                const timeoutId = setTimeout(() => pollMessages({ state, appEl }), POLL_TIMING_MSECS);
                setPollingId(timeoutId);
            }
        });
}