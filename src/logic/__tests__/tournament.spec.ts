import {findClosestTournament} from '../tournament';
import {TournamentWithDatesFactory} from '../../helpers/factories';
import scheduleMock from '../../mocks/schedule/pga/2022.json';
import {mapTournamentToTournamentWithDates} from '../../mappers/tournament';
import {Tournament} from '../../types/schedule';

describe('Find the closest tournament from the schedule, to a given date', () => {
    test('it should correctly return the closest tournament for a simple example', () => {
        expect(
            findClosestTournament(
                [
                    TournamentWithDatesFactory.create({name: 'a', start_date: new Date(Date.UTC(2022, 2, 7))}),
                    TournamentWithDatesFactory.create({name: 'b', start_date: new Date(Date.UTC(2022, 3, 7))}),
                    TournamentWithDatesFactory.create({name: 'c', start_date: new Date(Date.UTC(2022, 4, 7))}),
                ],
                new Date(Date.UTC(2022, 3, 10))
            )
        ).toHaveProperty('name', 'b');

        expect(
            findClosestTournament(
                [
                    TournamentWithDatesFactory.create({name: 'a', start_date: new Date(Date.UTC(2022, 3, 6))}),
                    TournamentWithDatesFactory.create({name: 'b', start_date: new Date(Date.UTC(2022, 3, 7))}),
                ],
                new Date(Date.UTC(2022, 3, 8))
            )
        ).toHaveProperty('name', 'b');
    });

    test('it should match a tournament where start date is the same as reference date', () => {
        expect(
            findClosestTournament(
                [
                    TournamentWithDatesFactory.create({name: 'a', start_date: new Date(Date.UTC(2022, 3, 6))}),
                    TournamentWithDatesFactory.create({name: 'b', start_date: new Date(Date.UTC(2022, 3, 7))}),
                    TournamentWithDatesFactory.create({name: 'c', start_date: new Date(Date.UTC(2022, 3, 8))}),
                ],
                new Date(Date.UTC(2022, 3, 7))
            )
        ).toHaveProperty('name', 'b');

        expect(
            findClosestTournament(
                [
                    TournamentWithDatesFactory.create({name: 'a', start_date: new Date(Date.UTC(2022, 3, 6))}),
                    TournamentWithDatesFactory.create({name: 'b', start_date: new Date(Date.UTC(2022, 3, 7, 23, 59))}),
                    TournamentWithDatesFactory.create({name: 'c', start_date: new Date(Date.UTC(2022, 3, 8))}),
                ],
                new Date(Date.UTC(2022, 3, 7))
            )
        ).toHaveProperty('name', 'b');
    });

    test('it should return the next one if all dates are in the future', () => {
        expect(
            findClosestTournament(
                [
                    TournamentWithDatesFactory.create({name: 'a', start_date: new Date(Date.UTC(2022, 3, 6))}),
                    TournamentWithDatesFactory.create({name: 'b', start_date: new Date(Date.UTC(2022, 3, 7))}),
                    TournamentWithDatesFactory.create({name: 'c', start_date: new Date(Date.UTC(2022, 3, 8))}),
                ],
                new Date(Date.UTC(2021, 3, 7))
            )
        ).toHaveProperty('name', 'a');
    });

    test('it should return the last one if all dates are in the past', () => {
        expect(
            findClosestTournament(
                [
                    TournamentWithDatesFactory.create({name: 'a', start_date: new Date(Date.UTC(2021, 3, 6))}),
                    TournamentWithDatesFactory.create({name: 'b', start_date: new Date(Date.UTC(2021, 3, 7))}),
                    TournamentWithDatesFactory.create({name: 'c', start_date: new Date(Date.UTC(2021, 3, 8))}),
                ],
                new Date(Date.UTC(2022, 3, 7))
            )
        ).toHaveProperty('name', 'c');
    });

    test('it should return correct values for a real schedules', () => {
        const tournaments = mapTournamentToTournamentWithDates(scheduleMock.tournaments as Tournament[]);
        const firstEvent = findClosestTournament(tournaments, new Date(Date.UTC(2021, 6, 1)));
        expect(firstEvent).toHaveProperty('id', 'e45317f1-7d56-46a2-b36b-15a9ffce7812');
        expect(firstEvent).toHaveProperty('start_date', new Date(Date.UTC(2021, 8, 16)));

        const eleventhJan = findClosestTournament(tournaments, new Date(Date.UTC(2022, 0, 11)));
        expect(eleventhJan).toHaveProperty('name', 'Sentry Tournament of Champions');
        expect(eleventhJan).toHaveProperty('start_date', new Date(Date.UTC(2022, 0, 6)));

        const twelthJan = findClosestTournament(tournaments, new Date(Date.UTC(2022, 0, 12, 18)));
        expect(twelthJan).toHaveProperty('name', 'Sentry Tournament of Champions');
        expect(twelthJan).toHaveProperty('start_date', new Date(Date.UTC(2022, 0, 6)));

        const thirteenthJan = findClosestTournament(tournaments, new Date(Date.UTC(2022, 0, 13)));
        expect(thirteenthJan).toHaveProperty('name', 'Sony Open in Hawaii');
        expect(thirteenthJan).toHaveProperty('start_date', new Date(Date.UTC(2022, 0, 13)));
        expect(thirteenthJan).toHaveProperty('defending_champ.abbr_name', 'K.Na');
    });
});
