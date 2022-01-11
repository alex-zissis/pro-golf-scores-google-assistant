import {LeaderboardEntryFactory} from '../../helpers/factories';
import leaderboardMock from './leaderboard.mock';
import {getLeadersFromLeaderboard} from '../golf';

describe('Get leaders from leaderboard', () => {
    test('Should get single leader if there is no tie', () => {
        const result = getLeadersFromLeaderboard([
            LeaderboardEntryFactory.create({id: 'dj', position: 1, score: -20}),
            LeaderboardEntryFactory.create({id: 'cs', position: 2, score: -19}),
            LeaderboardEntryFactory.create({id: 'tw', position: 3, score: -18}),
        ]);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('id', 'dj');
    });

    test('Should get 2 leaders if there is a 2 way tie', () => {
        const result = getLeadersFromLeaderboard([
            LeaderboardEntryFactory.create({id: 'dj', position: 1, score: -20}),
            LeaderboardEntryFactory.create({id: 'cs', position: 1, score: -20}),
            LeaderboardEntryFactory.create({id: 'tw', position: 3, score: -18}),
        ]);
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('id', 'dj');
        expect(result[1]).toHaveProperty('id', 'cs');
    });

    test('Should get 3 leaders if there is a 3 way tie', () => {
        const result = getLeadersFromLeaderboard([
            LeaderboardEntryFactory.create({id: 'dj', position: 1, score: -20}),
            LeaderboardEntryFactory.create({id: 'cs', position: 1, score: -20}),
            LeaderboardEntryFactory.create({id: 'tw', position: 1, score: -20}),
        ]);
        expect(result).toHaveLength(3);
        expect(result[0]).toHaveProperty('id', 'dj');
        expect(result[1]).toHaveProperty('id', 'cs');
        expect(result[2]).toHaveProperty('id', 'tw');
    });

    test('it should work with real data', () => {
        const result = getLeadersFromLeaderboard(leaderboardMock);
        expect(result).toHaveLength(1);
        const [leader] = result;
        expect(leader).toHaveProperty('id', 'a7041051-eb25-40b9-acb3-dab88cae69c0');
        expect(leader).toHaveProperty('country', 'UNITED STATES');
        expect(leader).toHaveProperty('position', 1);
        expect(leader).toHaveProperty('tied', false);
        expect(leader).toHaveProperty('score', -20);
        expect(leader).toHaveProperty('abbr_name', 'D.Johnson');
        expect(leader).toHaveProperty('rounds');
        const {rounds} = leader;
        expect(rounds).toHaveLength(4);
        expect(rounds[0]).toHaveProperty('score', -7);
        expect(rounds[0]).toHaveProperty('birdies', 5);
        expect(rounds[3]).toHaveProperty('score', -4);
        expect(rounds[0]).toHaveProperty('thru', 18);
    })
});
