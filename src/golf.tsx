/** @jsx ssml */
import ssml from 'ssml-tsx';
import {conversation, Table, Simple} from '@assistant/conversation';
import dotenv from 'dotenv';
import countries from 'i18n-iso-countries';
import {CurrentTournament} from './types/cache';
import {CacheKeys, readCache, writeCache} from './cache.js';
import {Schedule, Tournament} from './api.js';
import {mapTournamentToTournamentWithDates} from './mapper/tournament.js';
import {
    addHoursToDate,
    getFlagEmoji,
    getPositionForDisplay,
    getRoundScoreForDisplay,
    getScoreForDisplay,
} from './utils.js';
import {findClosestTournament} from './logic/tournament.js';
import {GetLeaderboardHandler} from './ssml/GetLeaderboardHandler.js';
import {getCurrentRound} from './logic/golf.js';

// dotenv is only used in a localdev envrironment
dotenv.config();
const {renderToString} = ssml;

const app = conversation({debug: process.env.NODE_ENV === 'development'});

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
    const {leaderboard} = leaderboardResponse;
    const {currentRound, status} = getCurrentRound(leaderboard);
    const leaderboardForDisplay = leaderboard.slice(0, 10);

    const speech = renderToString(
        <GetLeaderboardHandler
            leaderboardResponse={leaderboardResponse}
            currentRound={currentRound}
            roundStatus={status}
        />
    );

    conv.add(
        new Simple({
            speech,
        })
    );

    conv.add(
        new Table({
            title: leaderboardResponse.name,
            columns: [
                {header: '#'},
                {header: 'Name'},
                {header: 'Nation'},
                {header: 'Total'},
                {header: `R${currentRound}`},
            ],
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
        })
    );
});

export default app;
