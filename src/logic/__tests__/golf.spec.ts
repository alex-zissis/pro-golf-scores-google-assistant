import {
    LeaderboardEntryFactory,
    LeaderboardResponseFactory,
    RoundFactory,
    TournamentFactory,
} from '../../helpers/factories';
import leaderboardMock from './leaderboard.mock';
import {
    getLeadersFromLeaderboard,
    isTournamentComplete,
    getCurrentRound,
    getHighestRoundPlayerHasStarted,
} from '../golf';

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
    });
});

const threeRoundsFinished = [
    RoundFactory.create({thru: 18, sequence: 1}),
    RoundFactory.create({thru: 18, sequence: 2}),
    RoundFactory.create({thru: 18, sequence: 3}),
    RoundFactory.create({thru: 0, sequence: 4}),
];
const fourRoundsFinished = [...threeRoundsFinished.slice(0, 3), RoundFactory.create({thru: 18, sequence: 4})];

describe('Is tournament complete', () => {
    it('should always be complete, if the status is "closed"', () => {
        expect(isTournamentComplete(TournamentFactory.create({status: 'closed'}))).toEqual(true);
        expect(isTournamentComplete(LeaderboardResponseFactory.create({status: 'closed'}))).toEqual(true);
    });

    it('should always be incomplete, if the status is "scheduled"', () => {
        expect(isTournamentComplete(TournamentFactory.create({status: 'scheduled'}))).toEqual(false);
        expect(isTournamentComplete(LeaderboardResponseFactory.create({status: 'scheduled'}))).toEqual(false);
    });

    it('should be incomplete if in progress AND all players are not thru 18 holes on the final round', () => {
        expect(
            isTournamentComplete(
                LeaderboardResponseFactory.create({
                    status: 'inprogress',
                    leaderboard: [
                        LeaderboardEntryFactory.create({
                            rounds: threeRoundsFinished,
                        }),
                        LeaderboardEntryFactory.create({
                            rounds: threeRoundsFinished,
                        }),
                    ],
                })
            )
        ).toEqual(false);

        expect(
            isTournamentComplete(
                LeaderboardResponseFactory.create({
                    status: 'inprogress',
                    leaderboard: [
                        LeaderboardEntryFactory.create({
                            rounds: threeRoundsFinished,
                        }),
                        LeaderboardEntryFactory.create({
                            rounds: fourRoundsFinished,
                        }),
                    ],
                })
            )
        ).toEqual(false);
    });

    test('it should be complete if status is inprogress but all players have finished their final round', () => {
        expect(
            isTournamentComplete(
                LeaderboardResponseFactory.create({
                    status: 'inprogress',
                    leaderboard: [
                        LeaderboardEntryFactory.create({
                            rounds: fourRoundsFinished,
                        }),
                        LeaderboardEntryFactory.create({
                            rounds: fourRoundsFinished,
                        }),
                    ],
                })
            )
        ).toEqual(true);
    });
});

describe('Get highest round a player has started', () => {
    test('should get the highest round from a simple input', () => {
        expect(getHighestRoundPlayerHasStarted(LeaderboardEntryFactory.create({rounds: []}))).toEqual(1);

        expect(
            getHighestRoundPlayerHasStarted(
                LeaderboardEntryFactory.create({rounds: [RoundFactory.create({thru: 0, sequence: 1})]})
            )
        ).toEqual(1);

        expect(
            getHighestRoundPlayerHasStarted(
                LeaderboardEntryFactory.create({rounds: [RoundFactory.create({thru: 12, sequence: 1})]})
            )
        ).toEqual(1);

        expect(
            getHighestRoundPlayerHasStarted(
                LeaderboardEntryFactory.create({rounds: [RoundFactory.create({thru: 18, sequence: 1})]})
            )
        ).toEqual(1);

        expect(
            getHighestRoundPlayerHasStarted(
                LeaderboardEntryFactory.create({
                    rounds: [RoundFactory.create({thru: 18, sequence: 1}), RoundFactory.create({thru: 4, sequence: 2})],
                })
            )
        ).toEqual(2);

        expect(
            getHighestRoundPlayerHasStarted(
                LeaderboardEntryFactory.create({
                    rounds: [
                        RoundFactory.create({thru: 18, sequence: 1}),
                        RoundFactory.create({thru: 18, sequence: 2}),
                    ],
                })
            )
        ).toEqual(2);
    });
});

describe('Get the current round of a tornunament', () => {
    it('should correctly get the current round given a simple input', () => {
        expect(
            getCurrentRound([
                LeaderboardEntryFactory.create({
                    rounds: [
                        RoundFactory.create({thru: 18, sequence: 1}),
                        RoundFactory.create({thru: 18, sequence: 2}),
                    ],
                }),
                LeaderboardEntryFactory.create({
                    rounds: [
                        RoundFactory.create({thru: 18, sequence: 1}),
                        RoundFactory.create({thru: 18, sequence: 2}),
                    ],
                }),
            ])
        ).toEqual({currentRound: 2, status: 'closed'});
    });

    it('should correctly get the current round if one player has started a round and others have not', () => {
        expect(
            getCurrentRound([
                LeaderboardEntryFactory.create({
                    rounds: [RoundFactory.create({thru: 18, sequence: 1}), RoundFactory.create({thru: 6, sequence: 2})],
                }),
                LeaderboardEntryFactory.create({rounds: [RoundFactory.create({thru: 18, sequence: 1})]}),
            ])
        ).toEqual({currentRound: 2, status: 'inprogress'});
    });

    it('should correctly get the current round as 1 if the tournament has not started', () => {
        expect(getCurrentRound([LeaderboardEntryFactory.create(), LeaderboardEntryFactory.create()])).toEqual({
            currentRound: 1,
            status: 'closed',
        });
    });

    it('should correctly get the final round if the tournament has finished', () => {
        expect(
            getCurrentRound([
                LeaderboardEntryFactory.create({rounds: fourRoundsFinished}),
                LeaderboardEntryFactory.create({rounds: fourRoundsFinished}),
            ])
        ).toEqual({
            currentRound: 4,
            status: 'closed',
        });
    });
});
