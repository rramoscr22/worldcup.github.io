// Participants and team picks
const participants = [
    { name: "Aldo", teams: ["COL", "SUI", "RSA", "JOR"], losses: 0, draws: 0 },
    { name: "Fredy", teams: ["NED", "NOR", "CAN", "KSA"], losses: 0, draws: 0 },
    { name: "Bonilla", teams: ["GER", "CIV", "ALG", "CUW"], losses: 0, draws: 0 },
    { name: "Hergi", teams: ["CRO", "USA", "AUT", "QAT"], losses: 0, draws: 0 },
    { name: "Mao", teams: ["FRA", "IRQ", "SCO", "ECU"], losses: 0, draws: 0 },
    { name: "George", teams: ["ARG", "MEX", "CZE", "IRN"], losses: 0, draws: 0 },
    { name: "Juan", teams: ["BRA", "URY", "AUS", "BIH"], losses: 0, draws: 0 },
    { name: "Vic", teams: ["ESP", "SWE", "PAR", "COD"], losses: 0, draws: 0 },
    { name: "JP", teams: ["BEL", "JPN", "GHA", "HAI"], losses: 0, draws: 0 },
    { name: "Richard", teams: ["ENG", "SEN", "TUN", "NZL"], losses: 0, draws: 0 },
    { name: "Rodrigo", teams: ["MAR", "TUR", "PAN", "CPV"], losses: 0, draws: 0 },
    { name: "David", teams: ["POR", "EGY", "KOR", "UZB"], losses: 0, draws: 0 }
];

const teamFlagMap = {
    ARG: "🇦🇷",
    AUS: "🇦🇺",
    AUT: "🇦🇹",
    BEL: "🇧🇪",
    BIH: "🇧🇦",
    BRA: "🇧🇷",
    CAN: "🇨🇦",
    COL: "🇨🇴",
    CRO: "🇭🇷",
    CZE: "🇨🇿",
    CUW: "🇨🇼",
    CPV: "🇨🇻",
    COD: "🇨🇩",
    CIV: "🇨🇮",
    ECU: "🇪🇨",
    EGY: "🇪🇬",
    ENG: "🇬🇧",
    ESP: "🇪🇸",
    FRA: "🇫🇷",
    GHA: "🇬🇭",
    GER: "🇩🇪",
    HAI: "🇭🇹",
    IRN: "🇮🇷",
    IRQ: "🇮🇶",
    ALG: "🇩🇿",
    JPN: "🇯🇵",
    JOR: "🇯🇴",
    KOR: "🇰🇷",
    KSA: "🇸🇦",
    MAR: "🇲🇦",
    MEX: "🇲🇽",
    NED: "🇳🇱",
    NOR: "🇳🇴",
    NZL: "🇳🇿",
    PAN: "🇵🇦",
    PAR: "🇵🇾",
    POR: "🇵🇹",
    QAT: "🇶🇦",
    RSA: "🇿🇦",
    SEN: "🇸🇳",
    SCO: "🏴",
    SUI: "🇨🇭",
    SWE: "🇸🇪",
    TUN: "🇹🇳",
    TUR: "🇹🇷",
    URY: "🇺🇾",
    USA: "🇺🇸",
    UZB: "🇺🇿"
};

function getTeamLabel(teamCode) {
    const flag = teamFlagMap[teamCode] || "";
    return `${flag} ${teamCode}`.trim();
}

function formatMatchTime(utcDate) {
    if (!utcDate) return 'TBD';
    const date = new Date(utcDate);
    if (Number.isNaN(date.valueOf())) return utcDate;

    const etOffsetHours = getEasternOffsetHours(date);
    const etDate = new Date(date.getTime() + etOffsetHours * 60 * 60 * 1000);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const month = monthNames[etDate.getUTCMonth()];
    const day = etDate.getUTCDate();
    const hour = padTwoDigits(etDate.getUTCHours());
    const minute = padTwoDigits(etDate.getUTCMinutes());

    return `${month} ${day}, ${hour}:${minute} ET`;
}

function getEasternOffsetHours(date) {
    const year = date.getUTCFullYear();
    const dstStart = getSecondSundayOfMarch(year);
    const dstEnd = getFirstSundayOfNovember(year);

    const utcDstStart = Date.UTC(year, 2, dstStart, 7, 0, 0); // 2:00 AM EST = 07:00 UTC
    const utcDstEnd = Date.UTC(year, 10, dstEnd, 6, 0, 0); // 2:00 AM EDT = 06:00 UTC

    const utcTime = date.getTime();
    return utcTime >= utcDstStart && utcTime < utcDstEnd ? -4 : -5;
}

function getSecondSundayOfMarch(year) {
    const marchFirst = new Date(Date.UTC(year, 2, 1));
    const dayOfWeek = marchFirst.getUTCDay();
    const firstSunday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    return firstSunday + 7;
}

function getFirstSundayOfNovember(year) {
    const novFirst = new Date(Date.UTC(year, 10, 1));
    const dayOfWeek = novFirst.getUTCDay();
    return dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
}

function padTwoDigits(value) {
    return String(value).padStart(2, '0');
}

function getScoreLabel(match) {
    const home = match.score?.fullTime?.home;
    const away = match.score?.fullTime?.away;
    if (typeof home === 'number' && typeof away === 'number') {
        return `${home} - ${away}`;
    }
    return 'TBD';
}

const knockoutStageOrder = [
    'LAST_32',
    'LAST_16',
    'QUARTER_FINALS',
    'SEMI_FINALS',
    'THIRD_PLACE',
    'FINAL'
];

const stageDisplayNames = {
    LAST_32: 'Round of 32',
    LAST_16: 'Round of 16',
    QUARTER_FINALS: 'Quarter-finals',
    SEMI_FINALS: 'Semi-finals',
    THIRD_PLACE: 'Third Place',
    FINAL: 'Final'
};

const scoreStages = new Set(['GROUP_STAGE', ...knockoutStageOrder]);

function buildGroupData(matches) {
    const groups = {};

    matches.forEach(match => {
        const groupKey = match.stage === 'GROUP_STAGE' ? match.group : match.stage;
        if (!groupKey) return;
        if (!groups[groupKey]) {
            groups[groupKey] = { fixtures: [], standings: [] };
        }

        const home = match.homeTeam?.tla || '';
        const away = match.awayTeam?.tla || '';
        const fixture = {
            home,
            away,
            stage: match.stage,
            score: getScoreLabel(match),
            time: formatMatchTime(match.utcDate),
            status: match.status || 'UNKNOWN',
            isFinal: match.status === 'FINISHED'
        };

        groups[groupKey].fixtures.push(fixture);
    });

    Object.keys(groups).sort((a, b) => {
        const aIsGroup = a.startsWith('GROUP_');
        const bIsGroup = b.startsWith('GROUP_');

        if (aIsGroup && bIsGroup) {
            return a.localeCompare(b);
        }
        if (aIsGroup) return -1;
        if (bIsGroup) return 1;

        const aIndex = knockoutStageOrder.indexOf(a);
        const bIndex = knockoutStageOrder.indexOf(b);

        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
    }).forEach(groupKey => {
        groups[groupKey].fixtures.sort((a, b) => a.time.localeCompare(b.time));
    });

    return groups;
}

function calculateGroupStandings(groups) {
    Object.entries(groups).forEach(([groupKey, group]) => {
        if (!groupKey.startsWith('GROUP_')) {
            group.standings = [];
            return;
        }

        const statsByTeam = {};

        group.fixtures.forEach(match => {
            const home = match.home;
            const away = match.away;
            if (!home || !away) return;

            if (!statsByTeam[home]) statsByTeam[home] = { pts: 0, gf: 0, ga: 0 };
            if (!statsByTeam[away]) statsByTeam[away] = { pts: 0, gf: 0, ga: 0 };

            if (!match.isFinal) return;
            const score = match.score.match(/^([0-9]+)\s*-\s*([0-9]+)$/);
            if (!score) return;

            const homeGoals = Number(score[1]);
            const awayGoals = Number(score[2]);
            statsByTeam[home].gf += homeGoals;
            statsByTeam[home].ga += awayGoals;
            statsByTeam[away].gf += awayGoals;
            statsByTeam[away].ga += homeGoals;

            if (homeGoals > awayGoals) {
                statsByTeam[home].pts += 3;
            } else if (homeGoals < awayGoals) {
                statsByTeam[away].pts += 3;
            } else {
                statsByTeam[home].pts += 1;
                statsByTeam[away].pts += 1;
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

function calculateParticipantScores(groups) {
    participants.forEach(player => {
        player.losses = 0;
        player.draws = 0;
    });

    Object.values(groups).forEach(group => {
        group.fixtures.forEach(match => {
            if (!match.isFinal) return;
            if (!scoreStages.has(match.stage)) return;
            const score = match.score.match(/^(\d+)\s*-\s*(\d+)$/);
            if (!score) return;

            const homeGoals = Number(score[1]);
            const awayGoals = Number(score[2]);
            if (homeGoals === awayGoals) {
                const homeOwner = participants.find(p => p.teams.includes(match.home));
                const awayOwner = participants.find(p => p.teams.includes(match.away));
                if (homeOwner) homeOwner.draws += 1;
                if (awayOwner) awayOwner.draws += 1;
            } else {
                const losingTeam = homeGoals < awayGoals ? match.home : match.away;
                const owner = participants.find(p => p.teams.includes(losingTeam));
                if (owner) owner.losses += 1;
            }
        });
    });

    participants.sort((a, b) => {
        if (a.losses !== b.losses) return a.losses - b.losses;
        return a.draws - b.draws;
    });
}

function sortGroupKeys(keys) {
    return keys.sort((a, b) => {
        const aIsGroup = a.startsWith('GROUP_');
        const bIsGroup = b.startsWith('GROUP_');

        if (aIsGroup && bIsGroup) {
            return a.localeCompare(b);
        }
        if (aIsGroup) return -1;
        if (bIsGroup) return 1;

        const aIndex = knockoutStageOrder.indexOf(a);
        const bIndex = knockoutStageOrder.indexOf(b);

        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
    });
}

function renderLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = participants.map((player, index) => `
        <tr>
            <td><strong>#${index + 1}</strong></td>
            <td><strong>${player.name}</strong></td>
            <td class="teams-list" title="${player.teams.join(', ')}">${player.teams.join(', ')}</td>
            <td><span class="badge loss-badge">${player.losses}</span></td>
            <td><span class="badge draw-badge">${player.draws}</span></td>
        </tr>
    `).join('');
}

function renderGroups(groups) {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = '';
    const groupKeys = sortGroupKeys(Object.keys(groups));

    if (!groupKeys.length) {
        container.innerHTML = '<p style="color: #f8fafc; padding: 20px;">No match data available.</p>';
        return;
    }

    groupKeys.forEach(groupKey => {
        const group = groups[groupKey];
        const card = document.createElement('div');
        card.className = 'card';

        const header = document.createElement('div');
        header.className = 'group-header';
        header.innerText = groupKey.startsWith('GROUP_') ? groupKey.replace('GROUP_', 'Group ') : (stageDisplayNames[groupKey] || groupKey);
        card.appendChild(header);

        const fixturesDiv = document.createElement('div');
        fixturesDiv.className = 'fixtures';
        fixturesDiv.innerHTML = group.fixtures.map(f => {
            const isFinal = f.isFinal;
            return `
                <div class="match-row">
                    <span class="match-time">${f.time}</span>
                    <span class="team"><span class="team-label">${getTeamLabel(f.home)}</span></span>
                    <span class="score ${isFinal ? 'final' : ''}">${f.score}</span>
                    <span class="team away"><span class="team-label">${getTeamLabel(f.away)}</span></span>
                </div>
            `;
        }).join('');
        card.appendChild(fixturesDiv);

        if (groupKey.startsWith('GROUP_')) {
            const divider = document.createElement('div');
            divider.className = 'divider';
            card.appendChild(divider);

            const standingsDiv = document.createElement('div');
            standingsDiv.className = 'standings';
            standingsDiv.innerHTML = `<div class="standings-title">Ranking</div>` + group.standings.map((entry, idx) => `
                <div class="standings-row">
                    <span>${idx + 1}. <span class="team-label">${getTeamLabel(entry.team)}</span></span>
                    <span>${entry.pts} PTS | GD ${entry.gd >= 0 ? '+' + entry.gd : entry.gd}</span>
                </div>
            `).join('');
            card.appendChild(standingsDiv);
        }

        container.appendChild(card);
    });
}

function showError(message) {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `<p style="color: #f8fafc; padding: 20px;">${message}</p>`;
}

async function loadDataJson() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch data.json: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.matches || [];
    } catch (error) {
        console.error(error);
        showError('Unable to read data.json. Please run this page from a local server or upload data.json to the same folder.');
        return [];
    }
}

async function init() {
    const matches = await loadDataJson();
    if (!matches.length) return;

    const groups = buildGroupData(matches);
    calculateGroupStandings(groups);
    calculateParticipantScores(groups);
    renderLeaderboard();
    renderGroups(groups);
}

document.addEventListener('DOMContentLoaded', init);
