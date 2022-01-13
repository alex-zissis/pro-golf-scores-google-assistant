/** @jsx ssml */
import ssml, {FC} from 'ssml-tsx';
import {format} from 'date-fns';
import {TournamentBase} from '../../types/golfscores';
import {isTournamentComplete, isTournamentInFuture, isTournament} from '../../logic/golf.js';

const addTournamentVenueSuffixIfApplicable = (tournament: TournamentBase, leadIn = ' at ') =>
    `${isTournament(tournament) ? `${leadIn}${tournament.venue.name}.` : '.'}`;

interface TournamentIntroductionProps {
    tournament: TournamentBase;
}

const FutureTournamentIntroduction: FC<TournamentIntroductionProps> = ({tournament}) => (
    <p>
        The {tournament.name} is an upcoming event scheduled to begin{' '}
        <say-as interpret-as="date" format="ymd">
            {format(tournament.startDate, 'yyyy-MM-dd')}
        </say-as>
        {addTournamentVenueSuffixIfApplicable(tournament)}
    </p>
);

const CompletedTournamentIntroduction: FC<TournamentIntroductionProps> = ({tournament}) => (
    <p>
        The {tournament.name} finished on{' '}
        <say-as interpret-as="date" format="ymd">
            {format(tournament.endDate, 'yyyy-MM-dd')}
        </say-as>
        {addTournamentVenueSuffixIfApplicable(tournament, ' and was played at ')}
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
