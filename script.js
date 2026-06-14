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
            {"team": "MEX"}, {"team": "KOR"},
            {"team": "CZE"}, {"team": "RSA"}
        ]
    },
    "Group B": {
        "fixtures": [
            {"home": "CAN", "away": "BIH", "score": "1 - 1", "time": "FINAL"}, // CAN & BIH both get +1 Draw
            {"home": "QAT", "away": "SUI", "score": "1 - 1", "time": "FINAL"}, // QAT & SUI both get +1 Draw
            {"home": "SUI", "away": "BIH", "score": "  -  ", "time": "June 18"}
        ],
        "standings": [
            {"team": "CAN"}, {"team": "BIH"},
            {"team": "QAT"}, {"team": "SUI"}
        ]
    },
    "Group C": {
        "fixtures": [
            {"home": "BRA", "away": "MAR", "score": "1 - 1", "time": "June 13"}, // CAN & BIH both get +1 Draw
            {"home": "HAI", "away": "SCO", "score": "  -  ", "time": "June 13"}, // QAT & SUI both get +1 Draw
            {"home": "SUI", "away": "BIH", "score": "  -  ", "time": "June 18"}
        ],
        "standings": [
            {"team": "BRA"}, {"team": "MAR"},
            {"team": "HAI"}, {"team": "SCO"}
        ]
    }
};

// --- LOGIC ENGINE ---

function parseMatchScore(score) {
    const match = score.match(/^\s*(\d+)\s*-\s*(\d+)\s*$/);
    if (!match) return null;
    return [Number(match[1]), Number(match[2])];
}

function formatGoalDifference(value) {
    return value > 0 ? `+${value}` : `${value}`;
}

function calculateGroupStandings() {
    Object.values(worldCupData).forEach(group => {
        const statsByTeam = {};

        group.standings.forEach(entry => {
            const team = typeof entry === "string" ? entry : entry.team;
            if (!team) return;
            statsByTeam[team] = { pts: 0, gf: 0, ga: 0 };
        });

        group.fixtures.forEach(match => {
            if (match.time !== "FINAL") return;

            const scores = parseMatchScore(match.score);
            if (!scores) return;

            const [homeGoals, awayGoals] = scores;

            if (!statsByTeam[match.home]) statsByTeam[match.home] = { pts: 0, gf: 0, ga: 0 };
            if (!statsByTeam[match.away]) statsByTeam[match.away] = { pts: 0, gf: 0, ga: 0 };

            statsByTeam[match.home].gf += homeGoals;
            statsByTeam[match.home].ga += awayGoals;
            statsByTeam[match.away].gf += awayGoals;
            statsByTeam[match.away].ga += homeGoals;

            if (homeGoals > awayGoals) {
                statsByTeam[match.home].pts += 3;
            } else if (homeGoals < awayGoals) {
                statsByTeam[match.away].pts += 3;
            } else {
                statsByTeam[match.home].pts += 1;
                statsByTeam[match.away].pts += 1;
            }
        });

        group.standings = Object.entries(statsByTeam)
            .map(([team, stats]) => ({
                team,
                pts: stats.pts,
                gf: stats.gf,
                ga: stats.ga,
                gd: stats.gf - stats.ga
            }))
            .sort((a, b) => b.pts - a.pts || b.gd - a.gd || a.team.localeCompare(b.team));
    });
}

function calculateScores() {
    participants.forEach(player => {
        player.losses = 0;
        player.draws = 0;
    });

    Object.values(worldCupData).forEach(group => {
        group.fixtures.forEach(match => {
            if (match.time === "FINAL") {
                const scores = parseMatchScore(match.score);
                if (!scores) return;
                
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
calculateGroupStandings();
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
                <span>${entry.pts} PTS | GD ${formatGoalDifference(entry.gd)}</span>
            </div>
        `;
    });
    card.appendChild(standingsDiv);
    container.appendChild(card);
});
