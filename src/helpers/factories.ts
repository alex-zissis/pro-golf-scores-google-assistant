import {LeaderboardEntry, Round} from '../types/leaderboard';
import {PlayerProfile, TournamentWithDates, Venue} from '../types/schedule';

type Factory<T> = {
    create: (input?: Partial<T>) => T;
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

const TournamentFactory: Factory<TournamentWithDates> = {
    create: (input) => ({
        start_date: new Date(1970, 1, 1),
        name: '',
        end_date: new Date(1970, 1, 1),
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

export {LeaderboardEntryFactory, RoundFactory, PlayerProfileFactory, TournamentFactory, VenueFactory};