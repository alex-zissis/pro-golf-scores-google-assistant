/** @jsx ssml */
import {ConversationV3, Simple, Table} from '@assistant/conversation';
import {ConversationV3Handler} from '@assistant/conversation/dist/conversation';
import ssml from 'ssml-tsx';
import countries from 'i18n-iso-countries';
import {Schedule, Tournament} from '../api.js';
import cache, {CacheKeys} from '../cache';
import {getCurrentRound} from '../logic/golf.js';
import {findClosestTournament} from '../logic/tournament.js';
import {mapTournamentToTournamentWithDates} from '../mappers/tournament.js';
import {
    addHoursToDate,
    getFlagEmoji,
    getPositionForDisplay,
    getRoundScoreForDisplay,
    getScoreForDisplay,
} from '../utils.js';
import {GetLeaderboardHandler} from '../ssml/GetLeaderboardHandler.js';
import {CurrentTournament} from '../types/cache.js';
const {renderToString} = ssml;

const getLeaderboard: ConversationV3Handler<ConversationV3> = async (conv) => {
    let currentTournament = await cache.readCache<CurrentTournament>(CacheKeys.CurrentTournament);

    if (!currentTournament) {
        const scheduleResponse = await Schedule.getSchedule();

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

        await cache.writeCache(CacheKeys.CurrentTournament, currentTournament);
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
};

export {getLeaderboard};
