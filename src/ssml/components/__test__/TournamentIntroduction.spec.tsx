/** @jsx ssml **/
import ssml from 'ssml-tsx';
import {TournamentBaseFactory, TournamentDetailedFactory, VenueFactory} from '../../../helpers/factories.js';
import {TournamentStatus} from '../../../types/enums.js';
import {TournamentIntroduction} from '../TournamentIntroduction.js';
const {renderToString} = ssml;

describe('Get readable tournament introduction', () => {
    test('it should get the introduction for a completed event', async () => {
        await expect(
            renderToString(
                <TournamentIntroduction
                    tournament={TournamentBaseFactory.create({
                        name: 'a',
                        endDate: new Date(2021, 5, 1),
                        status: TournamentStatus.Completed,
                    })}
                />
            )
        ).toBeValidSSMLAndEqual(
            `<p>The a finished on <say-as interpret-as="date" format="ymd">2021-06-01</say-as>.</p>`,
            true
        );

        await expect(
            renderToString(
                <TournamentIntroduction
                    tournament={TournamentDetailedFactory.create({
                        name: 'a',
                        endDate: new Date('2021-06-01'),
                        status: TournamentStatus.Completed,
                        venue: VenueFactory.create({name: 'Quail Hollow Club'}),
                    })}
                />
            )
        ).toBeValidSSMLAndEqual(
            `<p>The a finished on <say-as interpret-as="date" format="ymd">2021-06-01</say-as> and was played at Quail Hollow Club.</p>`,
            true
        );
    });

    test('it should get the introduction for an in-progress event', async () => {
        await expect(
            renderToString(
                <TournamentIntroduction
                    tournament={TournamentBaseFactory.create({
                        name: 'a',
                        status: TournamentStatus.InProgress,
                    })}
                />
            )
        ).toBeValidSSMLAndEqual(`<p>The a is currently underway.</p>`, true);

        await expect(
            renderToString(
                <TournamentIntroduction
                    tournament={TournamentDetailedFactory.create({
                        name: 'a',
                        status: TournamentStatus.InProgress,
                        venue: VenueFactory.create({name: 'Quail Hollow Club'}),
                    })}
                />
            )
        ).toBeValidSSMLAndEqual(`<p>The a is currently underway at Quail Hollow Club.</p>`, true);
    });

    test('it should get the introduction for an upcoming event', async () => {
        await expect(
            renderToString(
                <TournamentIntroduction
                    tournament={TournamentBaseFactory.create({
                        name: 'a',
                        startDate: new Date('2021-06-01'),
                        status: TournamentStatus.Upcoming,
                    })}
                />
            )
        ).toBeValidSSMLAndEqual(
            `<p>The a is an upcoming event scheduled to begin <say-as interpret-as="date" format="ymd">2021-06-01</say-as>.</p>`,
            true
        );

        await expect(
            renderToString(
                <TournamentIntroduction
                    tournament={TournamentDetailedFactory.create({
                        name: 'a',
                        startDate: new Date('2021-06-01'),
                        status: TournamentStatus.Upcoming,
                        venue: VenueFactory.create({name: 'Quail Hollow Club'}),
                    })}
                />
            )
        ).toBeValidSSMLAndEqual(
            `<p>The a is an upcoming event scheduled to begin <say-as interpret-as="date" format="ymd">2021-06-01</say-as> at Quail Hollow Club.</p>`,
            true
        );
    });
});
