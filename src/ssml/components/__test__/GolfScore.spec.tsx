/** @jsx ssml */
import ssml from 'ssml-tsx';
import {GolfScore} from '../GolfScore';
const {renderToString} = ssml;

describe('Get voice readable string from score', () => {
    test('it should correctly return a score under par', () => {
        expect(renderToString(<GolfScore score={-5} />)).toEqual('<sub alias="five under">-5</sub>');
        expect(renderToString(<GolfScore score={-26} />)).toEqual('<sub alias="twenty six under">-26</sub>');
    });

    test('it should correctly return a score over par', () => {
        expect(renderToString(<GolfScore score={5} />)).toEqual('<sub alias="five over">+5</sub>');
        expect(renderToString(<GolfScore score={26} />)).toEqual('<sub alias="twenty six over">+26</sub>');
    });

    test('it should correctly return a score of even par', () => {
        expect(renderToString(<GolfScore score={0} />)).toEqual('<sub alias="even par">E</sub>');
    });
});
