import {TournamentWithDates} from '../types/schedule';

const findClosestTournament = (tournaments: TournamentWithDates[], referenceDate: Date): TournamentWithDates => {
    let i = 0;
    let closestTournament: TournamentWithDates;
    while (
        (referenceDate > (closestTournament?.start_date ?? new Date(1, 1, 1970)) ||
            (referenceDate.getUTCFullYear() === closestTournament?.start_date.getUTCFullYear() &&
                referenceDate.getUTCMonth() === closestTournament?.start_date.getUTCMonth() &&
                referenceDate.getUTCDate() === closestTournament?.start_date.getUTCDate())) &&
        i < tournaments.length
    ) {
        i++;
        closestTournament = tournaments[i];
    }

    return tournaments[i - 1];
};

export {findClosestTournament};
