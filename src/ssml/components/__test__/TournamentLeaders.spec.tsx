/** @jsx ssml **/
import ssml from 'ssml-tsx';
import {GolfScore} from '../GolfScore';
import {TournamentLeaders} from '../TournamentLeaders';
import leaderboardMock from '../../../logic/__tests__/leaderboard.mock';
const {renderToString} = ssml;

describe('Get readable string from leaders', () => {
    test('Should get the single leader given a simple input', () => {
        expect(
            renderToString(
                <TournamentLeaders
                    leaders={[{first_name: 'Cameron', last_name: 'Smith', score: -34}]}
                    roundInProgress={4}
                    anyRoundVariance={false}
                    isTournamentComplete={false}
                />
            )
        ).toEqual(
            `<p>The leader is currently Cameron Smith at ${renderToString(
                <GolfScore score={-34} />
            )}, after the 4th round.</p>`
        );

        expect(
            renderToString(
                <TournamentLeaders
                    leaders={[{first_name: 'Cameron', last_name: 'Smith', score: -34}]}
                    roundInProgress={4}
                    anyRoundVariance={false}
                    isTournamentComplete={true}
                />
            )
        ).toEqual(
            `<p>The winner was Cameron Smith at ${renderToString(<GolfScore score={-34} />)}, after the 4th round.</p>`
        );
    });

    test('Should get joint leaders given a simple input', () => {
        expect(
            renderToString(
                <TournamentLeaders
                    leaders={[
                        {first_name: 'Cameron', last_name: 'Smith', score: -34},
                        {first_name: 'John', last_name: 'Rahm', score: -34},
                    ]}
                    roundInProgress={2}
                    anyRoundVariance={true}
                    isTournamentComplete={false}
                />
            )
        ).toEqual(
            `<p>Cameron Smith and John Rahm are the joint leaders at ${renderToString(
                <GolfScore score={-34} />
            )}, during the 2nd round.</p>`
        );

        expect(
            renderToString(
                <TournamentLeaders
                    leaders={[
                        {first_name: 'Cameron', last_name: 'Smith', score: -34},
                        {first_name: 'John', last_name: 'Rahm', score: -34},
                    ]}
                    roundInProgress={4}
                    anyRoundVariance={false}
                    isTournamentComplete={true}
                />
            )
        ).toEqual(
            `<p>Cameron Smith and John Rahm were the joint winners at ${renderToString(
                <GolfScore score={-34} />
            )}, after the 4th round.</p>`
        );
    });

    test('Should get joint leaders given a complex input', () => {
        expect(
            renderToString(
                <TournamentLeaders
                    leaders={leaderboardMock.slice(0, 2)}
                    anyRoundVariance={false}
                    roundInProgress={4}
                    isTournamentComplete={true}
                />
            )
        ).toEqual(
            `<p>Dustin Johnson and Cameron Smith were the joint winners at ${renderToString(
                <GolfScore score={-20} />
            )}, after the 4th round.</p>`
        );

        expect(
            renderToString(
                <TournamentLeaders
                    leaders={leaderboardMock.slice(0, 2)}
                    anyRoundVariance={true}
                    roundInProgress={3}
                    isTournamentComplete={false}
                />
            )
        ).toEqual(
            `<p>Dustin Johnson and Cameron Smith are the joint leaders at ${renderToString(
                <GolfScore score={-20} />
            )}, during the 3rd round.</p>`
        );
    });
});
