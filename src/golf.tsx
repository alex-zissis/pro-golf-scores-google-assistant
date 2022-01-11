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
import {LeaderboardEntry} from './types/leaderboard';
import {GetLeaderboardHandler} from './ssml';

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
    const leaderboardForDisplay = leaderboard.slice(0, 10);

    const getHighestRoundPlayerHasStarted = (player: LeaderboardEntry) => {
        let highestRound = 0;
        for (const round of player.rounds) {
            if (round.thru > 0) {
                highestRound = round.sequence;
            } else {
                break;
            }
        }

        return highestRound;
    };

    let roundInProgress = 1;
    let i = 0;
    let anyRoundVariance = false;
    for (const player of leaderboard) {
        const highestRound = getHighestRoundPlayerHasStarted(player);

        // If anyone is in the 4th round, then that round is in progress.
        if (highestRound === 4) {
            roundInProgress = highestRound;
            break;
        }

        // if one person is in round 3 and anyone we find has not started round 3, round 3 must be in progress.
        if (i > 0 && roundInProgress < highestRound) {
            break;
        }

        if (highestRound > roundInProgress) {
            roundInProgress = highestRound;
        }

        if (i > 0 && highestRound !== roundInProgress) {
            anyRoundVariance = true;
        }

        i++;
    }

    const speech = (
        renderToString(<GetLeaderboardHandler
            leaderboardResponse={leaderboardResponse}
            roundInProgress={roundInProgress}
            anyRoundVariance={anyRoundVariance}
        />)
    );

    conv.add(
        new Simple({
            speech,
        })
    );

    conv.add(
        new Table({
            title: currentTournament.name,
            columns: [
                {header: '#'},
                {header: 'Name'},
                {header: 'Nation'},
                {header: 'Total'},
                {header: `R${roundInProgress}`},
            ],
            rows: [
                ...leaderboardForDisplay.map((player, i) => {
                    return {
                        cells: [
                            {text: getPositionForDisplay(player, leaderboardForDisplay[i - 1])},
                            {text: `${player.first_name} ${player.last_name}`},
                            {text: getFlagEmoji(countries.getAlpha2Code(player.country, 'en'))},
                            {text: getScoreForDisplay(player.score)},
                            {text: getRoundScoreForDisplay(player.rounds[roundInProgress - 1])},
                        ],
                    };
                }),
            ],
        })
    );
});

export default app;
