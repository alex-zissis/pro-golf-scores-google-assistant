import {conversation, Table, Simple} from '@assistant/conversation';
import dotenv from 'dotenv';
import {CurrentTournament} from './types/cache';
import {CacheKeys, readCache, writeCache} from './cache.js';
import {Schedule, Tournament} from './api.js';
import {mapTournamentToTournamentWithDates} from './mapper/tournament.js';
import {addHoursToDate} from './utils.js';
import {findClosestTournament} from './logic/tournament.js';
import {getReadableStringFromScore} from './logic/golf.js';
dotenv.config();

const app = conversation({debug: true});

app.handle('getLeaderboard', async (conv) => {
    let currentTournament = await readCache<CurrentTournament>(CacheKeys.CurrentTournament);

    if (!currentTournament) {
        const scheduleResponse = await Schedule.getSchedule({});

        const tournamentsWithDates = mapTournamentToTournamentWithDates(scheduleResponse.tournaments);
        const today = new Date();
        const closestTournament = findClosestTournament(tournamentsWithDates, today);

        currentTournament = {
            id: closestTournament.id,
            name: closestTournament.name,
            expiresUtc: (today > closestTournament.end_date
                ? addHoursToDate(today, 6)
                : addHoursToDate(closestTournament.end_date, 12)
            ).toISOString(),
            year: scheduleResponse.season.year,
        };

        await writeCache(CacheKeys.CurrentTournament, currentTournament);
    }

    const leaderboardResponse = await Tournament.getLeaderboard(currentTournament.id, currentTournament.year);
    const leaderboard = leaderboardResponse.leaderboard.slice(0, 10);
    const [leader] = leaderboard;

    conv.add(
        new Simple({
            speech: `<speak>The ${currentTournament.name} is currently underway. <break time="1" />
    The leader is currently ${leader.first_name} ${leader.last_name} at ${getReadableStringFromScore(
                leader.score
            )}.</speak>`,
        })
    );

    conv.add(
        new Table({
            title: 'Leaderboard',
            columns: [{header: 'Name'}, {header: 'Total'}, {header: `R${leader.rounds.length}`}],
            rows: [
                ...leaderboard.map((player) => {
                    return {
                        cells: [
                            {text: `${player.first_name} ${player.last_name}`},
                            {text: player.score.toString()},
                            {text: player.rounds[player.rounds.length - 1].score.toString()},
                        ],
                    };
                }),
            ],
        })
    );
});

export default app;
