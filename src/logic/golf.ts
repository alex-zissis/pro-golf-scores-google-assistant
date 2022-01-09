import numToWords from 'number-to-words';
import {Leaderboard} from '../types/leaderboard';
import {getScoreForDisplay} from '../utils';

const getReadableStringFromScore = (score: number) => {
    if (score === 0) {
        return `<sub alias="even par">${getScoreForDisplay(score)}</sub>`;
    } else if (score < 0) {
        return `<sub alias="${numToWords.toWords(Math.abs(score)).replace('-', ' ')} under">${getScoreForDisplay(
            score
        )}</sub>`;
    } else {
        return `<sub alias="${numToWords.toWords(Math.abs(score)).replace('-', ' ')} over">${getScoreForDisplay(
            score
        )}</sub>`;
    }
};

const getLeadersFromLeaderboard = (leaderboard: Leaderboard[]): Leaderboard[] => {
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

export {getLeadersFromLeaderboard, getReadableStringFromScore};
