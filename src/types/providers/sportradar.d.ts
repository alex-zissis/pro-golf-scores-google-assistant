import {Hole, Season, Tour} from '../golfscores.js';

interface SRRound {
    score: number;
    strokes: number;
    thru: number;
    eagles: number;
    birdies: number;
    pars: number;
    bogeys: number;
    double_bogeys: number;
    other_scores: number;
    holes_in_one: number;
    sequence: number;
}

export interface SRLeaderboardEntry {
    id: string;
    first_name: string;
    last_name: string;
    country: string;
    position: number;
    tied: boolean;
    money: number;
    points: number;
    score: number;
    strokes: number;
    abbr_name: string;
    rounds: SRRound[];
    status?: SRTournamentStatus;
}

interface SRPlayerProfile {
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
    handedness: 'left' | 'right';
    abbr_name: string;
}

interface SRCourse {
    id: string;
    name: string;
    yardage: number;
    par: number;
    holes: Hole[];
}

interface SRVenue {
    id: string;
    name: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    courses: SRCourse[];
}

export type SRTournamentStatus = 'scheduled' | 'inprogress' | 'closed' | 'cancelled' | 'created';

export interface SRTournamentBase {
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
    status: SRTournamentStatus;
}

interface SRTournament extends SRTournamentBase {
    defending_champ: SRPlayerProfile;
    winner: SRPlayerProfile;
    venue: SRVenue;
    network: string;
    total_rounds: number;
}

interface SRScheduleResponse {
    tour: Tour;
    season: Season;
    tournaments: SRTournament[];
}

export interface SRTournamentResponse extends SRTournamentBase {
    seasons: Season[];
    coverage: string;
    leaderboard: SRLeaderboardEntry[];
}
