import {objectToCamel} from 'ts-case-convert';
import {
    SRCourse,
    SRLeaderboardEntry,
    SRTournamentResponse,
    SRPlayerProfile,
    SRRound,
    SRScheduleResponse,
    SRTournament,
    SRTournamentStatus,
    SRVenue,
} from '../types/providers/sportradar';
import {TournamentStatus} from '../types/enums';
import {Mapper} from './mapper';

const SportRadarMapper: Mapper<
    'sportradar',
    SRCourse,
    SRLeaderboardEntry,
    SRPlayerProfile,
    SRRound,
    SRTournamentStatus,
    SRTournament,
    SRVenue,
    SRTournamentResponse,
    SRScheduleResponse
> = {
    providerName: 'sportradar',
    _getProvider(id?: string) {
        return {
            provider: SportRadarMapper.providerName,
            baseId: id,
            golfScoreId: '',
        };
    },

    course(remoteCourse) {
        const {holes, name, par, yardage, id} = remoteCourse;
        const provider = SportRadarMapper._getProvider(id);

        return {
            provider,
            holes,
            name,
            par,
            yardage,
        };
    },
    leaderboardEntry(remoteLeaderboardEntry) {
        const {
            id,
            firstName,
            country,
            lastName,
            abbrName: displayName,
            money,
            position,
            score,
            strokes,
            tied,
            points,
            status,
        } = objectToCamel(remoteLeaderboardEntry);

        return {
            player: {
                provider: SportRadarMapper._getProvider(id),
                firstName,
                lastName,
                country,
                displayName,
            },
            position,
            rounds: remoteLeaderboardEntry.rounds.map(SportRadarMapper.round),
            score,
            strokes,
            tied,
            money,
            points,
            status: SportRadarMapper.status(status),
        };
    },
    player(remotePlayer) {
        const {
            abbrName: displayName,
            birthPlace,
            birthday,
            country,
            firstName,
            handedness,
            height,
            id,
            lastName,
            residence,
            turnedPro,
            weight,
        } = objectToCamel(remotePlayer);
        const provider = SportRadarMapper._getProvider(id);

        return {
            provider,
            displayName,
            birthPlace,
            birthday: new Date(birthday),
            country,
            firstName,
            lastName,
            height,
            residence,
            turnedPro,
            weight,
            handedness,
        };
    },
    round(round) {
        const {
            birdies,
            bogeys,
            doubleBogeys,
            eagles,
            holesInOne,
            otherScores: other,
            pars,
            score,
            sequence: roundNumber,
            strokes,
            thru,
        } = objectToCamel(round);

        return {
            score,
            roundNumber,
            strokes,
            thru,
            scoring: {
                birdies,
                bogeys,
                doubleBogeys,
                eagles,
                holesInOne,
                other,
                pars,
            },
        };
    },
    status(status) {
        if (!status) {
            return undefined;
        }

        switch (status) {
            case 'closed':
                return TournamentStatus.Completed;

            case 'inprogress':
                return TournamentStatus.InProgress;

            case 'scheduled':
            case 'created':
                return TournamentStatus.Upcoming;

            case 'cancelled':
                return TournamentStatus.Cancelled;

            default:
                throw Error(`Status ${status} from ${SportRadarMapper.providerName} is not defined`);
        }
    },
    tournament(remoteTournament) {
        const {
            name,
            eventType,
            id,
            currency,
            courseTimezone: eventTimezone,
            points,
            status,
            endDate,
            startDate,
            purse,
            totalRounds,
        } = objectToCamel(remoteTournament);
        const provider = SportRadarMapper._getProvider(id);

        return {
            provider,
            name,
            eventType,
            currency,
            eventTimezone,
            points,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            defendingChamp: remoteTournament.defending_champ && SportRadarMapper.player(remoteTournament.defending_champ),
            purse,
            status: SportRadarMapper.status(status),
            totalRounds,
            venue: remoteTournament.venue && SportRadarMapper.venue(remoteTournament.venue),
            winner: remoteTournament.winner && SportRadarMapper.player(remoteTournament.winner),
        };
    },
    venue(remoteVenue) {
        const {city, name, id, country, courses, state, zipcode: zipCode} = objectToCamel(remoteVenue);
        const provider = SportRadarMapper._getProvider(id);

        return {
            provider,
            city,
            country,
            courses: courses.map(SportRadarMapper.course),
            name,
            state,
            zipCode,
        };
    },

    ScheduleResponse(remoteScheduleResponse) {
        const {season, tour, tournaments} = remoteScheduleResponse;

        return {
            provider: SportRadarMapper._getProvider(),
            season,
            tour,
            tournaments: tournaments.map(SportRadarMapper.tournament),
        };
    },
    TournamentResponse(remoteTournamentResponse) {
        const {
            name,
            eventType,
            currency,
            courseTimezone: eventTimezone,
            points,
            status,
            endDate,
            startDate,
            purse,
            id,
            seasons,
        } = objectToCamel(remoteTournamentResponse);

        return {
            provider: SportRadarMapper._getProvider(id),
            name,
            eventType,
            currency,
            eventTimezone,
            points,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            purse,
            status: SportRadarMapper.status(status),
            leaderboard: remoteTournamentResponse.leaderboard.map(SportRadarMapper.leaderboardEntry),
            seasons,
        };
    },
};

export {SportRadarMapper};