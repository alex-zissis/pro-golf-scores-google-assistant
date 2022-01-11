/** @jsx ssml */
import ssml, {FC} from 'ssml-tsx';
import {Tournament} from '../../types/schedule';
import {LeaderboardResponse} from '../../types/leaderboard';
import {isTournamentComplete, isTournamentInFuture, isTournament} from '../../logic/golf.js';

const addTournamentVenueSuffixIfApplicable = (tournament: Tournament | LeaderboardResponse, leadIn = ' at ') =>
    `${isTournament(tournament) ? `${leadIn}${tournament.venue.name}` : '.'}`;

interface TournamentIntroductionProps {
    tournament: Tournament | LeaderboardResponse;
}

const FutureTournamentIntroduction: FC<TournamentIntroductionProps> = ({tournament}) => (
    <p>
        The {tournament.name} is an upcoming event{addTournamentVenueSuffixIfApplicable(tournament)}
    </p>
);

const CompletedTournamentIntroduction: FC<TournamentIntroductionProps> = ({tournament}) => (
    <p>
        The {tournament.name} finished on{' '}
        <say-as interpret-as="date" format="y-m-d">
            {tournament.end_date}
        </say-as>
        {addTournamentVenueSuffixIfApplicable(tournament, ' was played at ')}
    </p>
);

const InProgressTournamentIntroduction: FC<TournamentIntroductionProps> = ({tournament}) => (
    <p>
        The {tournament.name} is currently underway{addTournamentVenueSuffixIfApplicable(tournament)}
    </p>
);

const TournamentIntroduction: FC<TournamentIntroductionProps> = ({tournament}) => {
    if (isTournamentInFuture(tournament)) {
        return <FutureTournamentIntroduction tournament={tournament} />;
    }

    if (isTournamentComplete(tournament)) {
        return <CompletedTournamentIntroduction tournament={tournament} />;
    }

    return <InProgressTournamentIntroduction tournament={tournament} />;
};

export {TournamentIntroduction};
