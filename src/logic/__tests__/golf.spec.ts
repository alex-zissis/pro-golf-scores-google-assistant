import {
    LeaderboardEntryFactory,
    TournamentResponseFactory,
    PlayerLiteFactory,
    RoundFactory,
    TournamentDetailedFactory,
    ProviderFactory,
} from '../../helpers/factories.js';
import leaderboardMock from './leaderboard.mock.js';
import {
    getLeadersFromLeaderboard,
    isTournamentComplete,
    getCurrentRound,
    getHighestRoundPlayerHasStarted,
} from '../golf.js';
import {TournamentStatus} from '../../types/enums.js';

describe('Get leaders from leaderboard', () => {
    test('Should get single leader if there is no tie', () => {
        const result = getLeadersFromLeaderboard([
            LeaderboardEntryFactory.create({
                player: PlayerLiteFactory.create({provider: ProviderFactory.create({golfScoreId: 'dj'})}),
                position: 1,
                score: -20,
            }),
            LeaderboardEntryFactory.create({
                player: PlayerLiteFactory.create({provider: ProviderFactory.create({golfScoreId: 'cs'})}),
                position: 2,
                score: -19,
            }),
            LeaderboardEntryFactory.create({
                player: PlayerLiteFactory.create({provider: ProviderFactory.create({golfScoreId: 'tw'})}),
                position: 3,
                score: -18,
            }),
        ]);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('player.provider.golfScoreId', 'dj');
    });

    test('Should get 2 leaders if there is a 2 way tie', () => {
        const result = getLeadersFromLeaderboard([
            LeaderboardEntryFactory.create({
                player: PlayerLiteFactory.create({provider: ProviderFactory.create({golfScoreId: 'dj'})}),
                position: 1,
                score: -20,
            }),
            LeaderboardEntryFactory.create({
                player: PlayerLiteFactory.create({provider: ProviderFactory.create({golfScoreId: 'cs'})}),
                position: 1,
                score: -20,
            }),
            LeaderboardEntryFactory.create({
                player: PlayerLiteFactory.create({provider: ProviderFactory.create({golfScoreId: 'tw'})}),
                position: 3,
                score: -18,
            }),
        ]);
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('player.provider.golfScoreId', 'dj');
        expect(result[1]).toHaveProperty('player.provider.golfScoreId', 'cs');
    });

    test('Should get 3 leaders if there is a 3 way tie', () => {
        const result = getLeadersFromLeaderboard([
            LeaderboardEntryFactory.create({
                player: PlayerLiteFactory.create({provider: ProviderFactory.create({golfScoreId: 'dj'})}),
                position: 1,
                score: -20,
            }),
            LeaderboardEntryFactory.create({
                player: PlayerLiteFactory.create({provider: ProviderFactory.create({golfScoreId: 'cs'})}),
                position: 1,
                score: -20,
            }),
            LeaderboardEntryFactory.create({
                player: PlayerLiteFactory.create({provider: ProviderFactory.create({golfScoreId: 'tw'})}),
                position: 1,
                score: -20,
            }),
        ]);
        expect(result).toHaveLength(3);
        expect(result[0]).toHaveProperty('player.provider.golfScoreId', 'dj');
        expect(result[1]).toHaveProperty('player.provider.golfScoreId', 'cs');
        expect(result[2]).toHaveProperty('player.provider.golfScoreId', 'tw');
    });

    test('it should work with real data', () => {
        const result = getLeadersFromLeaderboard(leaderboardMock);
        expect(result).toHaveLength(1);
        const [leader] = result;
        expect(leader).toHaveProperty('player.provider.baseId', 'a7041051-eb25-40b9-acb3-dab88cae69c0');
        expect(leader).toHaveProperty('player.country', 'UNITED STATES');
        expect(leader).toHaveProperty('position', 1);
        expect(leader).toHaveProperty('tied', false);
        expect(leader).toHaveProperty('score', -20);
        expect(leader).toHaveProperty('player.displayName', 'D.Johnson');
        expect(leader).toHaveProperty('rounds');
        const {rounds} = leader;
        expect(rounds).toHaveLength(4);
        expect(rounds[0]).toHaveProperty('score', -7);
        expect(rounds[0]).toHaveProperty('scoring.birdies', 5);
        expect(rounds[3]).toHaveProperty('score', -4);
        expect(rounds[0]).toHaveProperty('thru', 18);
    });
});

const threeRoundsFinished = [
    RoundFactory.create({thru: 18, roundNumber: 1}),
    RoundFactory.create({thru: 18, roundNumber: 2}),
    RoundFactory.create({thru: 18, roundNumber: 3}),
    RoundFactory.create({thru: 0, roundNumber: 4}),
];
const fourRoundsFinished = [...threeRoundsFinished.slice(0, 3), RoundFactory.create({thru: 18, roundNumber: 4})];

describe('Is tournament complete', () => {
    it('should always be complete, if the status is "closed"', () => {
        expect(isTournamentComplete(TournamentDetailedFactory.create({status: TournamentStatus.Completed}))).toEqual(
            true
        );
        expect(isTournamentComplete(TournamentResponseFactory.create({status: TournamentStatus.Completed}))).toEqual(
            true
        );
    });

    it('should always be incomplete, if the status is "scheduled"', () => {
        expect(isTournamentComplete(TournamentDetailedFactory.create({status: TournamentStatus.Upcoming}))).toEqual(
            false
        );
        expect(isTournamentComplete(TournamentResponseFactory.create({status: TournamentStatus.Upcoming}))).toEqual(
            false
        );
    });

    it('should be incomplete if in progress AND all players are not thru 18 holes on the final round', () => {
        expect(
            isTournamentComplete(
                TournamentResponseFactory.create({
                    status: TournamentStatus.InProgress,
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
                TournamentResponseFactory.create({
                    status: TournamentStatus.InProgress,
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
                TournamentResponseFactory.create({
                    status: TournamentStatus.InProgress,
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
                LeaderboardEntryFactory.create({rounds: [RoundFactory.create({thru: 0, roundNumber: 1})]})
            )
        ).toEqual(1);

        expect(
            getHighestRoundPlayerHasStarted(
                LeaderboardEntryFactory.create({rounds: [RoundFactory.create({thru: 12, roundNumber: 1})]})
            )
        ).toEqual(1);

        expect(
            getHighestRoundPlayerHasStarted(
                LeaderboardEntryFactory.create({rounds: [RoundFactory.create({thru: 18, roundNumber: 1})]})
            )
        ).toEqual(1);

        expect(
            getHighestRoundPlayerHasStarted(
                LeaderboardEntryFactory.create({
                    rounds: [
                        RoundFactory.create({thru: 18, roundNumber: 1}),
                        RoundFactory.create({thru: 4, roundNumber: 2}),
                    ],
                })
            )
        ).toEqual(2);

        expect(
            getHighestRoundPlayerHasStarted(
                LeaderboardEntryFactory.create({
                    rounds: [
                        RoundFactory.create({thru: 18, roundNumber: 1}),
                        RoundFactory.create({thru: 18, roundNumber: 2}),
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
                        RoundFactory.create({thru: 18, roundNumber: 1}),
                        RoundFactory.create({thru: 18, roundNumber: 2}),
                    ],
                }),
                LeaderboardEntryFactory.create({
                    rounds: [
                        RoundFactory.create({thru: 18, roundNumber: 1}),
                        RoundFactory.create({thru: 18, roundNumber: 2}),
                    ],
                }),
            ])
        ).toEqual({currentRound: 2, status: TournamentStatus.Completed});
    });

    it('should correctly get the current round if one player has started a round and others have not', () => {
        expect(
            getCurrentRound([
                LeaderboardEntryFactory.create({
                    rounds: [
                        RoundFactory.create({thru: 18, roundNumber: 1}),
                        RoundFactory.create({thru: 6, roundNumber: 2}),
                    ],
                }),
                LeaderboardEntryFactory.create({rounds: [RoundFactory.create({thru: 18, roundNumber: 1})]}),
            ])
        ).toEqual({currentRound: 2, status: TournamentStatus.InProgress});
    });

    it('should correctly get the current round as 1 if the tournament has not started', () => {
        expect(getCurrentRound([LeaderboardEntryFactory.create(), LeaderboardEntryFactory.create()])).toEqual({
            currentRound: 1,
            status: TournamentStatus.Completed,
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
            status: TournamentStatus.Completed,
        });
    });
});
