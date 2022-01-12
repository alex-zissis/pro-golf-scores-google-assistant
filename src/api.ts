import nf from 'node-fetch';
import {promises as fs} from 'fs';
import path from 'path';
import {dirname, isTest} from './utils.js';
import {LeaderboardResponse} from './types/leaderboard';
import {ScheduleResponse} from './types/schedule.js';

const [, , mock] = process.argv;
const shouldMockRequest = !!mock || isTest();
const mocksDirectory = path.resolve(dirname, '..', 'mocks');
const disableNodeFetch = isTest();

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

const fetch = shouldMockRequest
    ? async (url: string) => ({
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
      })
    : !disableNodeFetch
    ? nf
    : new Error('');

if (fetch instanceof Error) {
    throw fetch;
}

const Tournament = {
    getLeaderboard: async (tournamentId: string, year: number) => {
        return fetch(
            `http://api.sportradar.us/golf/trial/pga/v3/en/${year}/tournaments/${tournamentId}/leaderboard.json?api_key=${process.env.SPORTRADAR_API_KEY}`
        ).then((res) => res.json() as Promise<LeaderboardResponse>);
    },
};

interface GetScheduleArgs {
    tour?: string;
    year?: number;
}

const Schedule = {
    getSchedule: async (args: GetScheduleArgs = {tour: 'pga', year: new Date().getFullYear()}) => {
        return fetch(
            `http://api.sportradar.us/golf/trial/${args.tour}/v3/en/${args.year}/tournaments/schedule.json?api_key=${process.env.SPORTRADAR_API_KEY}`
        ).then((res) => res.json() as Promise<ScheduleResponse>);
    },
};

export {Schedule, Tournament};
