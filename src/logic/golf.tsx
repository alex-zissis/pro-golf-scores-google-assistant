import {LeaderboardEntry, TournamentResponse, TournamentDetailed, TournamentBase} from '../types/golfscores';
import {TournamentStatus} from '../types/enums.js';

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

const getHighestRoundPlayerHasStarted = (player: LeaderboardEntry) => {
    let highestRound = 1;
    for (const round of player.rounds) {
        if (round.thru > 0) {
            highestRound = round.roundNumber;
            continue;
        }

        break;
    }

    return highestRound;
};

const getCurrentRound = (leaderboard: LeaderboardEntry[]): {currentRound: number; status: TournamentStatus} => {
    let currentRound = 1;
    let i = 0;
    let anyRoundVariance = false;
    for (const player of leaderboard) {
        const highestRound = getHighestRoundPlayerHasStarted(player);

        // If anyone is in the 4th round, then that round is in progress.
        if (highestRound === 4) {
            currentRound = highestRound;
            break;
        }

        // if one person is in round 3 and anyone we find has not started round 3, round 3 must be in progress.
        if (i > 0 && currentRound < highestRound) {
            break;
        }

        if (highestRound > currentRound) {
            currentRound = highestRound;
        }

        if (i > 0 && highestRound !== currentRound) {
            anyRoundVariance = true;
            break;
        }

        i++;
    }

    return {currentRound, status: anyRoundVariance ? TournamentStatus.InProgress : TournamentStatus.Completed};
};

function isTournamentResponse(ambigousTournament: any): ambigousTournament is TournamentResponse {
    return !!ambigousTournament.leaderboard;
}

function isTournament(ambigousTournament: any): ambigousTournament is TournamentDetailed {
    return !!ambigousTournament.venue && ambigousTournament.venue.name;
}

const isTournamentInFuture = ({status}: TournamentBase) => status === TournamentStatus.Upcoming;
const hasTournamentStarted = (tournament: TournamentBase) =>
    isTournamentInProgress(tournament) || isTournamentComplete(tournament);
const isTournamentInProgress = ({status}: TournamentBase) => status === TournamentStatus.InProgress;
const isTournamentComplete = (tournament: TournamentBase) => {
    if (tournament.status === TournamentStatus.Completed) {
        return true;
    }

    if (tournament.status === TournamentStatus.InProgress && isTournamentResponse(tournament)) {
        const haveAllPlayersCompletedFourRounds = tournament.leaderboard.every(
            // todo support less that 4 rounds
            (player) => player.rounds.length === 4 && player.rounds[3].thru === 18
        );

        return haveAllPlayersCompletedFourRounds;
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
    isTournamentResponse,
    getHighestRoundPlayerHasStarted,
    getCurrentRound,
};
