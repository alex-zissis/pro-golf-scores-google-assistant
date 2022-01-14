import {Api, generateApi} from './api.js';
import {SportRadarMapper} from '../mappers/SportRadarMapper.js';

const SportRadarApi: Api<'sportradar'> = generateApi<'sportradar'>({
    providerName: 'sportradar',
    getSchedule: async (args) => {
        return SportRadarMapper.ScheduleResponse(
            await SportRadarApi.fetch(
                `http://api.sportradar.us/golf/trial/${args.tour}/v3/en/${args.year}/tournaments/schedule.json?api_key=${process.env.SPORTRADAR_API_KEY}`
            ).then((res) => res.json())
        );
    },
    getTournament: async (tournamentId, year) => {
        return SportRadarMapper.TournamentResponse(
            await SportRadarApi.fetch(
                `http://api.sportradar.us/golf/trial/pga/v3/en/${year}/tournaments/${tournamentId}/leaderboard.json?api_key=${process.env.SPORTRADAR_API_KEY}`
            ).then((res) => res.json())
        );
    },
});

export {SportRadarApi};
