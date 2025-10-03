"use strict";

function getLoginPageHTML(errorMessage) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Word Guessing Game</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="main-content">
        <h1 class="title">Word Guessing Game App</h1>
        <div class="login-content">
            <h2 class="login-title">Login</h2>
            <form action="/login" method="POST" class="login">
                <label for="username" class="login-label">Username: </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    class="login-input"
                />       
                <button
                    type="submit"
                    class="button login-button"
                >
                    Login
                </button>
            </form>     
        </div>
          ${errorMessage ? `<p class="error-message">${errorMessage}</p>` : ''}
    </div>
</body>
</html>
    `;
}

function getDataPageHTML(username, gameData, possibleWords, personalBest, allScores, leaderboard, errorMessage = null) {
    const { secretWord, guessedWords, guessCount, validGuessedWords, successfullyGuessedWord, lastTurnInfo, hasWon } = gameData;

    let messageHtml = '';

    if (errorMessage) {
        messageHtml += `<div class="message-box message-error">${errorMessage}</div>`;
    }

    if (lastTurnInfo.type === 'invalid') {
        messageHtml = `<div class="message-box message-error">"${lastTurnInfo.word}" is an invalid guess (not a possible word or already guessed).</div>`;
    } else if (lastTurnInfo.type === 'correct') {
        messageHtml = `<div class="message-box message-success">Congratulations, you guessed the word "${lastTurnInfo.word}"!</div>`;
    } else if (lastTurnInfo.type === 'incorrect') {
        messageHtml = `<div class="message-box message-incorrect">"${lastTurnInfo.word}" is incorrect.It matched ${lastTurnInfo.matches} letters.Keep trying!</div>`;
    } else if (lastTurnInfo.type === 'info') {
        messageHtml = `<div class="message-box message-info">You have already won this game! Start a new one.</div>`;
    } else if (lastTurnInfo.type === 'illegal') {
        messageHtml = `<div class="message-box message-illegal">Guess input contains invalid characters. Only letters are allowed </div>`;
    }

    const guessedWordsListHtml = guessedWords.length > 0 ?
        `<div class="card guessed-words-list">
            <h3 class="guesses-title">Your Guesses (${guessCount}):</h3>
            <details class="game-tips">
                <summary>Tips</summary>
                <p class="tip-content">Each valid guess will return how many letters match with the secret word despite the position.</p>
            </details>
            <ul class="guessed-words">
                ${guessedWords.map(g => `<li class="guessed-word">
                    <strong class="highlight-word">${g.word}</strong>
                    : ${g.matches} letters matched</li>`).join('')}
            </ul>
            
        </div>` :
        `<div class="card guessed-words-list">
            <p>No guesses made yet. Type a word and press "Guess!" to start.</p>
        </div>`;

    const mostRecentGuessHtml = guessedWords.length > 0
        ? `<div class="card recent-word">
        <h3 class="recent-title">Your Most Recent Guess</h3>
        <p class="recent-guess">
            ${lastTurnInfo.type === 'invalid'
            ? `${lastTurnInfo.word}: invalid word`
            : `${lastTurnInfo.word}: ${lastTurnInfo.matches} letters matched`
        }
        </p>
    </div>`
        : '';

    const possibleWordsListHtml = `
        <div class="card">
            <h3 class="possible-title">Possible Words:</h3>
            <div class="possible-words">
                ${possibleWords.map(word => {
        if (successfullyGuessedWord && successfullyGuessedWord === word) {
            return `<span class="possible-word-item guessed-success">${word}</span>`;
        } else if (validGuessedWords.includes(word)) {
            return `<span class="possible-word-item guessed">${word}</span>`;
        } else {
            return `<span class="possible-word-item">${word}</span>`;
        }
    }).join('')}
            </div>
        </div>
    `;

    const guessFormHtml = !hasWon ? `
        <div class="card guess-form-content">
            <form action="/guess" method="POST" class="guess-form">
                <label for="guess" class="guess-label">Your Guess</label>
                <input type="text" id="guess" name="guess" placeholder="Enter your guessword" class="guess-input" required>
                <button type="submit" class="button guess-button">Guess!</button>
            </form>
        </div>
    ` : '';

    const allScoresHtml = `
        <div class="card all-scores">
            <h3 class="history-title">Your Game History</h3>
            ${allScores && allScores.length > 0 ? `
                <div class="scores-summary">
                    <p class="personal-best"><strong>Personal Best:</strong> ${personalBest ?? 'N/A'} guesses</p>
                    <p class="games-played"><strong>Games Played:</strong> ${allScores.length}</p>
                </div>
                <ol class="scores-list">
                    ${allScores.map((scoreData, index) => `
                        <li class="score-item">
                            Game ${scoreData.gameNumber}: ${scoreData.score} guesses
                            ${scoreData.score === personalBest ? ' <span class="best-badge">Personal Best</span>' : ''}
                        </li>
                    `).join('')}
                </ol>
            ` : `
                <p>No games completed yet. Finish your first game to see your scores!</p>
            `}
        </div>
    `;

    const leaderboardHtml = `
        <div class="card leaderboard">
            <h3 class="leaderboard-title">Leaderboard</h3>
            <ol class="leaderboard-summary">
            ${leaderboard.map(entry => `<li class="leaderboard-item">${entry.username}: ${entry.score} guesses</li>`).join('')}
            </ol>
        </div>
    `;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Word Guessing Game</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="main-content">
        <form action="/logout" method="POST" class="logout-form">
            <button type="submit" class="button logout-button">
                Logout
            </button>
        </form>
        <h1 class="title">Word Guessing Game App</h1>
        <div class="game-header">
            <h2 class="welcome-text">
                Welcome, <span class="welcome-username">${username}</span>!
            </h2>

            <div class="game-option">
                <form action="/new-game" method="POST">
                    <button type="submit" class="button game-button">New Game</button>
                </form>
            </div>
            
        </div>
        ${messageHtml}

        <div class="game-grid">
            <div>
                ${guessFormHtml}
                ${guessedWordsListHtml}
                ${mostRecentGuessHtml}
                ${allScoresHtml}
                ${leaderboardHtml}
            </div>
            <div>       
                ${possibleWordsListHtml}
            </div>
        </div>
          
    </div>
</body>
</html>
    `;
}

module.exports = {
    getLoginPageHTML,
    getDataPageHTML,
};
