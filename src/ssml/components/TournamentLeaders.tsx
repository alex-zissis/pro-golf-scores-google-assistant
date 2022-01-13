/** @jsx ssml */
import ssml, {FC} from 'ssml-tsx';
import ordinal from 'ordinal';
import {LeaderboardEntry} from '../../types/golfscores';
import {joinArrayAsSentence} from '../../utils.js';
import {GolfScore} from './GolfScore.js';
import {TournamentStatus} from '../../types/enums';

interface TournamentLeaderProps {
    leaders: LeaderboardEntry[];
    currentRound: number;
    roundStatus: TournamentStatus;
    isTournamentComplete: boolean;
}

const TournamentLeaders: FC<TournamentLeaderProps> = ({leaders, currentRound, roundStatus, isTournamentComplete}) => {
    const getLeaderOrWinner = () =>
        isTournamentComplete
            ? leaders.length > 1
                ? 'were the joint winners'
                : `The winner was`
            : leaders.length > 1
            ? 'are the joint leaders'
            : `The leader is currently`;

    if (leaders.length === 1) {
        const [leaderEntry] = leaders;
        return (
            <p>
                {getLeaderOrWinner()} {leaderEntry.player.firstName} {leaderEntry.player.lastName} at{' '}
                <GolfScore score={leaderEntry.score} />,{' '}
                {roundStatus === TournamentStatus.InProgress ? 'during' : 'after'} the {ordinal(currentRound)} round.
            </p>
        );
    }

    return (
        <p>
            {joinArrayAsSentence(leaders.map((entry) => `${entry.player.firstName} ${entry.player.lastName}`))}{' '}
            {getLeaderOrWinner()} at <GolfScore score={leaders[0].score} />,{' '}
            {roundStatus === TournamentStatus.InProgress ? 'during' : 'after'} the {ordinal(currentRound)} round.
        </p>
    );
};

export {TournamentLeaders};
