import {TournamentWithDates} from '../types/schedule';

const findClosestTournament = (tournaments: TournamentWithDates[], referenceDate: Date) => {
    let i = -1;
    let closestTournament: TournamentWithDates;
    while (referenceDate > (closestTournament?.start_date ?? new Date(1, 1, 1970)) && i < tournaments.length) {
        i++;
        closestTournament = tournaments[i];
    }

    return tournaments[i - 1];
};

export {findClosestTournament};
