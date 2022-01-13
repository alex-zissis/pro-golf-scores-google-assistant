import {TournamentStatus} from '../types/enums.js';
import {
    LeaderboardEntry,
    TournamentResponse,
    Round,
    Player,
    TournamentDetailed,
    Venue,
    Provider,
    PlayerLite,
    Scoring,
    TournamentBase,
} from '../types/golfscores';

type Factory<T> = {
    create: (input?: Partial<T>) => T;
};

const TournamentResponseFactory: Factory<TournamentResponse> = {
    create: (input) => ({
        ...TournamentDetailedFactory.create(input),
        seasons: [],
        leaderboard: [],
        ...input,
    }),
};

const ProviderFactory: Factory<Provider> = {
    create: (input) => ({
        baseId: '',
        golfScoreId: '',
        provider: 'factory',
        ...input,
    }),
};

const LeaderboardEntryFactory: Factory<LeaderboardEntry> = {
    create: (input) => ({
        player: PlayerLiteFactory.create(),
        position: 0,
        tied: false,
        money: 0,
        points: 0,
        score: 0,
        strokes: 0,
        rounds: [],
        ...input,
    }),
};

const PlayerLiteFactory: Factory<PlayerLite> = {
    create: (input) => ({
        country: '',
        displayName: '',
        firstName: '',
        lastName: '',
        provider: ProviderFactory.create(),
        ...input,
    }),
};

const PlayerFactory: Factory<Player> = {
    create: (input) => ({
        ...PlayerLiteFactory.create(input),
        birthday: new Date(1970, 0, 1),
        handedness: 'left',
        height: 0,
        weight: 0,
        residence: '',
        turnedPro: 0,
        birthPlace: '',
        ...input,
    }),
};

const ScoringFactory: Factory<Scoring> = {
    create: (input) => ({
        birdies: 0,
        bogeys: 0,
        doubleBogeys: 0,
        eagles: 0,
        holesInOne: 0,
        other: 0,
        pars: 0,
        ...input,
    }),
};

const RoundFactory: Factory<Round> = {
    create: (input) => ({
        roundNumber: 0,
        score: 0,
        scoring: ScoringFactory.create(),
        strokes: 0,
        thru: 0,
        ...input,
    }),
};

const TournamentDetailedFactory: Factory<TournamentDetailed> = {
    create: (input) => ({
        provider: ProviderFactory.create(),
        name: '',
        eventTimezone: '',
        currency: '',
        defendingChamp: PlayerFactory.create(),
        eventType: '',
        network: '',
        points: 0,
        purse: 1,
        status: TournamentStatus.InProgress,
        totalRounds: 0,
        venue: VenueFactory.create(),
        winner: PlayerFactory.create(),
        startDate: new Date(1970, 0, 1),
        endDate: new Date(1970, 0, 1),
        ...input,
    }),
};

const TournamentBaseFactory: Factory<TournamentBase> = {
    create: (input) => ({
        provider: ProviderFactory.create(),
        name: '',
        eventTimezone: '',
        currency: '',
        defendingChamp: PlayerFactory.create(),
        eventType: '',
        network: '',
        points: 0,
        purse: 1,
        status: TournamentStatus.InProgress,
        totalRounds: 0,
        venue: VenueFactory.create(),
        winner: PlayerFactory.create(),
        startDate: new Date(1970, 0, 1),
        endDate: new Date(1970, 0, 1),
        ...input,
    }),
};

const VenueFactory: Factory<Venue> = {
    create: (input) => ({
        provider: ProviderFactory.create(),
        city: '',
        country: '',
        courses: [],
        name: '',
        state: '',
        zipCode: '',
        ...input,
    }),
};

export {
    TournamentResponseFactory,
    LeaderboardEntryFactory,
    RoundFactory,
    PlayerFactory,
    PlayerLiteFactory,
    TournamentDetailedFactory,
    VenueFactory,
    ProviderFactory,
    TournamentBaseFactory
};
