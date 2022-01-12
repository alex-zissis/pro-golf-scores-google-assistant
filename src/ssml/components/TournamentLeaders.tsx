/** @jsx ssml */
import ssml, {FC} from 'ssml-tsx';
import ordinal from 'ordinal';
import {LeaderboardEntry} from '../../types/leaderboard';
import {joinArrayAsSentence} from '../../utils.js';
import {GolfScore} from './GolfScore.js';
import {TournamentStatus} from '../../types/schedule';

interface TournamentLeaderProps {
    leaders: Pick<LeaderboardEntry, 'first_name' | 'last_name' | 'score'>[];
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
        const [leader] = leaders;
        return (
            <p>
                {getLeaderOrWinner()} {leader.first_name} {leader.last_name} at <GolfScore score={leader.score} />,{' '}
                {roundStatus === 'inprogress' ? 'during' : 'after'} the {ordinal(currentRound)} round.
            </p>
        );
    }

    return (
        <p>
            {joinArrayAsSentence(leaders.map((player) => `${player.first_name} ${player.last_name}`))}{' '}
            {getLeaderOrWinner()} at <GolfScore score={leaders[0].score} />,{' '}
            {roundStatus === 'inprogress' ? 'during' : 'after'} the {ordinal(currentRound)} round.
        </p>
    );
};

export {TournamentLeaders};
