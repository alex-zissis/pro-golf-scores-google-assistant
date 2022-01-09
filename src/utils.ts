import {fileURLToPath} from 'url';
import {Round} from './types/leaderboard';

const dirname = fileURLToPath(import.meta.url);

const addHoursToDate = (date: Date, hours: number) => {
    const outputDate = new Date();
    outputDate.setHours(date.getHours() + hours);
    return outputDate;
};

const joinArrayAsSentence = (arr: string[], joinChar = ',') => {
    const start = arr.slice(0, -1);
    const last = arr[arr.length - 1];

    return `${start.join(`${joinChar} `)} and ${last}`;
};

const getScoreForDisplay = (round: Round): string => {
    if (round.thru !== 0) {
        return round.score.toString();
    }

    return '-';
};

function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        // @ts-ignore
        .map((char) => 127397 + char.charCodeAt());

    return String.fromCodePoint(...codePoints);
}

export {addHoursToDate, getScoreForDisplay, joinArrayAsSentence, getFlagEmoji, dirname};
