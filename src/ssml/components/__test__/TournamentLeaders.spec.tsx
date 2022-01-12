/** @jsx ssml **/
import ssml from 'ssml-tsx';
import {GolfScore} from '../GolfScore';
import {TournamentLeaders} from '../TournamentLeaders';
import leaderboardMock from '../../../logic/__tests__/leaderboard.mock';
const {renderToString} = ssml;

describe('Get readable string from leaders', () => {
    test('Should get the single leader given a simple input', async () => {
        await expect(
            renderToString(
                <TournamentLeaders
                    leaders={[{first_name: 'Cameron', last_name: 'Smith', score: -34}]}
                    currentRound={4}
                    roundStatus="closed"
                    isTournamentComplete={false}
                />
            )
        ).toBeValidSSMLAndEqual(
            `<p>The leader is currently Cameron Smith at ${renderToString(
                <GolfScore score={-34} />
            )}, after the 4th round.</p>`,
            true
        );

        await expect(
            renderToString(
                <TournamentLeaders
                    leaders={[{first_name: 'Cameron', last_name: 'Smith', score: -34}]}
                    currentRound={4}
                    roundStatus="closed"
                    isTournamentComplete={true}
                />
            )
        ).toBeValidSSMLAndEqual(
            `<p>The winner was Cameron Smith at ${renderToString(<GolfScore score={-34} />)}, after the 4th round.</p>`,
            true
        );
    });

    test('Should get joint leaders given a simple input', async () => {
        await expect(
            renderToString(
                <TournamentLeaders
                    leaders={[
                        {first_name: 'Cameron', last_name: 'Smith', score: -34},
                        {first_name: 'John', last_name: 'Rahm', score: -34},
                    ]}
                    currentRound={2}
                    roundStatus="inprogress"
                    isTournamentComplete={false}
                />
            )
        ).toBeValidSSMLAndEqual(
            `<p>Cameron Smith and John Rahm are the joint leaders at ${renderToString(
                <GolfScore score={-34} />
            )}, during the 2nd round.</p>`,
            true
        );

        await expect(
            renderToString(
                <TournamentLeaders
                    leaders={[
                        {first_name: 'Cameron', last_name: 'Smith', score: -34},
                        {first_name: 'John', last_name: 'Rahm', score: -34},
                    ]}
                    currentRound={4}
                    roundStatus="closed"
                    isTournamentComplete={true}
                />
            )
        ).toBeValidSSMLAndEqual(
            `<p>Cameron Smith and John Rahm were the joint winners at ${renderToString(
                <GolfScore score={-34} />
            )}, after the 4th round.</p>`,
            true
        );
    });

    test('Should get joint leaders given a complex input', async () => {
        await expect(
            renderToString(
                <TournamentLeaders
                    leaders={leaderboardMock.slice(0, 2)}
                    currentRound={4}
                    roundStatus="closed"
                    isTournamentComplete={true}
                />
            )
        ).toBeValidSSMLAndEqual(
            `<p>Dustin Johnson and Cameron Smith were the joint winners at ${renderToString(
                <GolfScore score={-20} />
            )}, after the 4th round.</p>`,
            true
        );

        await expect(
            renderToString(
                <TournamentLeaders
                    leaders={leaderboardMock.slice(0, 2)}
                    currentRound={3}
                    roundStatus="inprogress"
                    isTournamentComplete={false}
                />
            )
        ).toBeValidSSMLAndEqual(
            `<p>Dustin Johnson and Cameron Smith are the joint leaders at ${renderToString(
                <GolfScore score={-20} />
            )}, during the 3rd round.</p>`,
            true
        );
    });
});
