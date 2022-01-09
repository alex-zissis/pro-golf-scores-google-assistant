import numToWords from 'number-to-words';
import {Leaderboard} from '../types/leaderboard';

const getReadableStringFromScore = (score: number) => {
    if (score === 0) {
        return 'Even par';
    } else if (score < 0) {
        return `<sub alias="${numToWords.toWords(Math.abs(score)).replace('-', ' ')} under">${score}</sub>`;
    } else {
        return `<sub alias="${numToWords.toWords(Math.abs(score)).replace('-', ' ')} over">+${score}</sub>`;
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
