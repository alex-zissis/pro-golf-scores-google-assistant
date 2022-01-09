interface Tour {
    id: string;
    alias: string;
    name: string;
}

interface Season {
    id: string;
    year: number;
}

interface DefendingChamp {
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

interface Winner {
    id: string;
    first_name: string;
    last_name: string;
    height: number;
    weight: number;
    birthday: Date;
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

interface Tournament {
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
    network: string;
    total_rounds: number;
    status: string;
    defending_champ: DefendingChamp;
    winner: Winner;
    venue: Venue;
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
