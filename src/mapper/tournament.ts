import {Tournament, TournamentWithDates} from '../types/schedule';

const mapTournamentToTournamentWithDates = (tournaments: Tournament[]) =>
    tournaments.map((tournament) => {
        return {
            ...tournament,
            start_date: new Date(tournament.start_date),
            end_date: new Date(tournament.end_date),
        } as TournamentWithDates;
    });

export {mapTournamentToTournamentWithDates}