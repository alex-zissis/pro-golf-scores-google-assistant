import {TournamentStatus} from './enums.js';

type WithProvider<Base> = Base & {provider: Provider};

type Provider = {
    baseId: string;
    provider: 'sportradar' | 'factory';
    golfScoreId: string;
};

type PlayerLite = WithProvider<{
    firstName: string;
    lastName: string;
    country: string;
    displayName: string;
}>;

type Player = PlayerLite &
    WithProvider<{
        height: number;
        weight: number;
        birthday: Date;
        birthPlace: string;
        residence: string;
        turnedPro: number;
        handedness: 'left' | 'right';
    }>;

interface Hole {
    number: number;
    par: number;
    yardage: number;
    description: string;
}

type Course = WithProvider<{
    name: string;
    yardage: number;
    par: number;
    holes: Hole[];
}>;

type Venue = WithProvider<{
    name: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    courses: Course[];
}>;

type Tour = WithProvider<{
    alias: string;
    name: string;
}>;

type Season = WithProvider<{
    year: number;
}>;

interface Scoring {
    birdies: number;
    bogeys: number;
    doubleBogeys: number;
    eagles: number;
    holesInOne: number;
    other: number;
    pars: number;
}

interface Round {
    roundNumber: number;
    score: number;
    strokes: number;
    thru: number;
    scoring: Scoring;
}

export type TournamentBase = WithProvider<{
    name: string;
    eventType: string;
    purse: number;
    currency: string;
    points: number;
    startDate: Date;
    endDate: Date;
    eventTimezone: string;
    status: TournamentStatus;
}>;

export type TournamentDetailed = TournamentBase &
    WithProvider<{
        defendingChamp: Player;
        winner: Player;
        venue: Venue;
        totalRounds: number;
    }>;

export type LeaderboardEntry = {
    player: PlayerLite;
    position: number;
    tied: boolean;
    money?: number;
    points?: number;
    score: number;
    strokes: number;
    rounds: Round[];
    status?: TournamentStatus;
};

export type ScheduleResponse = WithProvider<{
    tour: Tour;
    season: Season;
    tournaments: TournamentDetailed[];
}>;

export type TournamentResponse = TournamentBase &
    WithProvider<{
        seasons: Season[];
        leaderboard: LeaderboardEntry[];
    }>;
