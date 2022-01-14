import path from 'path';
import nf from 'node-fetch';
import {promises as fs} from 'fs';
import {dirname, isTest} from '../utils.js';
import {ScheduleResponse, TournamentResponse} from '../types/golfscores.js';

const [, , mock] = process.argv;
const mocksDirectory = path.resolve(dirname, '..', 'mocks');

const urlToJSONFile = (url: string) => {
    // http://api.sportradar.us/golf/trial/pga/v3/en/2022/tournaments/schedule.json?api_key=<API_KEY>
    // http://api.sportradar.us/golf/trial/pga/v3/en/2021/tournaments/1dd9d68d-dcdf-4238-a82b-ed2077ea799d/leaderboard.json?api_key=<API_KEY>
    const parts = url.split('/');

    if (parts.findIndex((part) => part.includes('leaderboard.json')) !== -1) {
        return path.resolve(mocksDirectory, 'leaderboard', `${parts[10]}.json`);
    } else if (parts.findIndex((part) => part.includes('schedule.json')) !== -1) {
        return path.resolve(mocksDirectory, 'schedule', 'pga', `${parts[8]}.json`);
    }

    throw Error("Can't find JSON");
};

const _fakeFetch = async (url: string) => ({
    json: async () => {
        try {
            return JSON.parse((await fs.readFile(urlToJSONFile(url))).toString());
        } catch (e) {
            const result = await nf(url);
            const res = (await result.json()) as any;
            await fs.writeFile(urlToJSONFile(url), JSON.stringify(res, null, 2));
            return res;
        }
    },
});

const shouldMockRequest = !!mock || isTest();
const disableNodeFetch = isTest();

const fetch = shouldMockRequest ? _fakeFetch : nf;

if (shouldMockRequest && !disableNodeFetch) {
    throw Error('Could not initiate a fetch object');
}

interface GetScheduleArgs {
    tour?: string;
    year?: number;
}

interface IBaseApi {
    fetch:
        | ((url: string) => Promise<{
              json: () => Promise<any>;
          }>)
        | ((url: RequestInfo, init?: RequestInit) => Promise<Response>);
}

export interface Api<ProviderName> extends IBaseApi {
    providerName: ProviderName;

    getTournament(tournamentId: string, year: number): Promise<TournamentResponse>;
    getSchedule(args?: GetScheduleArgs): Promise<ScheduleResponse>;
}

const BaseApi = {
    fetch,
};

function generateApi<ProviderName>({
    providerName,
    getSchedule,
    getTournament,
}: Pick<Api<ProviderName>, 'providerName' | 'getSchedule' | 'getTournament'>): Api<ProviderName> {
    const api: Api<ProviderName> = Object.create(BaseApi);
    api.providerName = providerName;
    api.getSchedule = getSchedule;
    api.getTournament = getTournament;

    return api;
}

export {generateApi};
