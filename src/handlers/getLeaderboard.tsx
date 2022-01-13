/** @jsx ssml */
import {ConversationV3, Simple} from '@assistant/conversation';
import {ConversationV3Handler} from '@assistant/conversation/dist/conversation';
import ssml from 'ssml-tsx';
import {Schedule, Tournament} from '../api.js';
import cache, {CacheKeys} from '../cache.js';
import {getCurrentRound} from '../logic/golf.js';
import {findClosestTournament} from '../logic/tournament.js';
import {mapTournamentToTournamentWithDates} from '../mappers/tournament.js';
import {addHoursToDate} from '../utils.js';
import {GetLeaderboardHandler} from '../ssml/GetLeaderboardHandler.js';
import {CurrentTournament} from '../types/cache.js';
import {getLeaderboardTableForTournament} from '../renderers/table.js';
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

    conv.add(getLeaderboardTableForTournament(leaderboardResponse.name, currentRound, leaderboard));
};

export {getLeaderboard};
