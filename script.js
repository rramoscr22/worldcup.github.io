// Participants and team picks
const participants = [
    { name: "Aldo", teams: ["COL", "SUI", "RSA", "JOR"], wins: 0, losses: 0, draws: 0 },
    { name: "Fredy", teams: ["NED", "NOR", "CAN", "KSA"], wins: 0, losses: 0, draws: 0 },
    { name: "Bonilla", teams: ["GER", "CIV", "ALG", "CUW"], wins: 0, losses: 0, draws: 0 },
    { name: "Hergi", teams: ["CRO", "USA", "AUT", "QAT"], wins: 0, losses: 0, draws: 0 },
    { name: "Mao", teams: ["FRA", "IRQ", "SCO", "ECU"], wins: 0, losses: 0, draws: 0 },
    { name: "George", teams: ["ARG", "MEX", "CZE", "IRN"], wins: 0, losses: 0, draws: 0 },
    { name: "Juan", teams: ["BRA", "URY", "AUS", "BIH"], wins: 0, losses: 0, draws: 0 },
    { name: "Vic", teams: ["ESP", "SWE", "PAR", "COD"], wins: 0, losses: 0, draws: 0 },
    { name: "JP", teams: ["BEL", "JPN", "GHA", "HAI"], wins: 0, losses: 0, draws: 0 },
    { name: "Richard", teams: ["ENG", "SEN", "TUN", "NZL"], wins: 0, losses: 0, draws: 0 },
    { name: "Rodrigo", teams: ["MAR", "TUR", "PAN", "CPV"], wins: 0, losses: 0, draws: 0 },
    { name: "David", teams: ["POR", "EGY", "KOR", "UZB"], wins: 0, losses: 0, draws: 0 }
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
    ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
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
    SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    SUI: "🇨🇭",
    SWE: "🇸🇪",
    TUN: "🇹🇳",
    TUR: "🇹🇷",
    URU: "🇺🇾",
    URY: "🇺🇾",
    USA: "🇺🇸",
    UZB: "🇺🇿"
};

const worldRanking = {
    ARG: 1, ESP: 2, FRA: 3, ENG: 4, POR: 5, BRA: 6, MAR: 7, NED: 8, BEL: 9, GER: 10,
    CRO: 11, ITA: 12, COL: 13, MEX: 14, SEN: 15, URY: 16, URU: 16, USA: 17, JPN: 18, SUI: 19, IRN: 20,
    DEN: 21, TUR: 22, ECU: 23, AUT: 24, KOR: 25, AUS: 26, ALG: 27, EGY: 28, CAN: 29,
    NOR: 31, CIV: 32, PAN: 33, SWE: 34, CZE: 35, PAR: 36, SCO: 37, TUN: 38, COD: 39, UZB: 40,
    QAT: 41, IRQ: 42, RSA: 43, KSA: 44, JOR: 45, BIH: 46, CPV: 47, GHA: 48
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

const validMatchStatuses = new Set([
    'SCHEDULED',
    'TIMED',
    'IN_PLAY',
    'PAUSED',
    'EXTRA_TIME',
    'PENALTY_SHOOTOUT',
    'FINISHED',
    'SUSPENDED',
    'POSTPONED',
    'CANCELLED',
    'AWARDED'
]);

const liveMatchStatuses = new Set([
    'IN_PLAY',
    'PAUSED',
    'EXTRA_TIME',
    'PENALTY_SHOOTOUT'
]);

function getScoreLabel(match) {
    // Extract scores, allowing for both numeric and string types from the API
    const fullTime = match.score?.fullTime;
    const regularTime = match.score?.regularTime;

    const home = fullTime?.home ?? regularTime?.home;
    const away = fullTime?.away ?? regularTime?.away;

    if (home !== null && home !== undefined && away !== null && away !== undefined) {
        return `${home} - ${away}`;
    }
    
    // Fallback for live matches that have no goals yet
    if (liveMatchStatuses.has(match.status)) return '0 - 0';

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
    GROUP_STAGE: 'Group Stage',
    LAST_32: 'Round of 32',
    LAST_16: 'Round of 16',
    QUARTER_FINALS: 'Quarter-finals',
    SEMI_FINALS: 'Semi-finals',
    THIRD_PLACE: 'Third Place',
    FINAL: 'Final'
};

const scoreStages = new Set(['GROUP_STAGE', ...knockoutStageOrder]);

function getParticipantForTeam(teamCode) {
    return participants.find(player => player.teams.includes(teamCode)) || null;
}

function launchFireworks(container) {
    const fireworksLayer = container.querySelector('.winner-fireworks');
    if (!fireworksLayer) return;

    fireworksLayer.innerHTML = '';
    const colors = ['#f59e0b', '#ef4444', '#22c55e', '#38bdf8', '#f472b6', '#facc15'];

    for (let i = 0; i < 18; i += 1) {
        const spark = document.createElement('span');
        spark.className = 'firework';
        spark.style.left = `${45 + (Math.random() * 10 - 5)}%`;
        spark.style.top = `${35 + (Math.random() * 20 - 10)}%`;
        spark.style.backgroundColor = colors[i % colors.length];
        spark.style.setProperty('--x', `${(Math.cos((i / 18) * Math.PI * 2) * (60 + Math.random() * 50))}px`);
        spark.style.setProperty('--y', `${(Math.sin((i / 18) * Math.PI * 2) * (60 + Math.random() * 50))}px`);
        spark.style.animationDelay = `${Math.random() * 0.1}s`;
        fireworksLayer.appendChild(spark);
    }
}

function stopFireworks(container) {
    if (container.__fireworksTimer) {
        clearInterval(container.__fireworksTimer);
        container.__fireworksTimer = null;
    }
    const fireworksLayer = container.querySelector('.winner-fireworks');
    if (fireworksLayer) {
        fireworksLayer.innerHTML = '';
    }
}

function startFireworksLoop(container) {
    stopFireworks(container);
    launchFireworks(container);
    container.__fireworksTimer = window.setInterval(() => {
        launchFireworks(container);
    }, 1400);
}

function renderWinnerBanner(groups, matches = window.__worldCupMatches || []) {
    const banner = document.getElementById('winner-banner');
    if (!banner) return;

    const finalMatch = Array.isArray(matches)
        ? matches.find(match => match.stage === 'FINAL' && match.status === 'FINISHED')
        : null;

    if (!finalMatch) {
        banner.hidden = true;
        banner.classList.remove('visible');
        banner.innerHTML = '';
        stopFireworks(banner);
        return;
    }

    const fullTime = finalMatch.score?.fullTime;
    const homeGoals = fullTime?.home ?? finalMatch.score?.regularTime?.home;
    const awayGoals = fullTime?.away ?? finalMatch.score?.regularTime?.away;

    if (homeGoals === undefined || awayGoals === undefined || homeGoals === null || awayGoals === null) {
        banner.hidden = true;
        banner.classList.remove('visible');
        banner.innerHTML = '';
        stopFireworks(banner);
        return;
    }

    const winnerCode = homeGoals > awayGoals ? finalMatch.homeTeam?.tla : awayGoals > homeGoals ? finalMatch.awayTeam?.tla : null;

    if (!winnerCode) {
        banner.hidden = true;
        banner.classList.remove('visible');
        banner.innerHTML = '';
        stopFireworks(banner);
        return;
    }

    const participant = getParticipantForTeam(winnerCode);
    const flag = teamFlagMap[winnerCode] || '🏆';
    const participantName = participant ? participant.name : 'Unknown picker';

    banner.innerHTML = `
        <div class="winner-fireworks"></div>
        <div class="winner-title">Champion of the World</div>
        <div class="winner-content">
            <span class="winner-flag">${flag}</span>
            <div>
                <div class="winner-name">${participantName}</div>
                <div class="winner-team">${winnerCode} • ${homeGoals} - ${awayGoals}</div>
            </div>
            <div class="winner-score">Winner</div>
        </div>
    `;
    banner.classList.add('visible');
    banner.hidden = false;
    banner.style.display = 'block';
    startFireworksLoop(banner);
}

function buildGroupData(matches) {
    const groups = {};

    matches.forEach(match => {
        const groupKey = match.stage === 'GROUP_STAGE' ? match.group : match.stage;
        if (!groupKey) return;
        if (!groups[groupKey]) {
            groups[groupKey] = { fixtures: [], standings: [] };
        }

        // Normalize team codes (e.g., API sometimes uses URU instead of URY)
        const home = match.homeTeam?.tla === 'URU' ? 'URY' : (match.homeTeam?.tla || '');
        const away = match.awayTeam?.tla === 'URU' ? 'URY' : (match.awayTeam?.tla || '');

        const fixture = {
            home,
            away,
            stage: match.stage,
            utcDate: match.utcDate,
            score: getScoreLabel(match),
            time: formatMatchTime(match.utcDate),
            status: validMatchStatuses.has(match.status) ? match.status : 'TIMED',
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
        groups[groupKey].fixtures.sort((a, b) => {
            const dateA = new Date(a.utcDate || '9999-12-31').getTime();
            const dateB = new Date(b.utcDate || '9999-12-31').getTime();
            return dateA - dateB;
        });
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

            if (!match.isFinal && !liveMatchStatuses.has(match.status)) return;
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

        const standings = Object.entries(statsByTeam).map(([team, stats]) => ({
            team,
            pts: stats.pts,
            gf: stats.gf,
            ga: stats.ga,
            gd: stats.gf - stats.ga
        }));

        standings.sort((a, b) => {
            // Primary: Points (All matches)
            if (b.pts !== a.pts) return b.pts - a.pts;

            // Step 1: Head-to-Head among tied teams
            const tiedTeams = standings.filter(t => t.pts === a.pts).map(t => t.team);
            if (tiedTeams.length > 1) {
                const miniA = { pts: 0, gf: 0, ga: 0 };
                const miniB = { pts: 0, gf: 0, ga: 0 };

                group.fixtures.forEach(m => {
                    if (!m.isFinal && !liveMatchStatuses.has(m.status)) return;
                    if (tiedTeams.includes(m.home) && tiedTeams.includes(m.away)) {
                        const s = m.score.match(/^(\d+)\s*-\s*(\d+)$/);
                        if (!s) return;
                        const hg = Number(s[1]), ag = Number(s[2]);

                        if (m.home === a.team) {
                            miniA.gf += hg; miniA.ga += ag;
                            if (hg > ag) miniA.pts += 3; else if (hg === ag) miniA.pts += 1;
                        } else if (m.away === a.team) {
                            miniA.gf += ag; miniA.ga += hg;
                            if (ag > hg) miniA.pts += 3; else if (hg === ag) miniA.pts += 1;
                        }
                        if (m.home === b.team) {
                            miniB.gf += hg; miniB.ga += ag;
                            if (hg > ag) miniB.pts += 3; else if (hg === ag) miniB.pts += 1;
                        } else if (m.away === b.team) {
                            miniB.gf += ag; miniB.ga += hg;
                            if (ag > hg) miniB.pts += 3; else if (hg === ag) miniB.pts += 1;
                        }
                    }
                });

                if (miniB.pts !== miniA.pts) return miniB.pts - miniA.pts;
                if ((miniB.gf - miniB.ga) !== (miniA.gf - miniA.ga)) return (miniB.gf - miniB.ga) - (miniA.gf - miniA.ga);
                if (miniB.gf !== miniA.gf) return miniB.gf - miniA.gf;
            }

            // Step 2: Overall Goal Difference and Goals Scored
            if (b.gd !== a.gd) return b.gd - a.gd;
            if (b.gf !== a.gf) return b.gf - a.gf;

            // Final fallback: World Ranking
            const rankA = worldRanking[a.team] || 999;
            const rankB = worldRanking[b.team] || 999;
            if (rankA !== rankB) return rankA - rankB;

            return a.team.localeCompare(b.team);
        });

        group.standings = standings;
    });
}

function calculateParticipantScores(groups) {
    // Reset all participant stats before recalculating
    participants.forEach(player => {
        player.wins = 0;
        player.losses = 0;
        player.draws = 0;
    });

    Object.values(groups).forEach(group => {
        group.fixtures.forEach(match => {
            // Include finished matches and currently-live matches for real-time leaderboard/jackpot
            if (!match.isFinal && !liveMatchStatuses.has(match.status)) return;
            if (!scoreStages.has(match.stage)) return;

            const score = match.score.match(/^(\d+)\s*-\s*(\d+)$/);
            if (!score) return;

            const homeGoals = Number(score[1]);
            const awayGoals = Number(score[2]);
            const homeTla = match.home.trim();
            const awayTla = match.away.trim();

            if (homeGoals === awayGoals) {
                const homeOwner = participants.find(p => p.teams.includes(homeTla));
                const awayOwner = participants.find(p => p.teams.includes(awayTla));
                if (homeOwner) homeOwner.draws += 1;
                if (awayOwner) awayOwner.draws += 1;
            } else {
                const winningTla = homeGoals > awayGoals ? homeTla : awayTla;
                const losingTla = homeGoals < awayGoals ? homeTla : awayTla;
                
                const winOwner = participants.find(p => p.teams.includes(winningTla));
                const lossOwner = participants.find(p => p.teams.includes(losingTla));

                if (winOwner) winOwner.wins += 1;
                if (lossOwner) lossOwner.losses += 1;
            }
        });
    });

    participants.sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (a.losses !== b.losses) return a.losses - b.losses;
        return a.draws - b.draws;
    });
}

function projectLast32FromStandings(groups) {
    const last32 = groups.LAST_32;
    if (!last32 || !Array.isArray(last32.fixtures) || !last32.fixtures.length) return;

    const groupLetters = 'ABCDEFGHIJKL'.split('');
    const winners = {};
    const runnersUp = {};
    const thirdPlaceRows = [];

    groupLetters.forEach(letter => {
        const standings = groups[`GROUP_${letter}`]?.standings || [];
        if (standings[0]) winners[letter] = standings[0].team;
        if (standings[1]) runnersUp[letter] = standings[1].team;
        if (standings[2]) {
            thirdPlaceRows.push({
                group: letter,
                ...standings[2]
            });
        }
    });

    const rankedThirds = [...thirdPlaceRows].sort((a, b) =>
        b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team)
    );

    const qualifiedThirdGroupSet = new Set(rankedThirds.slice(0, 8).map(row => row.group));
    const thirdRankIndex = rankedThirds.reduce((acc, row, index) => {
        acc[row.group] = index;
        return acc;
    }, {});

    const matchups = [
        { home: { type: 'R', group: 'A' }, away: { type: 'R', group: 'B' } },
        { home: { type: 'W', group: 'C' }, away: { type: 'R', group: 'F' } },
        { home: { type: 'W', group: 'E' }, away: { type: 'T', groups: ['A', 'B', 'C', 'D', 'F'] } },
        { home: { type: 'W', group: 'F' }, away: { type: 'R', group: 'C' } },
        { home: { type: 'R', group: 'E' }, away: { type: 'R', group: 'I' } },
        { home: { type: 'W', group: 'I' }, away: { type: 'T', groups: ['C', 'D', 'F', 'G', 'H'] } },
        { home: { type: 'W', group: 'A' }, away: { type: 'T', groups: ['C', 'E', 'F', 'H', 'I'] } },
        { home: { type: 'W', group: 'L' }, away: { type: 'T', groups: ['E', 'H', 'I', 'J', 'K'] } },
        { home: { type: 'W', group: 'G' }, away: { type: 'T', groups: ['A', 'E', 'H', 'I', 'J'] } },
        { home: { type: 'W', group: 'D' }, away: { type: 'T', groups: ['B', 'E', 'F', 'I', 'J'] } },
        { home: { type: 'W', group: 'H' }, away: { type: 'R', group: 'J' } },
        { home: { type: 'R', group: 'K' }, away: { type: 'R', group: 'L' } },
        { home: { type: 'W', group: 'B' }, away: { type: 'T', groups: ['E', 'F', 'G', 'I', 'J'] } },
        { home: { type: 'R', group: 'D' }, away: { type: 'R', group: 'G' } },
        { home: { type: 'W', group: 'J' }, away: { type: 'R', group: 'H' } },
        { home: { type: 'W', group: 'K' }, away: { type: 'T', groups: ['D', 'E', 'I', 'J', 'L'] } }
    ];

    function getFixedTeam(slot) {
        if (slot.type === 'W') return winners[slot.group] || '';
        if (slot.type === 'R') return runnersUp[slot.group] || '';
        return '';
    }

    const thirdAssignments = matchups
        .map((pairing, matchIndex) => [
            { matchIndex, side: 'home', groups: pairing.home.type === 'T' ? pairing.home.groups : null },
            { matchIndex, side: 'away', groups: pairing.away.type === 'T' ? pairing.away.groups : null }
        ])
        .flat()
        .filter(entry => Array.isArray(entry.groups))
        .map(entry => ({
            ...entry,
            candidates: entry.groups
                .filter(group => qualifiedThirdGroupSet.has(group))
                .sort((a, b) => (thirdRankIndex[a] ?? 999) - (thirdRankIndex[b] ?? 999))
        }));

    const thirdTeamByMatch = Array.from({ length: matchups.length }, () => ({ home: '', away: '' }));
    const usedThirdGroups = new Set();

    // Solve all third-place slots together to avoid duplicates and dead ends.
    thirdAssignments.sort((a, b) => a.candidates.length - b.candidates.length);

    function assignThirdTeams(index) {
        if (index >= thirdAssignments.length) return true;

        const target = thirdAssignments[index];
        for (const group of target.candidates) {
            if (usedThirdGroups.has(group)) continue;

            const thirdTeam = groups[`GROUP_${group}`]?.standings?.[2]?.team;
            if (!thirdTeam) continue;

            usedThirdGroups.add(group);
            thirdTeamByMatch[target.matchIndex][target.side] = thirdTeam;

            if (assignThirdTeams(index + 1)) return true;

            usedThirdGroups.delete(group);
            thirdTeamByMatch[target.matchIndex][target.side] = '';
        }

        return false;
    }

    const hasValidThirdMapping = assignThirdTeams(0);

    const fixtures = [...last32.fixtures].sort((a, b) => {
        const dateA = new Date(a.utcDate || '9999-12-31').getTime();
        const dateB = new Date(b.utcDate || '9999-12-31').getTime();
        return dateA - dateB;
    });

    fixtures.forEach((fixture, index) => {
        const pairing = matchups[index];
        if (!pairing) return;

        const homeTeam = pairing.home.type === 'T'
            ? (hasValidThirdMapping ? thirdTeamByMatch[index].home : '')
            : getFixedTeam(pairing.home);

        const awayTeam = pairing.away.type === 'T'
            ? (hasValidThirdMapping ? thirdTeamByMatch[index].away : '')
            : getFixedTeam(pairing.away);

        const existingHome = typeof fixture.home === 'string' ? fixture.home.trim() : fixture.home;
        const existingAway = typeof fixture.away === 'string' ? fixture.away.trim() : fixture.away;

        if (!existingHome && homeTeam) fixture.home = homeTeam;
        if (!existingAway && awayTeam) fixture.away = awayTeam;
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

function isMatchLive(utcDate, status) {
    if (status === 'FINISHED') return false;
    if (!utcDate) return false;
    const matchStart = new Date(utcDate);
    const matchEnd = new Date(matchStart.getTime() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000); // 2:15 hours
    const now = new Date();
    return now >= matchStart && now < matchEnd;
}

function isMatchToday(utcDate) {
    if (!utcDate) return false;
    const matchDate = new Date(utcDate);
    const today = new Date();

    // Convert both to Eastern Time before comparing dates
    const etOffset = getEasternOffsetHours(matchDate) * 60 * 60 * 1000;
    const matchET = new Date(matchDate.getTime() + etOffset);
    const todayET = new Date(today.getTime() + getEasternOffsetHours(today) * 60 * 60 * 1000);

    return matchET.getUTCFullYear() === todayET.getUTCFullYear() &&
           matchET.getUTCMonth() === todayET.getUTCMonth() &&
           matchET.getUTCDate() === todayET.getUTCDate();
}

function renderLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = participants.map((player, index) => `
        <tr>
            <td><strong>#${index + 1}</strong></td>
            <td><strong>${player.name}</strong></td>
            <td class="teams-list" title="${player.teams.join(', ')}">${player.teams.join(', ')}</td>
            <td><span class="badge win-badge">${player.wins}</span></td>
            <td><span class="badge loss-badge">${player.losses}</span></td>
            <td><span class="badge draw-badge">${player.draws}</span></td>
        </tr>
    `).join('');

    // Calculate Jackpot: sum of all participants' losses and draws
    const totalPot = participants.reduce((total, player) => total + (player.losses || 0) + (player.draws || 0), 0);
    const jackpotElement = document.getElementById('jackpot-amount');
    if (jackpotElement) {
        jackpotElement.innerText = `$${totalPot}`;
    }
}

function renderGroupsByDate(groups) {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = '';
    
    // Collect all fixtures and sort by date
    const allFixtures = [];
    Object.entries(groups).forEach(([groupKey, group]) => {
        group.fixtures.forEach(f => {
            allFixtures.push({ ...f, groupKey });
        });
    });
    
    allFixtures.sort((a, b) => {
        const dateA = new Date(a.utcDate || '9999-12-31');
        const dateB = new Date(b.utcDate || '9999-12-31');
        return dateA - dateB;
    });
    
    if (!allFixtures.length) {
        container.innerHTML = '<p style="color: #f8fafc; padding: 20px;">No match data available.</p>';
        return;
    }
    
    // Group by date
    const dateGroups = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    allFixtures.forEach(f => {
        const date = new Date(f.utcDate);
        const etOffset = getEasternOffsetHours(date) * 60 * 60 * 1000;
        const etDate = new Date(date.getTime() + etOffset);
        const dateKey = `${monthNames[etDate.getUTCMonth()]} ${etDate.getUTCDate()}, ${etDate.getUTCFullYear()}`;
        if (!dateGroups[dateKey]) dateGroups[dateKey] = [];
        dateGroups[dateKey].push(f);
    });
    
    // Get today's date key in ET for scrolling
    const now = new Date();
    const todayEtOffset = getEasternOffsetHours(now) * 60 * 60 * 1000;
    const todayET = new Date(now.getTime() + todayEtOffset);
    const todayKey = `${monthNames[todayET.getUTCMonth()]} ${todayET.getUTCDate()}, ${todayET.getUTCFullYear()}`;
    
    // Render cards by date
    Object.entries(dateGroups).forEach(([dateKey, fixtures]) => {
        const card = document.createElement('div');
        card.className = 'card';
        if (dateKey === todayKey) {
            card.id = 'today-date-card';
        }

        const stageOrderByDate = ['GROUP_STAGE', ...knockoutStageOrder];
        const stageLabels = [...new Set(fixtures.map(f => f.stage))]
            .sort((a, b) => {
                const ai = stageOrderByDate.indexOf(a);
                const bi = stageOrderByDate.indexOf(b);
                if (ai !== -1 && bi !== -1) return ai - bi;
                if (ai !== -1) return -1;
                if (bi !== -1) return 1;
                return String(a).localeCompare(String(b));
            })
            .map(stage => stageDisplayNames[stage] || String(stage || '').replace(/_/g, ' '));
        const phaseText = stageLabels.join(' / ');
        
        const header = document.createElement('div');
        header.className = 'group-header';
        header.innerText = phaseText ? `${dateKey} - ${phaseText}` : dateKey;
        card.appendChild(header);
        
        const fixturesDiv = document.createElement('div');
        fixturesDiv.className = 'fixtures';
        fixturesDiv.innerHTML = fixtures.map(f => {
            const isFinal = f.isFinal;
            const isLive = isMatchLive(f.utcDate, f.status);
            const isToday = isMatchToday(f.utcDate);
            const liveHtml = isLive ? ' <span class="live-badge">LIVE</span>' : '';
            const todayClass = isToday && !isFinal ? ' today-match' : '';
            return `
                <div class="match-row${todayClass}">
                    <span class="match-time">${f.time}</span>
                    <span class="team"><span class="team-label">${getTeamLabel(f.home)}</span></span>
                    <span class="score ${isFinal ? 'final' : ''}${isLive ? ' live' : ''}">${f.score}${liveHtml}</span>
                    <span class="team away"><span class="team-label">${getTeamLabel(f.away)}</span></span>
                </div>
            `;
        }).join('');
        card.appendChild(fixturesDiv);
        
        container.appendChild(card);
    });
    
    // Scroll to today's date card if it exists
    const todayCard = document.getElementById('today-date-card');
    if (todayCard) {
        setTimeout(() => {
            todayCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    }

    renderWinnerBanner(groups, window.__worldCupMatches || []);
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
            const isLive = isMatchLive(f.utcDate, f.status);
            const isToday = isMatchToday(f.utcDate);
            const liveHtml = isLive ? ' <span class="live-badge">LIVE</span>' : '';
            const todayClass = isToday && !isFinal ? ' today-match' : '';
            return `
                <div class="match-row${todayClass}">
                    <span class="match-time">${f.time}</span>
                    <span class="team"><span class="team-label">${getTeamLabel(f.home)}</span></span>
                    <span class="score ${isFinal ? 'final' : ''}${isLive ? ' live' : ''}">${f.score}${liveHtml}</span>
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

    renderWinnerBanner(groups, window.__worldCupMatches || []);
}

function showError(message) {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `<p style="color: #f8fafc; padding: 20px;">${message}</p>`;
}

function renderDataSourceLegend(url) {
    const container = document.getElementById('data-source-container');
    if (!container) return;
    
    const isWorker = url.includes('workers.dev');
    const sourceName = isWorker ? 'Live Update (Cloudflare)' : 'GitHub Registry (data.json)';
    
    container.innerHTML = `<p style="font-size: 10px; color: #22d3ee; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold;">Source: ${sourceName}</p>`;
}

async function loadDataJson() {
    const sources = [
        'https://worldcup-api.rramoscr.workers.dev/',
        'data.json'
    ];

    for (const url of sources) {
        try {
            // Add a cache-buster (?t=...) to bypass GitHub Pages/CDN caching
            const cacheBuster = `?t=${new Date().getTime()}`;
            const response = await fetch(url + cacheBuster);
            
            if (!response.ok) continue;

            // The worker returns a string, not JSON. This check prevents a crash.
            const data = await response.json();
            if (data && data.matches) {
                return { matches: data.matches, sourceUrl: url };
            }
        } catch (err) {
            console.warn(`Failed to load data from ${url}, trying next...`);
        }
    }

    showError('Unable to fetch World Cup data. Please check your connection or try again later.');
    return { matches: [], sourceUrl: '' };
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    let currentGroups = null;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            const tab = button.getAttribute('data-tab');
            if (tab === 'grouped') {
                renderGroups(currentGroups);
            } else if (tab === 'bydate') {
                renderGroupsByDate(currentGroups);
            }
            requestAnimationFrame(() => {
                renderWinnerBanner(currentGroups, window.__worldCupMatches || []);
            });
        });
    });
    
    return (groups) => { currentGroups = groups; };
}

async function init() {
    const { matches, sourceUrl } = await loadDataJson();
    if (!matches.length) return;

    renderDataSourceLegend(sourceUrl);
    const groups = buildGroupData(matches);
    calculateGroupStandings(groups);
    projectLast32FromStandings(groups);
    calculateParticipantScores(groups);
    renderLeaderboard();
    window.__worldCupMatches = matches;
    renderWinnerBanner(groups, matches);
    
    const setCurrentGroups = setupTabs();
    setCurrentGroups(groups);
    renderGroupsByDate(groups);
}

document.addEventListener('DOMContentLoaded', init);
