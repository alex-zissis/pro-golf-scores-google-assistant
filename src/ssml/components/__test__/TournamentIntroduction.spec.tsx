/** @jsx ssml **/
import ssml from 'ssml-tsx';
import {TournamentFactory, VenueFactory} from '../../../helpers/factories';
import {TournamentIntroduction} from '../TournamentIntroduction';
const {renderToString} = ssml;

describe('Get readable tournament introduction', () => {
    test('it should get the introduction for a completed event', () => {
        expect(
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
        ).toEqual(`<p>The a finished on <say-as interpret-as="date" format="y-m-d">2021-06-01</say-as>.</p>`);

        expect(
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
        ).toEqual(
            `<p>The a finished on <say-as interpret-as="date" format="y-m-d">2021-06-01</say-as> and was played at Quail Hollow Club.</p>`
        );
    });

    test('it should get the introduction for an in-progress event', () => {
        expect(
            renderToString(
                <TournamentIntroduction
                    tournament={TournamentFactory.create({
                        name: 'a',
                        status: 'inprogress',
                        venue: null,
                    })}
                />
            )
        ).toEqual(`<p>The a is currently underway.</p>`);

        expect(
            renderToString(
                <TournamentIntroduction
                    tournament={TournamentFactory.create({
                        name: 'a',
                        status: 'inprogress',
                        venue: VenueFactory.create({name: 'Quail Hollow Club'}),
                    })}
                />
            )
        ).toEqual(`<p>The a is currently underway at Quail Hollow Club.</p>`);
    });

    test('it should get the introduction for an upcoming event', () => {
        expect(
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
        ).toEqual(
            `<p>The a is an upcoming event scheduled to begin <say-as interpret-as="date" format="y-m-d">2021-06-01</say-as>.</p>`
        );

        expect(
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
        ).toEqual(
            `<p>The a is an upcoming event scheduled to begin <say-as interpret-as="date" format="y-m-d">2021-06-01</say-as> at Quail Hollow Club.</p>`
        );
    });
});
