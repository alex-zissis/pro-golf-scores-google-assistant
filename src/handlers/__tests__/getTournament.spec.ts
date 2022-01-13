import request from 'supertest';
import {jest} from '@jest/globals';

import app from '../../app';
import getLeaderboardReqBody from './getTournament.mock.json';
import cache, {CacheKeys} from '../../cache';
import {CacheObject, CurrentTournament} from '../../types/cache';
import {ConversationResponse} from './handlers';

let appInstance: request.SuperTest<request.Test>;

beforeAll(() => {
    appInstance = request(app);
});

describe('Health check', () => {
    it('should be healthy', async () => {
        const res = await appInstance.get('/health');
        expect(res.status).toEqual(200);
        expect(res.text).toEqual('👍');
    });
});

describe('Get leaderboard handler', () => {
    it('should return a valid and correct ConversationResponse', async () => {
        jest.spyOn(cache, 'readCache').mockImplementation(async function (cacheKey: CacheKeys) {
            return {
                expiresUtc: new Date(Date.UTC(2025, 1, 1)).toISOString(),
                provider: {
                    baseId: 'ce99ab88-aaf8-449c-95ae-78e8ea31ed58',
                    provider: 'sportradar',
                    golfScoreId: '',
                },
                name: 'Sentry Tournament of Champions',
                year: 2022,
            } as CacheObject<CurrentTournament>;
        });

        const res = await request(app).post('/').send(getLeaderboardReqBody);
        expect(res.statusCode).toEqual(200);

        const body: ConversationResponse = res.body;
        expect(body.session.id).toEqual(
            'ABwppHE9mWCywqanPI8CtQiZERtkfYY92EgU9PE2k1aPMc4PfiHcRq36Js9AWN5g1PzKQ7vSR4TN-IaPjg'
        );
        expect(body.prompt.firstSimple.speech).toBeValidSSMLAndEqual(
            '<speak><p>The Sentry Tournament of Champions finished on <say-as interpret-as="date" format="ymd">2022-01-09</say-as>.</p><p>The winner was Cameron Smith at <sub alias="thirty four under">-34</sub>, after the 4th round.</p></speak>'
        );
        expect(body.prompt.content).toHaveProperty('table');
        expect(body.prompt.content.table.columns).toHaveLength(5);
        expect(body.prompt.content.table.rows).toHaveLength(10);
        expect(body.prompt.content.table.rows[0].cells[0]).toHaveProperty('text', '1');
        expect(body.prompt.content.table.rows[0].cells[1]).toHaveProperty('text', 'Cameron Smith');
        expect(body.prompt.content.table.rows[0].cells[2]).toHaveProperty('text', '🇦🇺');
        expect(body.prompt.content.table.rows[0].cells[3]).toHaveProperty('text', '-34');
        expect(body.prompt.content.table.rows[0].cells[4]).toHaveProperty('text', '-8');
    });
});
