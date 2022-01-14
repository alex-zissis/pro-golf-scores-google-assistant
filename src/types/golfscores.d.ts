import {EventType, LeaderboardEntryStatus, TournamentStatus} from './enums.js';

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
        dateOfBirth: Date;
        yearTurnedPro: number;
    }>;

interface Hole {
    number: number;
    par?: number;
    length?: number;
    description?: string;
}

type Course = WithProvider<{
    name: string;
    length: number;
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

type SimpleSeason = WithProvider<{
    year: number;
}>;

type Season = SimpleSeason & {
    tour: Tour;
};

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
    eventType: EventType;
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
    status: LeaderboardEntryStatus;
};

export type ScheduleResponse = WithProvider<{
    tour: Tour;
    season: SimpleSeason;
    tournaments: TournamentDetailed[];
}>;

export type TournamentResponse = TournamentBase &
    WithProvider<{
        seasons: Season[];
        leaderboard: LeaderboardEntry[];
    }>;
