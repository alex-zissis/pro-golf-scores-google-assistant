/** @jsx ssml **/
import ssml from 'ssml-tsx';
import {GolfScore} from '../GolfScore';
import {TournamentLeaders} from '../TournamentLeaders';
import leaderboardMock from '../../../logic/__tests__/leaderboard.mock';
import {LeaderboardEntryFactory, PlayerLiteFactory} from '../../../helpers/factories';
import {TournamentStatus} from '../../../types/enums';
const {renderToString} = ssml;

describe('Get readable string from leaders', () => {
    test('Should get the single leader given a simple input', async () => {
        await expect(
            renderToString(
                <TournamentLeaders
                    leaders={[
                        LeaderboardEntryFactory.create({
                            score: -34,
                            player: PlayerLiteFactory.create({firstName: 'Cameron', lastName: 'Smith'}),
                        }),
                    ]}
                    currentRound={4}
                    roundStatus={TournamentStatus.Completed}
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
                    leaders={[
                        LeaderboardEntryFactory.create({
                            score: -34,
                            player: PlayerLiteFactory.create({firstName: 'Cameron', lastName: 'Smith'}),
                        }),
                    ]}
                    currentRound={4}
                    roundStatus={TournamentStatus.Completed}
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
                        LeaderboardEntryFactory.create({
                            score: -34,
                            player: PlayerLiteFactory.create({firstName: 'Cameron', lastName: 'Smith'}),
                        }),
                        LeaderboardEntryFactory.create({
                            score: -34,
                            player: PlayerLiteFactory.create({firstName: 'John', lastName: 'Rahm'}),
                        }),
                    ]}
                    currentRound={2}
                    roundStatus={TournamentStatus.InProgress}
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
                        LeaderboardEntryFactory.create({
                            score: -34,
                            player: PlayerLiteFactory.create({firstName: 'Cameron', lastName: 'Smith'}),
                        }),
                        LeaderboardEntryFactory.create({
                            score: -34,
                            player: PlayerLiteFactory.create({firstName: 'John', lastName: 'Rahm'}),
                        }),
                    ]}
                    currentRound={4}
                    roundStatus={TournamentStatus.Completed}
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
                    roundStatus={TournamentStatus.Completed}
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
                    roundStatus={TournamentStatus.InProgress}
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
