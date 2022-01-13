/** @jsx _ssml */
import _ssml, {FC} from 'ssml-tsx';
import {getLeadersFromLeaderboard, isTournamentComplete} from '../logic/golf.js';
import {TournamentStatus} from '../types/enums.js';
import {TournamentResponse} from '../types/golfscores.js';
import {TournamentIntroduction} from './components/TournamentIntroduction.js';
import {TournamentLeaders} from './components/TournamentLeaders.js';

interface GetLeaderboardHandlerProps {
    tournamentResponse: TournamentResponse;
    currentRound: number;
    roundStatus: TournamentStatus;
}

const GetLeaderboardHandler: FC<GetLeaderboardHandlerProps> = ({tournamentResponse, currentRound, roundStatus}) => (
    <speak>
        <TournamentIntroduction tournament={tournamentResponse} />
        <TournamentLeaders
            leaders={getLeadersFromLeaderboard(tournamentResponse.leaderboard)}
            currentRound={currentRound}
            roundStatus={roundStatus}
            isTournamentComplete={isTournamentComplete(tournamentResponse)}
        />
    </speak>
);
export {GetLeaderboardHandler};
