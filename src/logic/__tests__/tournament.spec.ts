import {findClosestTournament} from '../tournament';
import {TournamentDetailedFactory} from '../../helpers/factories';
import scheduleMock from '../../mocks/schedule/pga/2022.json';
import {SportRadarMapper} from '../../mappers/SportRadarMapper';

describe('Find the closest tournament from the schedule, to a given date', () => {
    test('it should correctly return the closest tournament for a simple example', () => {
        expect(
            findClosestTournament(
                [
                    TournamentDetailedFactory.create({name: 'a', startDate: new Date(Date.UTC(2022, 2, 7))}),
                    TournamentDetailedFactory.create({name: 'b', startDate: new Date(Date.UTC(2022, 3, 7))}),
                    TournamentDetailedFactory.create({name: 'c', startDate: new Date(Date.UTC(2022, 4, 7))}),
                ],
                new Date(Date.UTC(2022, 3, 10))
            )
        ).toHaveProperty('name', 'b');

        expect(
            findClosestTournament(
                [
                    TournamentDetailedFactory.create({name: 'a', startDate: new Date(Date.UTC(2022, 3, 6))}),
                    TournamentDetailedFactory.create({name: 'b', startDate: new Date(Date.UTC(2022, 3, 7))}),
                ],
                new Date(Date.UTC(2022, 3, 8))
            )
        ).toHaveProperty('name', 'b');
    });

    test('it should match a tournament where start date is the same as reference date', () => {
        expect(
            findClosestTournament(
                [
                    TournamentDetailedFactory.create({name: 'a', startDate: new Date(Date.UTC(2022, 3, 6))}),
                    TournamentDetailedFactory.create({name: 'b', startDate: new Date(Date.UTC(2022, 3, 7))}),
                    TournamentDetailedFactory.create({name: 'c', startDate: new Date(Date.UTC(2022, 3, 8))}),
                ],
                new Date(Date.UTC(2022, 3, 7))
            )
        ).toHaveProperty('name', 'b');

        expect(
            findClosestTournament(
                [
                    TournamentDetailedFactory.create({name: 'a', startDate: new Date(Date.UTC(2022, 3, 6))}),
                    TournamentDetailedFactory.create({name: 'b', startDate: new Date(Date.UTC(2022, 3, 7, 23, 59))}),
                    TournamentDetailedFactory.create({name: 'c', startDate: new Date(Date.UTC(2022, 3, 8))}),
                ],
                new Date(Date.UTC(2022, 3, 7))
            )
        ).toHaveProperty('name', 'b');
    });

    test('it should return the next one if all dates are in the future', () => {
        expect(
            findClosestTournament(
                [
                    TournamentDetailedFactory.create({name: 'a', startDate: new Date(Date.UTC(2022, 3, 6))}),
                    TournamentDetailedFactory.create({name: 'b', startDate: new Date(Date.UTC(2022, 3, 7))}),
                    TournamentDetailedFactory.create({name: 'c', startDate: new Date(Date.UTC(2022, 3, 8))}),
                ],
                new Date(Date.UTC(2021, 3, 7))
            )
        ).toHaveProperty('name', 'a');
    });

    test('it should return the last one if all dates are in the past', () => {
        expect(
            findClosestTournament(
                [
                    TournamentDetailedFactory.create({name: 'a', startDate: new Date(Date.UTC(2021, 3, 6))}),
                    TournamentDetailedFactory.create({name: 'b', startDate: new Date(Date.UTC(2021, 3, 7))}),
                    TournamentDetailedFactory.create({name: 'c', startDate: new Date(Date.UTC(2021, 3, 8))}),
                ],
                new Date(Date.UTC(2022, 3, 7))
            )
        ).toHaveProperty('name', 'c');
    });

    test('it should return correct values for a real schedule', () => {
        const tournaments = scheduleMock.tournaments.map(SportRadarMapper.tournament);
        const firstEvent = findClosestTournament(tournaments, new Date(Date.UTC(2021, 6, 1)));
        expect(firstEvent).toHaveProperty('provider.baseId', 'e45317f1-7d56-46a2-b36b-15a9ffce7812');
        expect(firstEvent).toHaveProperty('startDate', new Date(Date.UTC(2021, 8, 16)));

        const eleventhJan = findClosestTournament(tournaments, new Date(Date.UTC(2022, 0, 11)));
        expect(eleventhJan).toHaveProperty('name', 'Sentry Tournament of Champions');
        expect(eleventhJan).toHaveProperty('startDate', new Date(Date.UTC(2022, 0, 6)));

        const twelthJan = findClosestTournament(tournaments, new Date(Date.UTC(2022, 0, 12, 18)));
        expect(twelthJan).toHaveProperty('name', 'Sentry Tournament of Champions');
        expect(twelthJan).toHaveProperty('startDate', new Date(Date.UTC(2022, 0, 6)));

        const thirteenthJan = findClosestTournament(tournaments, new Date(Date.UTC(2022, 0, 13)));
        expect(thirteenthJan).toHaveProperty('name', 'Sony Open in Hawaii');
        expect(thirteenthJan).toHaveProperty('startDate', new Date(Date.UTC(2022, 0, 13)));
        expect(thirteenthJan).toHaveProperty('defendingChamp.displayName', 'K.Na');
    });
});
