import { SERVER, CLIENT } from './constants';
import state, {
    login,
    logout,
    setError,
    waitOnMessages,
    setPublicMessages,
    setDmMessages,
    setUsers,
} from './state';
import {
    fetchSession,
    fetchMessages,
} from './services';
import render from './view';
import {
    addAbilityToLogin,
    addAbilityToLogout,
    addAbilityToBackToPublic,
    addAbilityToSelectUser,
    addAbilityToSendMessage,
    startPolling,
} from './listeners';

const appEl = document.querySelector('#app');
render({ state, appEl });
addAbilityToLogin({ state, appEl });
addAbilityToLogout({ state, appEl });
addAbilityToBackToPublic({ state, appEl });
addAbilityToSelectUser({ state, appEl });
addAbilityToSendMessage({ state, appEl });
checkForSession();

function checkForSession() {
    fetchSession()
        .then(session => {
            login(session.username);
            waitOnMessages();
            startPolling({ state, appEl });
            render({ state, appEl });
            return fetchMessages();
        })
        .catch(err => {
            if (err?.error === SERVER.AUTH_MISSING) {
                return Promise.reject({ error: CLIENT.NO_SESSION })
            }
            return Promise.reject(err);
        })
        .then(({ messages, users }) => {
            setUsers(users);
            setPublicMessages(messages);
            setDmMessages({});
            render({ state, appEl });
        })
        .catch(err => {
            if (err?.error == CLIENT.NO_SESSION) {
                logout();
                render({ state, appEl });
                return;
            }
            setError(err?.error || 'ERROR');
            render({ state, appEl });
        });
}