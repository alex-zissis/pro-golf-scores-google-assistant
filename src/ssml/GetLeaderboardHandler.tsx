/** @jsx ssml */
import ssml, {FC} from 'ssml-tsx';
import {getLeadersFromLeaderboard, isTournamentComplete} from '../logic/golf.js';
import {LeaderboardResponse} from '../types/leaderboard';
import {TournamentIntroduction, TournamentLeaders} from './components';

interface GetLeaderboardHandlerProps {
    leaderboardResponse: LeaderboardResponse;
    roundInProgress: number;
    anyRoundVariance: boolean;
}

const GetLeaderboardHandler: FC<GetLeaderboardHandlerProps> = ({
    leaderboardResponse,
    roundInProgress,
    anyRoundVariance,
}) => (
    <speak>
        <TournamentIntroduction tournament={leaderboardResponse} />
        <TournamentLeaders
            leaders={getLeadersFromLeaderboard(leaderboardResponse.leaderboard)}
            roundInProgress={roundInProgress}
            anyRoundVariance={anyRoundVariance}
            isTournamentComplete={isTournamentComplete(leaderboardResponse)}
        />
    </speak>
);
export {GetLeaderboardHandler};
