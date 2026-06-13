// 1. Participant definition blocks
const participants = [
    { name: "Aldo", teams: ["COL", "SUI", "RSA", "JOR"], losses: 0, draws: 0 },
    { name: "Fredy", teams: ["NET", "NOR", "CAN", "KSA"], losses: 0, draws: 0 },
    { name: "Bonilla", teams: ["GER", "CIV", "ALG", "CUR"], losses: 0, draws: 0 },
    { name: "Hergi", teams: ["CRO", "USA", "AUT", "QAT"], losses: 0, draws: 0 },
    { name: "Mao", teams: ["FRA", "IRQ", "SCO", "ECU"], losses: 0, draws: 0 },
    { name: "George", teams: ["ARG", "MEX", "CZE", "IRN"], losses: 0, draws: 0 },
    { name: "Juan", teams: ["BRA", "URU", "AUS", "BIH"], losses: 0, draws: 0 },
    { name: "Vic", teams: ["SPA", "SWE", "PAR", "CDR"], losses: 0, draws: 0 },
    { name: "JP", teams: ["BEL", "JPN", "GHA", "HAI"], losses: 0, draws: 0 },
    { name: "Richard", teams: ["ENG", "SEN", "TUN", "NZL"], losses: 0, draws: 0 },
    { name: "Rodrigo", teams: ["MAR", "TUR", "PAN", "CPV"], losses: 0, draws: 0 },
    { name: "David", teams: ["POR", "EGY", "KOR", "UZB"], losses: 0, draws: 0 }
];

// 2. Group stage details
const worldCupData = {
    "Group A": {
        "fixtures": [
            {"home": "MEX", "away": "RSA", "score": "2 - 0", "time": "FINAL"}, // RSA gets +1 Loss
            {"home": "KOR", "away": "CZE", "score": "2 - 1", "time": "FINAL"}, // CZE gets +1 Loss
            {"home": "CZE", "away": "RSA", "score": "  -  ", "time": "June 17"},
            {"home": "MEX", "away": "KOR", "score": "  -  ", "time": "June 18"}
        ],
        "standings": [
            {"team": "MEX", "pts": "3"}, {"team": "KOR", "pts": "3"},
            {"team": "CZE", "pts": "0"}, {"team": "RSA", "pts": "0"}
        ]
    },
    "Group B": {
        "fixtures": [
            {"home": "CAN", "away": "BIH", "score": "1 - 1", "time": "FINAL"}, // CAN & BIH both get +1 Draw
            {"home": "QAT", "away": "SUI", "score": "  -  ", "time": "3:00 PM"},
            {"home": "SUI", "away": "BIH", "score": "  -  ", "time": "June 18"}
        ],
        "standings": [
            {"team": "CAN", "pts": "1"}, {"team": "BIH", "pts": "1"},
            {"team": "QAT", "pts": "0"}, {"team": "SUI", "pts": "0"}
        ]
    }
};

// --- LOGIC ENGINE ---

function calculateScores() {
    Object.values(worldCupData).forEach(group => {
        group.fixtures.forEach(match => {
            if (match.time === "FINAL") {
                const scores = match.score.split("-").map(s => parseInt(s.trim()));
                
                if (scores[0] === scores[1]) {
                    // It's a DRAW: Both teams get +1 Draw point
                    const homeOwner = participants.find(p => p.teams.includes(match.home));
                    const awayOwner = participants.find(p => p.teams.includes(match.away));
                    
                    if (homeOwner) homeOwner.draws += 1;
                    if (awayOwner) awayOwner.draws += 1;
                } else {
                    // It's a decisive win/loss outcome
                    const losingTeam = (scores[0] < scores[1]) ? match.home : match.away;
                    const owner = participants.find(p => p.teams.includes(losingTeam));
                    if (owner) owner.losses += 1;
                }
            }
        });
    });

    // Sort: Lowest losses first. If tied, lowest draws first.
    participants.sort((a, b) => {
        if (a.losses !== b.losses) {
            return a.losses - b.losses;
        }
        return a.draws - b.draws;
    });
}

// Run Calculations
calculateScores();

// 1. Render Leaderboard Rows
const leaderboardBody = document.getElementById('leaderboard-body');
participants.forEach((player, index) => {
    leaderboardBody.innerHTML += `
        <tr>
            <td><strong>#${index + 1}</strong></td>
            <td><strong>${player.name}</strong></td>
            <td class="teams-list" title="${player.teams.join(', ')}">${player.teams.join(', ')}</td>
            <td><span class="badge loss-badge">${player.losses}</span></td>
            <td><span class="badge draw-badge">${player.draws}</span></td>
        </tr>
    `;
});

// 2. Render Tournament Brackets
const container = document.getElementById('dashboard-container');
Object.entries(worldCupData).forEach(([groupName, data]) => {
    const card = document.createElement('div');
    card.className = 'card';

    const header = document.createElement('div');
    header.className = 'group-header';
    header.innerText = groupName;
    card.appendChild(header);

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

    const divider = document.createElement('div');
    divider.className = 'divider';
    card.appendChild(divider);

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
