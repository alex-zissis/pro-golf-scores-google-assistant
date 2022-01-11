import {LeaderboardEntry, LeaderboardResponse} from '../types/leaderboard';
import {Tournament, TournamentBase} from '../types/schedule';

const getLeadersFromLeaderboard = (leaderboard: LeaderboardEntry[]): LeaderboardEntry[] => {
    let leaders = [];
    for (const player of leaderboard) {
        if (player.position === 1) {
            leaders.push(player);
        } else {
            break;
        }
    }

    return leaders;
};

function isLeaderboardResponse(ambigousTournament: any): ambigousTournament is LeaderboardResponse {
    return !!ambigousTournament.leaderboard;
}

function isTournament(ambigousTournament: any): ambigousTournament is Tournament {
    return !!ambigousTournament.venue;
}

const isTournamentInFuture = ({status}: Pick<TournamentBase, 'status'>) => status === 'scheduled';
const hasTournamentStarted = ({status}: Pick<TournamentBase, 'status'>) =>
    isTournamentInProgress({status}) || isTournamentComplete({status});
const isTournamentInProgress = ({status}: Pick<TournamentBase, 'status'>) => status === 'inprogress';
const isTournamentComplete = (
    tournament: Pick<Tournament, 'status'> | Pick<LeaderboardResponse, 'status' | 'leaderboard'>
) => {
    if (tournament.status === 'closed') {
        return true;
    }

    if (tournament.status === 'inprogress' && isLeaderboardResponse(tournament)) {
        const hasPlayersWhoHaveNotCompletedFourRounds = tournament.leaderboard.some(
            (player) => player.rounds.length !== 4 || player.rounds[4].thru !== 18
        );

        return hasPlayersWhoHaveNotCompletedFourRounds;
    }

    return false;
};

export {
    getLeadersFromLeaderboard,
    hasTournamentStarted,
    isTournamentInFuture,
    isTournamentComplete,
    isTournamentInProgress,
    isTournament,
    isLeaderboardResponse,
};
