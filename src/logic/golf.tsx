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

const isTournamentInFuture = ({status}: TournamentBase) => status === 'scheduled';
const hasTournamentStarted = (tournament: TournamentBase) =>
    isTournamentInProgress(tournament) || isTournamentComplete(tournament);
const isTournamentInProgress = ({status}: TournamentBase) => status === 'inprogress';
const isTournamentComplete = (tournament: TournamentBase) => {
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
