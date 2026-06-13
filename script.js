const worldCupData = {
    "Group A": {
        "fixtures": [
            {"home": "MEX", "away": "RSA", "score": "2 - 0", "time": "FINAL"},
            {"home": "KOR", "away": "CZE", "score": "2 - 1", "time": "FINAL"},
            {"home": "CZE", "away": "RSA", "score": "  -  ", "time": "June 17"},
            {"home": "MEX", "away": "KOR", "score": "  -  ", "time": "June 18"}
        ],
        "standings": [
            {"team": "MEX", "pts": "3"},
            {"team": "KOR", "pts": "3"},
            {"team": "CZE", "pts": "0"},
            {"team": "RSA", "pts": "0"}
        ]
    },
    "Group B": {
        "fixtures": [
            {"home": "CAN", "away": "BIH", "score": "1 - 1", "time": "FINAL"},
            {"home": "QAT", "away": "SUI", "score": "  -  ", "time": "3:00 PM"},
            {"home": "SUI", "away": "BIH", "score": "  -  ", "time": "June 18"}
        ],
        "standings": [
            {"team": "CAN", "pts": "1"},
            {"team": "BIH", "pts": "1"},
            {"team": "QAT", "pts": "0"},
            {"team": "SUI", "pts": "0"}
        ]
    }
    // Add groups C through L inside this object as needed!
};

const container = document.getElementById('dashboard-container');

Object.entries(worldCupData).forEach(([groupName, data]) => {
    // Create Group Card
    const card = document.createElement('div');
    card.className = 'card';

    // Header Banner
    const header = document.createElement('div');
    header.className = 'group-header';
    header.innerText = groupName;
    card.appendChild(header);

    // Fixtures Grid
    const fixturesDiv = document.createElement('div');
    fixturesDiv.className = 'fixtures';
    data.fixtures.forEach(f => {
        const isFinal = f.time === "FINAL";
        fixturesDiv.innerHTML += `
            <div class="match-row">
                <span class="match-time">${f.time}</span>
                <span class="team">${f.home}</span>
                <span class="score ${isFinal ? 'final' : ''}">${f.score}</span>
                <span class="team away">${f.away}</span>
            </div>
        `;
    });
    card.appendChild(fixturesDiv);

    // Divider
    const divider = document.createElement('div');
    divider.className = 'divider';
    card.appendChild(divider);

    // Standings Panel
    const standingsDiv = document.createElement('div');
    standingsDiv.className = 'standings';
    standingsDiv.innerHTML = `<div class="standings-title">Ranking</div>`;
    data.standings.forEach((entry, idx) => {
        standingsDiv.innerHTML += `
            <div class="standings-row">
                <span>${idx + 1}. ${entry.team}</span>
                <span>${entry.pts} PTS</span>
            </div>
        `;
    });
    card.appendChild(standingsDiv);

    container.appendChild(card);
});
