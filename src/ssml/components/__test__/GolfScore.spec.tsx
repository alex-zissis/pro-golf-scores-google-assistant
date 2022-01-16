/** @jsx ssml */
import ssml from 'ssml-tsx';
import {GolfScore} from '../GolfScore.js';
const {renderToString} = ssml;

describe('Get voice readable string from score', () => {
    test('it should correctly return a score under par', async () => {
        await expect(renderToString(<GolfScore score={-5} />)).toBeValidSSMLAndEqual(
            '<sub alias="five under">-5</sub>',
            true
        );
        await expect(renderToString(<GolfScore score={-26} />)).toBeValidSSMLAndEqual(
            '<sub alias="twenty six under">-26</sub>',
            true
        );
    });

    test('it should correctly return a score over par', async () => {
        await expect(renderToString(<GolfScore score={5} />)).toBeValidSSMLAndEqual(
            '<sub alias="five over">+5</sub>',
            true
        );
        await expect(renderToString(<GolfScore score={26} />)).toBeValidSSMLAndEqual(
            '<sub alias="twenty six over">+26</sub>',
            true
        );
    });

    test('it should correctly return a score of even par', async () => {
        await expect(renderToString(<GolfScore score={0} />)).toBeValidSSMLAndEqual(
            '<sub alias="even par">E</sub>',
            true
        );
    });

    test('it should actually fail bad ssml', async () => {
        await expect(renderToString(<GolfScore score={0} />)).not.toBeValidSSMLAndEqual('even par');
        await expect(renderToString(<GolfScore score={24} />)).not.toBeValidSSMLAndEqual('twenty four over');
        // this is valid as partial is true and becomes <speak>twenty four over</speak>
        await expect('twenty four over').toBeValidSSMLAndEqual('twenty four over', true);
        await expect('<bad-input>lol</bad-input>').not.toBeValidSSMLAndEqual('<bad-input>lol</bad-input>', true);
        await expect('<say-as bad-attr="lol">lol</say-as>').not.toBeValidSSMLAndEqual(
            '<say-as bad-attr="lol">lol</say-as>',
            true
        );
    });
});
