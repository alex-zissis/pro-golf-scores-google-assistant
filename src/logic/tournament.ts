import {TournamentDetailed} from '../types/golfscores';

const findClosestTournament = (tournaments: TournamentDetailed[], referenceDate: Date): TournamentDetailed => {
    let i = 0;
    let closestTournament: TournamentDetailed;
    while (
        (referenceDate > (closestTournament?.startDate ?? new Date(1, 1, 1970)) ||
            (referenceDate.getUTCFullYear() === closestTournament?.startDate.getUTCFullYear() &&
                referenceDate.getUTCMonth() === closestTournament?.startDate.getUTCMonth() &&
                referenceDate.getUTCDate() === closestTournament?.startDate.getUTCDate())) &&
        i < tournaments.length
    ) {
        i++;
        closestTournament = tournaments[i];
    }

    return tournaments[i - 1];
};

export {findClosestTournament};
