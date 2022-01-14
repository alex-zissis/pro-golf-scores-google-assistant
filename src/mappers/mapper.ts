import {
    Course,
    LeaderboardEntry,
    TournamentResponse,
    Player,
    Provider,
    Round,
    ScheduleResponse,
    TournamentDetailed,
    Venue,
    Tour,
    Season,
    SimpleSeason,
    Hole,
} from '../types/golfscores.js';
import {EventType, LeaderboardEntryStatus, TournamentStatus} from '../types/enums.js';

export interface Mapper<
    ProviderName,
    RemoteCourse,
    RemoteEventType,
    RemoteHole,
    RemoteLeaderboardEntry,
    RemoteLeaderboardEntryStatus,
    RemotePlayer,
    RemoteRound,
    RemoteSeason,
    RemoteSimpleSeason,
    RemoteTour,
    RemoteTournament,
    RemoteTournamentStatus,
    RemoteVenue,
    RemoteTournamentResponse,
    RemoteScheduleResponse
> {
    providerName: ProviderName;
    _getProvider(id?: string): Provider;

    course(remoteCourse: RemoteCourse): Course;
    eventType(remoteEventType: RemoteEventType): EventType;
    hole(remoteHole: RemoteHole): Hole;
    leaderboardEntry(remoteLeaderboardEntry: RemoteLeaderboardEntry): LeaderboardEntry;
    leaderboardEntryStatus(remoteLeaderboardEntryStatus?: RemoteLeaderboardEntryStatus): LeaderboardEntryStatus;
    player(remotePlayer: RemotePlayer): Player;
    round(remoteRound: RemoteRound): Round;
    season(remoteSeason: RemoteSeason): Season;
    simpleSeason(remoteSeason: RemoteSimpleSeason): SimpleSeason;
    status(remoteStatus: RemoteTournamentStatus): TournamentStatus | undefined;
    tour(remoteTour: RemoteTour): Tour;
    tournament(remoteTournament: RemoteTournament): TournamentDetailed;
    venue(remoteVenue: RemoteVenue): Venue;

    TournamentResponse(remoteTournamentResponse: RemoteTournamentResponse): TournamentResponse;
    ScheduleResponse(scheduleResponse: RemoteScheduleResponse): ScheduleResponse;
}
