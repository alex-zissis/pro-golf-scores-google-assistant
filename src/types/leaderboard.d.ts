import {TournamentBase} from './schedule';

interface Tour {
    id: string;
    alias: string;
    name: string;
}

interface Season {
    id: string;
    year: number;
    tour: Tour;
}

interface Round {
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

export interface LeaderboardEntry {
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
    rounds: Round[];
    status?: string;
}

export interface LeaderboardResponse extends TournamentBase {
    seasons: Season[];
    coverage: string;
    leaderboard: LeaderboardEntry[];
}
