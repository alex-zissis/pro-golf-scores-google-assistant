import {Table} from '@assistant/conversation';
import countries from 'i18n-iso-countries';
import {LeaderboardEntry} from '../types/leaderboard';
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
            ...leaderboardForDisplay.map((player, i) => {
                return {
                    cells: [
                        {text: getPositionForDisplay(player, leaderboardForDisplay[i - 1])},
                        {text: `${player.first_name} ${player.last_name}`},
                        {text: getFlagEmoji(countries.getAlpha2Code(player.country, 'en'))},
                        {text: getScoreForDisplay(player.score)},
                        {text: getRoundScoreForDisplay(player.rounds[currentRound - 1])},
                    ],
                };
            }),
        ],
    });
};

export {getLeaderboardTableForTournament};
