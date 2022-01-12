import {fileURLToPath} from 'url';
import {LeaderboardEntry, Round} from './types/leaderboard';

const dirname = fileURLToPath(import.meta.url);

const addHoursToDate = (date: Date, hours: number) => {
    const outputDate = new Date(date);
    outputDate.setHours(date.getHours() + hours);
    return outputDate;
};

const joinArrayAsSentence = (arr: string[], joinChar = ',') => {
    if (arr.length === 0) {
        return '';
    }

    if (arr.length === 1) {
        return arr[0];
    }

    const start = arr.slice(0, -1);
    const last = arr[arr.length - 1];

    return `${start.join(`${joinChar} `)} and ${last}`;
};

const getRoundScoreForDisplay = ({thru, score}: Pick<Round, 'thru' | 'score'>): string => {
    if (thru === 0 && score === 0) {
        return '-';
    }

    return getScoreForDisplay(score);
};

const getScoreForDisplay = (score: number): string => {
    if (score > 0) {
        return `+${score}`;
    }

    if (score === 0) {
        return 'E';
    }

    return score.toString();
};

const getPositionForDisplay = (player: LeaderboardEntry, lastPlayer: LeaderboardEntry) => {
    if (!lastPlayer) {
        return player.position.toString();
    }

    if (player.position === lastPlayer.position) {
        return '';
    }

    return player.position.toString();
};

function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
}

const isDevelopment = () => process.env.NODE_ENV === 'development';
const isTest = () => process.env.NODE_ENV === 'test';
const isProduction = () => process.env.NODE_ENV === 'production';

export {
    addHoursToDate,
    getPositionForDisplay,
    getRoundScoreForDisplay,
    getScoreForDisplay,
    joinArrayAsSentence,
    getFlagEmoji,
    dirname,
    isDevelopment,
    isTest,
    isProduction,
};
