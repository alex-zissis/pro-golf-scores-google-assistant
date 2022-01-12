/** @jsx ssml **/
import ssml from 'ssml-tsx';
import {TournamentFactory, VenueFactory} from '../../../helpers/factories';
import {TournamentIntroduction} from '../TournamentIntroduction';
const {renderToString} = ssml;

describe('Get readable tournament introduction', () => {
    test('it should get the introduction for a completed event', async () => {
        await expect(
            renderToString(
                <TournamentIntroduction
                    tournament={TournamentFactory.create({
                        name: 'a',
                        end_date: '2021-06-01',
                        status: 'closed',
                        venue: null,
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
                    tournament={TournamentFactory.create({
                        name: 'a',
                        end_date: '2021-06-01',
                        status: 'closed',
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
                    tournament={TournamentFactory.create({
                        name: 'a',
                        status: 'inprogress',
                        venue: null,
                    })}
                />
            )
        ).toBeValidSSMLAndEqual(`<p>The a is currently underway.</p>`, true);

        await expect(
            renderToString(
                <TournamentIntroduction
                    tournament={TournamentFactory.create({
                        name: 'a',
                        status: 'inprogress',
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
                    tournament={TournamentFactory.create({
                        name: 'a',
                        start_date: '2021-06-01',
                        status: 'scheduled',
                        venue: null,
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
                    tournament={TournamentFactory.create({
                        name: 'a',
                        start_date: '2021-06-01',
                        status: 'scheduled',
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
