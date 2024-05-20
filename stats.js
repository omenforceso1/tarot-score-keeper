document.addEventListener('DOMContentLoaded', (event) => {
    loadStats();
});

function loadStats() {
    const gameName = localStorage.getItem('currentGame');
    const games = JSON.parse(localStorage.getItem('tarotGames')) || [];
    const currentGame = games.find(game => game.name === gameName);

    if (!currentGame) {
        alert('Aucune partie trouvée.');
        window.location.href = 'index.html';
        return;
    }

    displayStats(currentGame);
}

function displayStats(currentGame) {
    const stats = currentGame.players.map((player, index) => {
        const totalPoints = currentGame.scores.reduce((acc, scoreSet) => acc + scoreSet[index], 0);
        const gamesPlayed = currentGame.scores.length;
        const wins = currentGame.scores.filter(scoreSet => scoreSet[index] > 0).length;
        const losses = gamesPlayed - wins;
        const winRate = gamesPlayed > 0 ? ((wins / gamesPlayed) * 100).toFixed(2) : 0;
        return { player, totalPoints, gamesPlayed, wins, losses, winRate };
    });

    const headerRow = `<tr><th>Joueur</th><th>Total Points</th><th>Parties Jouées</th><th>Victoires</th><th>Défaites</th><th>Taux de Victoire (%)</th></tr>`;
    const statsRows = stats.map(stat => {
        return `<tr>
            <td>${stat.player}</td>
            <td>${stat.totalPoints}</td>
            <td>${stat.gamesPlayed}</td>
            <td>${stat.wins}</td>
            <td>${stat.losses}</td>
            <td>${stat.winRate}</td>
        </tr>`;
    }).join('');

    const statsTable = `
        <table>
            <thead>${headerRow}</thead>
            <tbody>${statsRows}</tbody>
        </table>`;
    document.getElementById('stats').innerHTML = `<h2>Statistiques</h2>${statsTable}`;
}

function goBackToGame() {
    window.location.href = 'game.html';
}
