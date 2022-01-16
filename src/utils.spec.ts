import {RoundFactory} from './helpers/factories.js';
import {
    addHoursToDate,
    getFlagEmoji,
    getRoundScoreForDisplay,
    getScoreForDisplay,
    joinArrayAsSentence,
} from './utils.js';

describe('Get round score for display', () => {
    test('It should display a score under par given a negative integer.', () => {
        expect(getRoundScoreForDisplay(RoundFactory.create({score: -12, thru: 2}))).toEqual('-12');
        expect(getRoundScoreForDisplay(RoundFactory.create({score: -6, thru: 0}))).toEqual('-6');
    });

    test('It should display "-" if a player has not yet started a round that is in progress', () => {
        expect(getRoundScoreForDisplay(RoundFactory.create({thru: 0, score: 0}))).toEqual('-');
    });

    test('It should display "E" if a player is even par', () => {
        expect(getRoundScoreForDisplay(RoundFactory.create({score: 0, thru: 18}))).toBe('E');
    });

    test('It should display a score over par given a positive integer', () => {
        expect(getRoundScoreForDisplay(RoundFactory.create({thru: 18, score: 4}))).toBe('+4');
    });
});

describe('Get score for display', () => {
    test('It should display a score under par given a negative integer.', () => {
        expect(getScoreForDisplay(-12)).toEqual('-12');
        expect(getScoreForDisplay(-6)).toEqual('-6');
    });

    test('It should display "E" if a player is even par', () => {
        expect(getScoreForDisplay(0)).toBe('E');
    });

    test('It should display a score over par given a positive integer', () => {
        expect(getScoreForDisplay(4)).toBe('+4');
    });
});

describe('Join array as sentence', () => {
    test('it should return an empty string for 0 elements', () => {
        expect(joinArrayAsSentence([])).toEqual('');
    });

    test('it should return the first element, for 1 elements', () => {
        expect(joinArrayAsSentence(['John Rahm'])).toEqual('John Rahm');
    });

    test('It should join the 2 elements with "and"', () => {
        expect(joinArrayAsSentence(['Cameron Smith', 'Marc Leishman'])).toEqual('Cameron Smith and Marc Leishman');
    });

    test('It should return the first n-1 elements comma seperated, and the final element joined with an "and" for 3+ elements.', () => {
        expect(joinArrayAsSentence(['Cameron Smith', 'Marc Leishman', 'Tiger Woods'])).toEqual(
            'Cameron Smith, Marc Leishman and Tiger Woods'
        );

        expect(joinArrayAsSentence(['Cameron Smith', 'Marc Leishman', 'Tiger Woods', 'Charlie Woods'])).toEqual(
            'Cameron Smith, Marc Leishman, Tiger Woods and Charlie Woods'
        );
    });
});

describe('Get flag emoji', () => {
    test('it should correctly display some simple flag emojis', () => {
        expect(getFlagEmoji('AU')).toEqual('🇦🇺');
        expect(getFlagEmoji('US')).toEqual('🇺🇸');
        expect(getFlagEmoji('GB')).toEqual('🇬🇧');
        expect(getFlagEmoji('ZA')).toEqual('🇿🇦');
        expect(getFlagEmoji('KR')).toEqual('🇰🇷');
        expect(getFlagEmoji('jp')).toEqual('🇯🇵');
        expect(getFlagEmoji('ch')).toEqual('🇨🇭');
    });
});

describe('Add hours to date', () => {
    test('it should correctly add 1 hour to a date', () => {
        expect(addHoursToDate(new Date(2000, 1, 1, 1), 1)).toEqual(new Date(2000, 1, 1, 2));
    });

    test('it should correctly change days when added past midnight', () => {
        expect(addHoursToDate(new Date(2000, 1, 1, 23), 2)).toEqual(new Date(2000, 1, 2, 1));
    });

    test('it should correctly change add a large amount of hours', () => {
        expect(addHoursToDate(new Date(2000, 1, 1, 1), 50)).toEqual(new Date(2000, 1, 3, 3));
    });

    test('it should correctly change add negative hours', () => {
        expect(addHoursToDate(new Date(2000, 1, 1, 23), -2)).toEqual(new Date(2000, 1, 1, 21));
    });
});

//
