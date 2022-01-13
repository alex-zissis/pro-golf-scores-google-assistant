/** @jsx ssml */
import {ConversationV3, Simple} from '@assistant/conversation';
import {ConversationV3Handler} from '@assistant/conversation/dist/conversation';
import ssml from 'ssml-tsx';
import {SportRadarApi} from '../api/SportRadarApi.js';
import cache, {CacheKeys} from '../cache.js';
import {getCurrentRound} from '../logic/golf.js';
import {findClosestTournament} from '../logic/tournament.js';
import {addHoursToDate} from '../utils.js';
import {GetLeaderboardHandler} from '../ssml/GetLeaderboardHandler.js';
import {CurrentTournament} from '../types/cache.js';
import {getLeaderboardTableForTournament} from '../renderers/table.js';
const {renderToString} = ssml;

const getTournament: ConversationV3Handler<ConversationV3> = async (conv) => {
    let currentTournament = await cache.readCache<CurrentTournament>(CacheKeys.CurrentTournament);

    if (!currentTournament) {
        const scheduleResponse = await SportRadarApi.getSchedule();

        const today = new Date();
        const closestTournament = findClosestTournament(scheduleResponse.tournaments, today);

        currentTournament = {
            provider: closestTournament.provider,
            name: closestTournament.name,
            expiresUtc: (today > closestTournament.startDate
                ? addHoursToDate(today, 6)
                : addHoursToDate(closestTournament.endDate, 12)
            ).toISOString(),
            year: scheduleResponse.season.year,
        };

        await cache.writeCache(CacheKeys.CurrentTournament, currentTournament);
    }

    const tournamentResponse = await SportRadarApi.getTournament(
        currentTournament.provider.baseId,
        currentTournament.year
    );
    const {leaderboard} = tournamentResponse;
    const {currentRound, status} = getCurrentRound(leaderboard);

    const speech = renderToString(
        <GetLeaderboardHandler
            tournamentResponse={tournamentResponse}
            currentRound={currentRound}
            roundStatus={status}
        />
    );

    conv.add(
        new Simple({
            speech,
        })
    );

    conv.add(getLeaderboardTableForTournament(tournamentResponse.name, currentRound, leaderboard));
};

export {getTournament};
