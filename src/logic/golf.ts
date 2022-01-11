import numToWords from 'number-to-words';
import {LeaderboardEntry, LeaderboardResponse} from '../types/leaderboard';
import {Tournament, TournamentBase} from '../types/schedule';
import {getScoreForDisplay, joinArrayAsSentence} from '../utils.js';
import {addBreak, addNumber, addSubstitute} from './speech-helpers.js';

const getReadableStringFromScore = (score: number) => {
    if (score === 0) {
        return addSubstitute(getScoreForDisplay(score), 'even par');
    }

    return addSubstitute(
        getScoreForDisplay(score),
        `${numToWords.toWords(Math.abs(score)).replace('-', ' ')} ${score < 0 ? 'under' : 'over'}`
    );
};

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

interface GetLeadersAsReadableStringArgs {
    anyRoundVariance: boolean;
    roundInProgress: number;
}

const getLeadersAsReadableString = (
    leaders: Pick<LeaderboardEntry, 'first_name' | 'last_name' | 'score'>[],
    {anyRoundVariance, roundInProgress}: GetLeadersAsReadableStringArgs
) => {
    if (leaders.length === 1) {
        const [leader] = leaders;
        return `The leader is currently ${leader.first_name} ${leader.last_name} at ${getReadableStringFromScore(
            leader.score
        )}, ${anyRoundVariance ? 'during' : 'after'} the ${addNumber(roundInProgress, 'ordinal')} round.`;
    }

    return `${joinArrayAsSentence(
        leaders.map((player) => `${player.first_name} ${player.last_name}`)
    )} are the joint leaders at ${getReadableStringFromScore(leaders[0].score)}, ${
        anyRoundVariance ? 'during' : 'after'
    } the ${addNumber(roundInProgress, 'ordinal')} round.`;
};

function isLeaderboardResponse(ambigousTournament: any): ambigousTournament is LeaderboardResponse {
    return !!ambigousTournament.leaderboard;
}

function isTournament(ambigousTournament: any): ambigousTournament is Tournament {
    return !!ambigousTournament.venue;
}

const isTournamentInFuture = ({status}: Pick<TournamentBase, 'status'>) => status === 'scheduled';
const hasTournamentStarted = ({status}: Pick<TournamentBase, 'status'>) =>
    isTournamentInProgress({status}) || isTournamentFinished({status});
const isTournamentInProgress = ({status}: Pick<TournamentBase, 'status'>) => status === 'inprogress';
const isTournamentFinished = (
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

const addTournamentVenueSuffixIfApplicable = (
    speech: string,
    tournament: Tournament | LeaderboardResponse,
    leadIn = ' at '
) => `${speech}${isTournament(tournament) ? `${leadIn}${tournament.venue.name}` : '.'}`;

const getReadableIntroductionFromTournament = (tournament: Tournament | LeaderboardResponse) => {
    let speech = '';
    let leadIn: string | undefined;
    if (isTournamentInFuture(tournament)) {
        speech = `${speech}The ${tournament.name} is an upcoming event`;
    } else if (isTournamentFinished(tournament)) {
        speech = `${speech}The ${tournament.name}`;
        leadIn = ' was played at ';
    } else {
        speech = `${speech}The ${tournament.name} is currently under`;
    }

    return addBreak(addTournamentVenueSuffixIfApplicable(speech, tournament, leadIn));
};

export {
    getLeadersFromLeaderboard,
    getReadableStringFromScore,
    getLeadersAsReadableString,
    hasTournamentStarted,
    isTournamentInFuture,
    isTournamentFinished,
    isTournamentInProgress,
    getReadableIntroductionFromTournament,
};
