document.addEventListener('DOMContentLoaded', (event) => {
    loadCurrentGame();
    displayScores();
});

let currentGame;

function loadCurrentGame() {
    const gameName = localStorage.getItem('currentGame');
    const games = JSON.parse(localStorage.getItem('tarotGames')) || [];
    currentGame = games.find(game => game.name === gameName);

    if (!currentGame) {
        alert('Aucune partie trouvée.');
        window.location.href = 'index.html';
        return;
    }

    updatePlayerInputs();
}

function updatePlayerInputs() {
    const takingPlayerSelect = document.getElementById('taking_player');
    const calledPlayerSection = document.getElementById('called_player_section');
    const calledPlayerSelect = document.getElementById('called_player');

    takingPlayerSelect.innerHTML = '';
    calledPlayerSelect.innerHTML = '';

    currentGame.players.forEach((player, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = player;
        takingPlayerSelect.appendChild(option);

        const calledOption = document.createElement('option');
        calledOption.value = i;
        calledOption.textContent = player;
        calledPlayerSelect.appendChild(calledOption);
    });

    if (currentGame.playerCount === 5) {
        calledPlayerSection.style.display = 'block';
    } else {
        calledPlayerSection.style.display = 'none';
    }
}

function addPoints() {
    const contract = parseInt(document.getElementById('contract').value);
    const margin = parseInt(document.getElementById('margin').value);
    const takingPlayer = parseInt(document.getElementById('taking_player').value);
    const result = document.getElementById('result').value === 'win';

    let calledPlayer = null;
    if (currentGame.playerCount === 5) {
        calledPlayer = parseInt(document.getElementById('called_player').value);
    }

    if (isNaN(takingPlayer) || currentGame.players[takingPlayer].trim() === '') {
        showNotification('Veuillez sélectionner un joueur prenant et renseigner tous les noms des joueurs.', 'error');
        return;
    }

    const scoreChange = new Array(currentGame.playerCount).fill(0);
    const adjustedContract = contract + margin;

    if (currentGame.playerCount === 2) {
        const change = result ? adjustedContract : -adjustedContract;
        scoreChange[takingPlayer] = change;
        scoreChange[1 - takingPlayer] = -change;
    } else if (currentGame.playerCount === 3) {
        const change = result ? adjustedContract * 2 : -adjustedContract * 2;
        scoreChange[takingPlayer] = change;
        scoreChange.forEach((_, i) => {
            if (i !== takingPlayer) {
                scoreChange[i] = result ? -adjustedContract : adjustedContract;
            }
        });
    } else if (currentGame.playerCount === 4) {
        const change = result ? adjustedContract * 3 : -adjustedContract * 3;
        scoreChange[takingPlayer] = change;
        scoreChange.forEach((_, i) => {
            if (i !== takingPlayer) {
                scoreChange[i] = result ? -adjustedContract : adjustedContract;
            }
        });
    } else {
        const change = result ? adjustedContract * 4 : -adjustedContract * 4;
        if (takingPlayer === calledPlayer) {
            scoreChange[takingPlayer] = change;
            scoreChange.forEach((_, i) => {
                if (i !== takingPlayer) {
                    scoreChange[i] = result ? -adjustedContract : adjustedContract;
                }
            });
        } else {
            scoreChange[takingPlayer] = change / 2;
            scoreChange[calledPlayer] = change / 4;
            scoreChange.forEach((_, i) => {
                if (i !== takingPlayer && i !== calledPlayer) {
                    scoreChange[i] = result ? -adjustedContract : adjustedContract;
                }
            });
        }
    }

    currentGame.scores.push(scoreChange);
    saveCurrentGame();
    displayScores();
    showNotification('Points ajoutés avec succès', 'success');
}

function displayScores() {
    const headerRow = `<tr>${currentGame.players.map(player => `<th>${player}</th>`).join('')}<th>Actions</th></tr>`;
    const scoreRows = currentGame.scores.map((scoreSet, index) => {
        return `<tr>${scoreSet.map(score => `<td class="${score >= 0 ? 'positive-score' : 'negative-score'}">${score}</td>`).join('')}<td><button onclick="deleteScore(${index})"><i class="fas fa-trash"></i></button></td></tr>`;
    }).join('');

    const totalScores = currentGame.scores.reduce((acc, curr) => curr.map((score, index) => acc[index] + score), new Array(currentGame.playerCount).fill(0));
    const totalRow = `<tr>${totalScores.map(score => `<th class="${score >= 0 ? 'positive-score' : 'negative-score'}">${score}</th>`).join('')}<th>Total</th></tr>`;

    const scoreTable = `
        <table>
            <thead>${headerRow}</thead>
            <tbody>${scoreRows}${totalRow}</tbody>
        </table>`;
    document.getElementById('scores').innerHTML = `<h2>Scores</h2>${scoreTable}`;
}

function saveCurrentGame() {
    const games = JSON.parse(localStorage.getItem('tarotGames')) || [];
    const existingGameIndex = games.findIndex(game => game.name === currentGame.name);

    if (existingGameIndex > -1) {
        games[existingGameIndex] = currentGame;
    }

    localStorage.setItem('tarotGames', JSON.stringify(games));
}

function resetGame() {
    currentGame.scores = [];
    saveCurrentGame();
    displayScores();
    showNotification('Nouvelle partie commencée', 'success');
}

function goBackToIndex() {
    window.location.href = 'index.html';
}

function goToStats() {
    window.location.href = 'stats.html';
}

function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
    }
}

function deleteScore(index) {
    if (index >= 0 && index < currentGame.scores.length) {
        currentGame.scores.splice(index, 1);
        saveCurrentGame();
        displayScores();
        showNotification('Ligne de score supprimée avec succès', 'success');
    }
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transition = 'opacity 0.5s ease-in-out';
        notification.style.opacity = '0';
    }, 3000);
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3500);
}
