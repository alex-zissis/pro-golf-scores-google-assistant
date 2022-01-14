import {objectToCamel} from 'ts-case-convert';
import {
    SRCourse,
    SRLeaderboardEntry,
    SRTournamentResponse,
    SRPlayerProfile,
    SRRound,
    SRScheduleResponse,
    SRTournament,
    SRVenue,
    SRTour,
    SRSeason,
    SRSimpleSeason,
    SRTournamentStatus,
    SRLeaderboardEnryStatus,
    SREventType,
    SRHole,
} from '../types/providers/sportradar.js';
import {EventType, LeaderboardEntryStatus, TournamentStatus} from '../types/enums.js';
import {Mapper} from './mapper.js';
import {inchesToCms, poundsToKgs, toTitleCase, yardsToMeters} from '../utils.js';

const SportRadarMapper: Mapper<
    'sportradar',
    SRCourse,
    SREventType,
    SRHole,
    SRLeaderboardEntry,
    SRLeaderboardEnryStatus,
    SRPlayerProfile,
    SRRound,
    SRSeason,
    SRSimpleSeason,
    SRTour,
    SRTournament,
    SRTournamentStatus,
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
            holes: holes.map(SportRadarMapper.hole),
            name,
            par,
            length: yardsToMeters(yardage),
        };
    },
    eventType(remoteEventType) {
        switch (remoteEventType) {
            case 'cup':
                return EventType.Cup;
            case 'team':
                return EventType.Team;
            case 'match':
                return EventType.Match;
            case 'stroke':
                return EventType.Stroke;
            default:
                throw Error(`Event Type ${remoteEventType} from ${SportRadarMapper.providerName} is not defined`);
        }
    },
    hole(remoteHole) {
        const {number, description, par, yardage} = remoteHole;

        return {
            number,
            description,
            par,
            length: yardsToMeters(yardage),
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
        } = objectToCamel(remoteLeaderboardEntry);

        return {
            player: {
                provider: SportRadarMapper._getProvider(id),
                firstName,
                lastName,
                country: toTitleCase(country),
                displayName: displayName.split('.').join('. '),
            },
            position,
            rounds: remoteLeaderboardEntry.rounds.map(SportRadarMapper.round),
            score,
            strokes,
            tied,
            money,
            points,
            status: SportRadarMapper.leaderboardEntryStatus(remoteLeaderboardEntry.status),
        };
    },
    leaderboardEntryStatus(remoteLeaderboardEntryStatus) {
        switch (remoteLeaderboardEntryStatus) {
            case null:
            case undefined:
                return LeaderboardEntryStatus.Unknown;
            case 'CUT':
                return LeaderboardEntryStatus.Cut;
            case 'WD':
                return LeaderboardEntryStatus.Withdrawn;
            default:
                throw Error(
                    `Leaderboard Entry status ${remoteLeaderboardEntryStatus} from ${SportRadarMapper.providerName} is not defined`
                );
        }
    },
    player(remotePlayer) {
        const {
            abbrName: displayName,
            birthday,
            country,
            firstName,
            id,
            lastName,
            turnedPro: yearTurnedPro,
        } = objectToCamel(remotePlayer);
        const provider = SportRadarMapper._getProvider(id);

        return {
            provider,
            displayName: displayName.split('.').join('. '),
            dateOfBirth: new Date(birthday),
            country: toTitleCase(country),
            firstName,
            lastName,
            height: inchesToCms(remotePlayer.height),
            yearTurnedPro,
            weight: poundsToKgs(remotePlayer.weight),
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
    season(remoteSeason) {
        const {year, id, tour} = remoteSeason;

        return {
            provider: SportRadarMapper._getProvider(id),
            year,
            tour: SportRadarMapper.tour(tour),
        };
    },
    simpleSeason(remoteSeason) {
        const {year, id} = remoteSeason;

        return {
            provider: SportRadarMapper._getProvider(id),
            year,
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
    tour(remoteTour) {
        const {alias, name, id} = remoteTour;

        return {
            provider: SportRadarMapper._getProvider(id),
            alias,
            name,
        };
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
            eventType: SportRadarMapper.eventType(eventType),
            currency,
            eventTimezone,
            points,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            defendingChamp:
                remoteTournament.defending_champ && SportRadarMapper.player(remoteTournament.defending_champ),
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
            season: SportRadarMapper.simpleSeason(season),
            tour: SportRadarMapper.tour(tour),
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
        } = objectToCamel(remoteTournamentResponse);

        return {
            provider: SportRadarMapper._getProvider(id),
            name,
            eventType: SportRadarMapper.eventType(eventType),
            currency,
            eventTimezone,
            points,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            purse,
            status: SportRadarMapper.status(status),
            leaderboard: remoteTournamentResponse.leaderboard.map(SportRadarMapper.leaderboardEntry),
            seasons: remoteTournamentResponse.seasons.map(SportRadarMapper.season),
        };
    },
};

export {SportRadarMapper};
