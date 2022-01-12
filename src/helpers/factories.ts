import {LeaderboardEntry, LeaderboardResponse, Round} from '../types/leaderboard';
import {PlayerProfile, Tournament, TournamentWithDates, Venue} from '../types/schedule';

type Factory<T> = {
    create: (input?: Partial<T>) => T;
};

const LeaderboardResponseFactory: Factory<LeaderboardResponse> = {
    create: (input) => ({
        ...TournamentFactory.create(input),
        seasons: [],
        coverage: '',
        leaderboard: [],
        ...input,
    }),
};

const LeaderboardEntryFactory: Factory<LeaderboardEntry> = {
    create: (input) => ({
        ...PlayerProfileFactory.create(input),
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

const PlayerProfileFactory: Factory<PlayerProfile> = {
    create: (input) => ({
        abbr_name: '',
        college: '',
        birth_place: '',
        birthday: '',
        country: '',
        first_name: '',
        handedness: '',
        height: 0,
        id: '',
        weight: 0,
        last_name: '',
        residence: '',
        turned_pro: 0,
        ...input,
    }),
};

const RoundFactory: Factory<Round> = {
    create: (input) => ({
        birdies: 0,
        bogeys: 0,
        double_bogeys: 0,
        eagles: 0,
        holes_in_one: 0,
        other_scores: 0,
        pars: 0,
        score: 0,
        sequence: 0,
        strokes: 0,
        thru: 0,
        ...input,
    }),
};

const TournamentFactory: Factory<Tournament> = {
    create: (input) => ({
        start_date: '1970-01-01',
        name: '',
        end_date: '1970-01-01',
        course_timezone: '',
        currency: '',
        defending_champ: PlayerProfileFactory.create(),
        event_type: '',
        id: '',
        network: '',
        points: 0,
        purse: 1,
        status: 'inprogress',
        total_rounds: 0,
        venue: VenueFactory.create(),
        winner: PlayerProfileFactory.create(),
        winning_share: 0,
        ...input,
    }),
};

const TournamentWithDatesFactory: Factory<TournamentWithDates> = {
    create: ({start_date, end_date, ...input}) => ({
        ...TournamentFactory.create(input),
        start_date: start_date ?? new Date(Date.UTC(1970, 1, 1)),
        end_date: end_date ?? new Date(Date.UTC(1970, 1, 1)),
    }),
};

const VenueFactory: Factory<Venue> = {
    create: (input) => ({
        city: '',
        country: '',
        courses: [],
        id: '',
        name: '',
        state: '',
        zipcode: '',
        ...input,
    }),
};

export {
    LeaderboardResponseFactory,
    LeaderboardEntryFactory,
    RoundFactory,
    PlayerProfileFactory,
    TournamentFactory,
    TournamentWithDatesFactory,
    VenueFactory,
};
