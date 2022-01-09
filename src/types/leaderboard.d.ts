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

interface Leaderboard {
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
    status: string;
}

export interface LeaderboardResponse {
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
    status: string;
    seasons: Season[];
    coverage: string;
    leaderboard: Leaderboard[];
}
