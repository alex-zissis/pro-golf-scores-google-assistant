interface Tour {
    id: string;
    alias: string;
    name: string;
}

interface Season {
    id: string;
    year: number;
}

interface PlayerProfile {
    id: string;
    first_name: string;
    last_name: string;
    height: number;
    weight: number;
    birthday: string;
    country: string;
    residence: string;
    birth_place: string;
    college: string;
    turned_pro: number;
    handedness: string;
    abbr_name: string;
}

interface Hole {
    number: number;
    par: number;
    yardage: number;
    description: string;
}

interface Course {
    id: string;
    name: string;
    yardage: number;
    par: number;
    holes: Hole[];
}

interface Venue {
    id: string;
    name: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    courses: Course[];
}

export type TournamentStatus =  'scheduled' | 'inprogress' | 'closed';

export interface TournamentBase {
    id: string;
    name: string;
    event_type: string;
    purse: number;
    winning_share: number;
    currency: string;
    points: number;
    start_date: string;
    end_date: string;
    course_timezone: string;
    status: TournamentStatus;
}

interface Tournament extends TournamentBase {
    defending_champ: PlayerProfile;
    winner: PlayerProfile;
    venue: Venue;
    network: string;
    total_rounds: number;
}

export interface TournamentWithDates extends Omit<Tournament, 'start_date' | 'end_date'> {
    start_date: Date;
    end_date: Date;
}

export interface ScheduleResponse {
    tour: Tour;
    season: Season;
    tournaments: Tournament[];
}
