import {Table} from '@assistant/conversation';
import {LeaderboardEntry} from '../types/golfscores.js';
import {getFlagEmoji, getPositionForDisplay, getRoundScoreForDisplay, getScoreForDisplay} from '../utils.js';

const getLeaderboardTableForTournament = (
    tournamentName: string,
    currentRound: number,
    leaderboard: LeaderboardEntry[]
): Table => {
    const leaderboardForDisplay = leaderboard.slice(0, 10);

    return new Table({
        title: tournamentName,
        columns: [{header: '#'}, {header: 'Name'}, {header: 'Nation'}, {header: 'Total'}, {header: `R${currentRound}`}],
        rows: [
            ...leaderboardForDisplay.map((entry, i) => {
                return {
                    cells: [
                        {text: getPositionForDisplay(entry, leaderboardForDisplay[i - 1])},
                        {text: `${entry.player.firstName} ${entry.player.lastName}`},
                        {text: getFlagEmoji(entry.player.country)},
                        {text: getScoreForDisplay(entry.score)},
                        {text: getRoundScoreForDisplay(entry.rounds[currentRound - 1])},
                    ],
                };
            }),
        ],
    });
};

export {getLeaderboardTableForTournament};
