export function fetchSession() {
    return fetch('/api/v1/session', {
        method: 'GET',
    })
        .catch(() => Promise.reject({ error: 'networkError' }))
        .then(handleFetchResponse);
}

export function fetchUserList() {
    return fetch('/api/v1/userlist', {
        method: 'GET',
    })
        .catch(() => Promise.reject({ error: 'networkError' }))
        .then(handleFetchResponse);
}

export function fetchLogin(username) {
    return fetch('/api/v1/session', {
        method: 'POST',
        headers: new Headers({
            'content-type': 'application/json'
        }),
        body: JSON.stringify({ username }),
    })
        .catch(() => Promise.reject({ error: 'networkError' }))
        .then(handleFetchResponse);
}

export function fetchLogout() {
    return fetch('/api/v1/session', {
        method: 'DELETE',
    })
        .catch(() => Promise.reject({ error: 'networkError' }))
        .then(handleFetchResponse);
}

export function fetchSendMessage(text, recipient = null) {
    return fetch('/api/v1/messages', {
        method: 'POST',
        headers: new Headers({
            'content-type': 'application/json',
        }),
        body: JSON.stringify({ text, recipient }),
    })
        .catch(() => Promise.reject({ error: 'networkError' }))
        .then(handleFetchResponse);
}

export function fetchMessages(selectedUser = null, sinceId = '') {
    let url = selectedUser
        ? `/api/v1/messages?selectedUser=${encodeURIComponent(selectedUser)}`
        : `/api/v1/messages`;

    if (sinceId) {
        url += (url.includes('?') ? '&' : '?') + `sinceId=${sinceId}`;
    }

    return fetch(url, {
        method: 'GET',
    })
        .catch(() => Promise.reject({ error: 'networkError' }))
        .then(handleFetchResponse);
}

function handleFetchResponse(response) {
    if (response.ok) {
        return response.json();
    }

    return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
}