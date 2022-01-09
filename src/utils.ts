import {fileURLToPath} from 'url';
import {Round} from './types/leaderboard';

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

function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        // @ts-ignore
        .map((char) => 127397 + char.charCodeAt());

    return String.fromCodePoint(...codePoints);
}

export {addHoursToDate, getRoundScoreForDisplay, getScoreForDisplay, joinArrayAsSentence, getFlagEmoji, dirname};
