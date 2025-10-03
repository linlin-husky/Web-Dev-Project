function render({ state, appEl }) {
    preserveScrollAnchor(appEl);
    const { publicInputValue, dmInputValue, focusedInputType } = preserveInputState(appEl);

    const html = `
        <main class="">         
            ${generateLoginHtml(state)}  
            ${generateContentHtml(state)}
        </main>
    `;
    appEl.innerHTML = html;

    restoreInputState(appEl, publicInputValue, dmInputValue, focusedInputType);
    restoreScrollToBottom(appEl);
}

function preserveScrollAnchor(appEl) {
    const publicMessagesNode = appEl.querySelector('.public-chat .messages');
    const dmMessagesNode = appEl.querySelector('.dm-chat .messages');
    let activeMessagesNode = dmMessagesNode || publicMessagesNode;

    if (activeMessagesNode && activeMessagesNode.children.length > 0) {
        activeMessagesNode.classList.add('messages--invisible');
    }
}

function preserveInputState(appEl) {
    let publicInputValue = '';
    let dmInputValue = '';
    let focusedInputType = null;
    const publicInput = appEl.querySelector('.send__message--public');
    const dmInput = appEl.querySelector('.send__message--dm');

    if (publicInput) {
        publicInputValue = publicInput.value;
        if (document.activeElement === publicInput) {
            focusedInputType = 'public';
        }
    }

    if (dmInput) {
        dmInputValue = dmInput.value;
        if (document.activeElement === dmInput) {
            focusedInputType = 'dm';
        }
    }

    return { publicInputValue, dmInputValue, focusedInputType };
}

function restoreInputState(appEl, publicInputValue, dmInputValue, focusedInputType) {
    const newPublicInput = appEl.querySelector('.send__message--public');
    const newDmInput = appEl.querySelector('.send__message--dm');

    if (newPublicInput) newPublicInput.value = publicInputValue;
    if (newDmInput) newDmInput.value = dmInputValue;

    if (focusedInputType === 'public' && newPublicInput) {
        newPublicInput.focus();
        newPublicInput.setSelectionRange(newPublicInput.value.length, newPublicInput.value.length);
    } else if (focusedInputType === 'dm' && newDmInput) {
        newDmInput.focus();
        newDmInput.setSelectionRange(newDmInput.value.length, newDmInput.value.length);
    }
}

function restoreScrollToBottom(appEl) {
    const newPublicMessagesNode = appEl.querySelector('.public-chat .messages');
    const newDmMessagesNode = appEl.querySelector('.dm-chat .messages');
    let newActiveMessagesNode = newDmMessagesNode || newPublicMessagesNode;

    if (newActiveMessagesNode) {
        requestAnimationFrame(() => {
            newActiveMessagesNode.scrollTop = newActiveMessagesNode.scrollHeight;
            newActiveMessagesNode.classList.remove('messages--invisible');
        });
    }
}

function generateStatusHtml(state) {
    return `
        <div class="status">${state.error}</div>
    `;
}

function generateLoginHtml(state) {
    if (state.isLoginPending) {
        return `
            <div class="login__waiting">Loading user...</div>
        `
    }

    if (state.isLoggedIn) {
        return ``;
    }

    return `
        <div class="login">
            <form class="login__form">
                <label for="username" class="login__label">
                    <span>Username:</span>
                    <input 
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        class="login__username"
                    />
                </label>
                    ${generateStatusHtml(state)}
                <button class="login__button" type="submit">Login</button>
            </form>
        </div>
    `;
}

function generateContentHtml(state) {
    if (!state.isLoggedIn) {
        return ``;
    }

    if (state.isMessagePending) {
        return `
            <div class="content">
                ${generateControlsHtml(state)}
                <div class="messages_waiting">Loading chat data...</div>
            </div>
        `;
    }

    return `
        <div class="content">
            ${generateControlsHtml(state)}
            <div class="current-user">
                Logged in user: <strong>${state.username}</strong>
            </div>
            <div class="chat-target">
                Chatting with: ${state.selectedUser || 'Everyone'}
            </div>
            <div class="chat-layout">
                <div class="chat-users">
                    ${generateUsersHtml(state)}
                </div>
                <main class="main-chat">
                    <div class="chat-windows">
                        ${state.selectedUser
            ? `
                                <section class="chat-window dm-chat">
                                <div class="dm-header">
                                    <h2 class="dm-title">Direct Messages</h2>
                                    <button class="public-button">Public Chat</button>
                                </div>
                                    <div class="dm-target">
                                        Chatting with: <strong>${state.selectedUser || 'No one selected'}</strong>
                                    </div>
                                        ${generateMessagesHtml({ ...state, messages: getCurrentDmMessages(state) })}
                                        ${generateSendMessageHtml(state, 'dm')}
                                        ${generateStatusHtml(state)}
                                </section>
                            `
            : `
                                <section class="chat-window public-chat">
                                    <h2 class="public-title">Public Chat</h2>
                                        ${generateMessagesHtml({ ...state, messages: state.publicMessages })}
                                        ${generateSendMessageHtml(state, 'public')}
                                        ${generateStatusHtml(state)}
                                </section>
                            `
        }
                    </div>
                </main>
            </div>   
        </div>
    `;
}

function generateControlsHtml() {
    return `
        <div class="controls">      
            <button class="controls__logout">Logout</button>
        </div>
    `;
}

function generateUsersHtml(state) {
    const usersHtml = Object.keys(state.users).map(user => `
        <li>
            <button class="user
                ${state.selectedUser === user ? ' user-selected' : ''}
                ${state.username === user ? ' active-user' : ''}
                " 
                data-username="${user}"
            >
                ${user}${state.username === user ? ' (You)' : ''}
            </button>
        </li>
    `).join('');

    return usersHtml
        ? `<div class="users-list"><h2 class="users-list__title">Logged-in Users</h2><ul class="users">${usersHtml}</ul>
           <details class="tips">
                <summary class="tips-title">Tips</summary>
                <p class="tip-content">Click your own avatar to enter public chat; click the other user's avatar to DM this user.</p>
           </details>
          </div>`
        : `<div class="users-list"><h2 class="users-list__title">Logged-in Users</h2><p>No users online</p></div>`;
}

function generateMessagesHtml(state) {
    const messagesHtml = Object.values(state.messages).map(message => {
        const isNewest = message.id === state.lastAddedMessageId;
        return `
             <li class="message${isNewest ? ' message--newest' : ''}" data-id="${message.id}">
                <span class="message__user">${message.sender}</span>:
                <span class="message__text">${message.text}</span>
            </li>
        `;
    }).join('');
    return messagesHtml
        ? `<ul class="messages">${messagesHtml}</ul>`
        : `<p class="messages-none">No message Items yet, send one! </p>`;
}

function generateSendMessageHtml(state, type = 'public') {
    if (type === 'dm') {
        return `
        <form class="send__form send__form--dm">
            <label for="send__message--dm">
                Message:
                <input id="send__message--dm" class="send__message send__message--dm" placeholder="Type a DM"/>
            </label>
            <button type="submit" class="send__button"  ${state.isMessagePending ? 'disabled' : ''}>Send</button>
        </form>
    `;
    }
    return `
        <form class="send__form send__form--public">
            <label for="send__message--public">
                Message:
                <input id="send__message--public" class="send__message send__message--public"  placeholder="Type a public message" />
            </label>
            <button type="submit" class="send__button"  ${state.isMessagePending ? 'disabled' : ''}>Send</button>
        </form>
    `;
}

function getCurrentDmMessages(state) {
    if (!state.selectedUser) {
        return {};
    }
    const key = [state.username, state.selectedUser].sort().join('|');
    return state.dmMessages[key] || {};
}

export default render;