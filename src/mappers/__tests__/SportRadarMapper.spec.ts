import {SportRadarMapper} from '../SportRadarMapper.js';
import mastersMock from '../../mocks/leaderboard/1dd9d68d-dcdf-4238-a82b-ed2077ea799d.js';
import sentryMock from '../../mocks/leaderboard/_old-ce99ab88-aaf8-449c-95ae-78e8ea31ed58.js';
import scheduleMock from '../../mocks/schedule/pga/2022.js';
import {EventType, LeaderboardEntryStatus, TournamentStatus} from '../../types/enums.js';
import {CourseFactory, ProviderFactory, VenueFactory} from '../../helpers/factories.js';

describe('SportRadar mapper', () => {
    it('should correctly generate a provider object', () => {
        expect(SportRadarMapper._getProvider('test')).toHaveProperty('baseId', 'test');
    });

    it('should correctly map a completed tournament response', () => {
        const res = SportRadarMapper.TournamentResponse(mastersMock);
        expect(res.name).toEqual('Masters Tournament');
        expect(res.provider.provider).toEqual('sportradar');
        expect(res.provider.baseId).toEqual('1dd9d68d-dcdf-4238-a82b-ed2077ea799d');
        expect(res.startDate).toEqual(new Date('2020-11-12'));
        expect(res.endDate).toEqual(new Date('2020-11-15'));
        expect(res.status).toEqual(TournamentStatus.Completed);
        expect(res.leaderboard).toHaveLength(92);
        expect(
            res.leaderboard.filter(
                (entry) =>
                    entry.status !== LeaderboardEntryStatus.Cut && entry.status !== LeaderboardEntryStatus.Withdrawn
            )
        ).toHaveLength(60);
        expect(res.seasons).toEqual([
            {
                provider: {provider: 'sportradar', golfScoreId: '', baseId: '2d6bebeb-a384-463c-9baf-c2064340acfd'},
                year: 2021,
                tour: {
                    provider: {provider: 'sportradar', golfScoreId: '', baseId: 'b52068af-28e4-4e91-bdbb-037591b0ff84'},
                    alias: 'pga',
                    name: 'PGA Tour',
                },
            },
            {
                provider: {provider: 'sportradar', golfScoreId: '', baseId: 'cbb38117-523a-4f9c-99aa-332195ed180d'},
                year: 2020,
                tour: {
                    provider: {provider: 'sportradar', golfScoreId: '', baseId: 'e97bb87a-6347-40d0-8c8c-3d0f54a41043'},
                    alias: 'EURO',
                    name: 'European Tour',
                },
            },
        ]);

        const [leader] = res.leaderboard;
        expect(leader.player.firstName).toEqual('Dustin');
        expect(leader.player.lastName).toEqual('Johnson');
        expect(leader.position).toEqual(1);
        expect(leader.status).toEqual(LeaderboardEntryStatus.Unknown);
        expect(leader.score).toEqual(-20);
        expect(leader.rounds).toHaveLength(4);
        expect(leader.rounds.map(({roundNumber}) => roundNumber)).toEqual([1, 2, 3, 4]);
        let [round] = leader.rounds;
        expect(round.thru).toEqual(18);
        expect(round.scoring).toEqual({
            birdies: 5,
            pars: 12,
            bogeys: 0,
            doubleBogeys: 0,
            holesInOne: 0,
            eagles: 1,
            other: 0,
        });

        const lastCut = res.leaderboard[res.leaderboard.length - 3];
        expect(lastCut.player.firstName).toEqual('Andrew');
        expect(lastCut.player.lastName).toEqual('Landry');
        expect(lastCut.position).toEqual(89);
        expect(lastCut.tied).toEqual(true);
        expect(lastCut.status).toEqual(LeaderboardEntryStatus.Cut);
        expect(lastCut.score).toEqual(16);
        expect(lastCut.rounds).toHaveLength(2);
        expect(lastCut.rounds.map(({roundNumber}) => roundNumber)).toEqual([1, 2]);
        [round] = lastCut.rounds;
        expect(round.thru).toEqual(18);
        expect(round.scoring).toEqual({
            eagles: 0,
            birdies: 2,
            pars: 9,
            bogeys: 6,
            doubleBogeys: 1,
            other: 0,
            holesInOne: 0,
        });

        const last = res.leaderboard[res.leaderboard.length - 1];
        expect(last.player.firstName).toEqual('Vijay');
        expect(last.player.lastName).toEqual('Singh');
        expect(last.position).toEqual(92);
        expect(last.status).toEqual(LeaderboardEntryStatus.Withdrawn);
        expect(last.score).toEqual(8);
        expect(last.rounds).toHaveLength(2);
        expect(last.rounds.map(({roundNumber}) => roundNumber)).toEqual([1, 2]);
        [round] = last.rounds;
        expect(round.thru).toEqual(18);
        expect(round.scoring).toEqual({
            eagles: 0,
            birdies: 3,
            pars: 9,
            bogeys: 6,
            doubleBogeys: 0,
            other: 0,
            holesInOne: 0,
        });
    });

    it('should correctly map an inprogreess tournament response', () => {
        const res = SportRadarMapper.TournamentResponse(sentryMock);
        expect(res.name).toEqual('Sentry Tournament of Champions');
        expect(res.provider.provider).toEqual('sportradar');
        expect(res.provider.baseId).toEqual('ce99ab88-aaf8-449c-95ae-78e8ea31ed58');
        expect(res.eventType).toEqual(EventType.Stroke);
        expect(res.startDate).toEqual(new Date('2022-01-06'));
        expect(res.endDate).toEqual(new Date('2022-01-09'));
        expect(res.status).toEqual(TournamentStatus.InProgress);
        expect(res.leaderboard).toHaveLength(38);
        expect(
            res.leaderboard.filter(
                (entry) =>
                    entry.status !== LeaderboardEntryStatus.Cut && entry.status !== LeaderboardEntryStatus.Withdrawn
            )
        ).toHaveLength(38);
        expect(res.seasons).toEqual([
            {
                provider: {provider: 'sportradar', golfScoreId: '', baseId: '133720bb-8653-4d8e-9f49-b9f4fe41a161'},
                year: 2022,
                tour: {
                    provider: {provider: 'sportradar', golfScoreId: '', baseId: 'b52068af-28e4-4e91-bdbb-037591b0ff84'},
                    alias: 'pga',
                    name: 'PGA Tour',
                },
            },
        ]);

        const [, tiedLeader] = res.leaderboard;
        expect(tiedLeader.player.firstName).toEqual('Cameron');
        expect(tiedLeader.player.lastName).toEqual('Smith');
        expect(tiedLeader.position).toEqual(1);
        expect(tiedLeader.tied).toEqual(true);
        expect(tiedLeader.status).toEqual(LeaderboardEntryStatus.Unknown);
        expect(tiedLeader.score).toEqual(-26);
        expect(tiedLeader.rounds).toHaveLength(4);
        expect(tiedLeader.rounds.map(({roundNumber}) => roundNumber)).toEqual([1, 2, 3, 4]);
        const [round, , , finalRound] = tiedLeader.rounds;
        expect(finalRound.thru).toEqual(0);
        expect(finalRound.scoring).toEqual({
            birdies: 0,
            pars: 0,
            bogeys: 0,
            doubleBogeys: 0,
            holesInOne: 0,
            eagles: 0,
            other: 0,
        });
        expect(round.thru).toEqual(18);
        expect(round.scoring).toEqual({
            birdies: 5,
            pars: 10,
            bogeys: 1,
            doubleBogeys: 0,
            holesInOne: 0,
            eagles: 2,
            other: 0,
        });
    });

    it('should correctly map a schedule response', () => {
        const res = SportRadarMapper.ScheduleResponse(scheduleMock);

        // get provider
        expect(res.provider).toEqual({provider: 'sportradar', golfScoreId: ''});

        // get season
        expect(res.season).toEqual({
            year: 2022,
            provider: {provider: 'sportradar', golfScoreId: '', baseId: '133720bb-8653-4d8e-9f49-b9f4fe41a161'},
        });

        // get tour
        expect(res.tour).toEqual({
            alias: 'pga',
            name: 'PGA Tour',
            provider: {provider: 'sportradar', golfScoreId: '', baseId: 'b52068af-28e4-4e91-bdbb-037591b0ff84'},
        });

        expect(res.tournaments).toHaveLength(51);
        // get cancelled tournament
        const cancelledTournament = res.tournaments[6];
        expect(cancelledTournament.name).toEqual('World Golf Championships-HSBC Champions');
        expect(cancelledTournament.totalRounds).toEqual(4);
        expect(cancelledTournament.status).toEqual(TournamentStatus.Cancelled);
        expect(cancelledTournament.points).toEqual(550);
        expect(cancelledTournament.eventType).toEqual(EventType.Stroke);
        expect(cancelledTournament.defendingChamp).toEqual({
            provider: {provider: 'sportradar', baseId: 'da226913-b804-48de-adbf-96e956eb75ac', golfScoreId: ''},
            firstName: 'Rory',
            lastName: 'McIlroy',
            height: 178,
            weight: 73,
            dateOfBirth: new Date('1989-05-04'),
            country: 'Northern Ireland',
            yearTurnedPro: 2007,
            displayName: 'R. McIlroy',
        });

        // get in progress tournament
        const inProgressTournament = res.tournaments[13];
        expect(inProgressTournament.name).toEqual('Sentry Tournament of Champions');
        expect(inProgressTournament.status).toEqual(TournamentStatus.InProgress);

        const {courses, ...venueWithoutCourses} = inProgressTournament.venue;
        expect(venueWithoutCourses).toEqual(
            VenueFactory.create({
                provider: ProviderFactory.create({
                    provider: 'sportradar',
                    baseId: '4e353af5-a1dd-4118-963d-24ef08393155',
                }),
                name: 'Kapalua Resort',
                city: 'Kapalua',
                state: 'HI',
                zipCode: '96761',
                country: 'USA',
                courses: undefined,
            })
        );

        const [{holes, ...courseWithoutHoles}] = courses;
        expect(courseWithoutHoles).toEqual(
            CourseFactory.create({
                provider: ProviderFactory.create({
                    baseId: 'f14b3a94-b487-448d-bb1c-a4a77aa4523d',
                    provider: 'sportradar',
                }),
                name: 'The Plantation Course at Kapalua Resort',
                length: 6946,
                par: 73,
                holes: undefined,
            })
        );

        expect(holes[0]).toEqual({number: 1, par: 4, length: 475});
        expect(holes[17]).toEqual({number: 18, par: 5, length: 619});

        // get upcoming tournmanet
        const tourChamp = res.tournaments[res.tournaments.length - 1];
        expect(tourChamp.name).toEqual('TOUR Championship');
        expect(tourChamp.status).toEqual(TournamentStatus.Upcoming);
        expect(tourChamp.provider).toEqual(
            ProviderFactory.create({baseId: '62338479-12c5-4ef4-a473-6fea873f3e66', provider: 'sportradar'})
        );
    });
});
