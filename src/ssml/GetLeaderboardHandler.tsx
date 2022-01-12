/** @jsx ssml */
import ssml, {FC} from 'ssml-tsx';
import {getLeadersFromLeaderboard, isTournamentComplete} from '../logic/golf.js';
import {LeaderboardResponse} from '../types/leaderboard';
import {TournamentStatus} from '../types/schedule';
import {TournamentIntroduction} from './components/TournamentIntroduction.js';
import {TournamentLeaders} from './components/TournamentLeaders.js';

interface GetLeaderboardHandlerProps {
    leaderboardResponse: LeaderboardResponse;
    currentRound: number;
    roundStatus: TournamentStatus;
}

const GetLeaderboardHandler: FC<GetLeaderboardHandlerProps> = ({
    leaderboardResponse,
    currentRound,
    roundStatus,
}) => (
    <speak>
        <TournamentIntroduction tournament={leaderboardResponse} />
        <TournamentLeaders
            leaders={getLeadersFromLeaderboard(leaderboardResponse.leaderboard)}
            currentRound={currentRound}
            roundStatus={roundStatus}
            isTournamentComplete={isTournamentComplete(leaderboardResponse)}
        />
    </speak>
);
export {GetLeaderboardHandler};
