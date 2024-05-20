document.addEventListener('DOMContentLoaded', (event) => {
    loadExistingGames();
    updatePlayerInputs();
});

function startNewGame() {
    const gameName = document.getElementById('new_game_name').value.trim();
    const playerCount = parseInt(document.getElementById('new_game_players').value);
    const playerNames = [];

    for (let i = 1; i <= playerCount; i++) {
        const playerName = document.getElementById(`player_name_${i}`).value.trim();
        if (!playerName) {
            alert('Veuillez entrer le nom de tous les joueurs.');
            return;
        }
        playerNames.push(playerName);
    }

    if (!gameName) {
        alert('Veuillez entrer un nom pour la nouvelle partie.');
        return;
    }

    const game = {
        name: gameName,
        playerCount: playerCount,
        scores: [new Array(playerCount).fill(0)],
        players: playerNames
    };

    saveGame(game);
    redirectToGame(gameName);
}

function loadExistingGames() {
    const games = JSON.parse(localStorage.getItem('tarotGames')) || [];
    const existingGamesList = document.getElementById('existing_games_list');

    existingGamesList.innerHTML = '';
    games.forEach(game => {
        const li = document.createElement('li');
        li.innerHTML = `${game.name} <button onclick="deleteGame('${game.name}')"><i class="fas fa-trash"></i></button>`;
        li.onclick = () => redirectToGame(game.name);
        existingGamesList.appendChild(li);
    });
}

function saveGame(game) {
    const games = JSON.parse(localStorage.getItem('tarotGames')) || [];
    const existingGameIndex = games.findIndex(g => g.name === game.name);

    if (existingGameIndex > -1) {
        games[existingGameIndex] = game;
    } else {
        games.push(game);
    }

    localStorage.setItem('tarotGames', JSON.stringify(games));
}

function redirectToGame(gameName) {
    localStorage.setItem('currentGame', gameName);
    window.location.href = 'game.html';
}

function updatePlayerInputs() {
    const playerCount = parseInt(document.getElementById('new_game_players').value);
    const playerNamesContainer = document.getElementById('player_names');
    
    playerNamesContainer.innerHTML = '';

    for (let i = 1; i <= playerCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player_name_${i}`;
        input.placeholder = `Nom du joueur ${i}`;
        playerNamesContainer.appendChild(input);
    }
}

function deleteGame(gameName) {
    let games = JSON.parse(localStorage.getItem('tarotGames')) || [];
    games = games.filter(game => game.name !== gameName);
    localStorage.setItem('tarotGames', JSON.stringify(games));
    loadExistingGames();
}
