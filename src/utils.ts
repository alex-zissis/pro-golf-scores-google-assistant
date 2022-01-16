import {fileURLToPath} from 'url';
import countries from 'i18n-iso-countries';
import {LeaderboardEntry, Round} from './types/golfscores.js';

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

const getRoundScoreForDisplay = ({thru, score}: Round): string => {
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

const resolveCountry = (country: string) => {
    country = country.toLowerCase();

    if (['england', 'scotland', 'wales', 'northern ireland'].includes(country)) {
        return 'united kingdom';
    }

    return country;
};

const getFlagEmoji = (country: string) => {
    const countryCode = countries.getAlpha2Code(resolveCountry(country), 'en');

    if (!countryCode) {
        return '🏳';
    }

    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
};

const inchesToCms = (inches: number) => Math.round(inches * 2.54);
const poundsToKgs = (pounds: number) => Math.round(pounds * 0.45359237);
const yardsToMeters = (yards: number) => Math.round(yards * 0.9144);

const toTitleCase = (str: string) =>
    str
        .split(' ')
        .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');

const isDevelopment = () => !isTest() && !isProduction();
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
    inchesToCms,
    poundsToKgs,
    toTitleCase,
    yardsToMeters,
};
