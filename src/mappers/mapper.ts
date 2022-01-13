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
} from '../types/golfscores';
import {TournamentStatus} from '../types/enums';

export interface Mapper<
    ProviderName,
    RemoteCourse,
    RemoteLeaderboardEntry,
    RemotePlayer,
    RemoteRound,
    RemoteTournamentStatus,
    RemoteTournament,
    RemoteVenue,
    RemoteTournamentResponse,
    RemoteScheduleResponse
> {
    providerName: ProviderName;
    _getProvider(id?: string): Provider;

    course(remoteCourse: RemoteCourse): Course;
    leaderboardEntry(remoteLeaderboardEntry: RemoteLeaderboardEntry): LeaderboardEntry;
    player(remotePlayer: RemotePlayer): Player;
    round(remoteRound: RemoteRound): Round;
    tournament(remoteTournament: RemoteTournament): TournamentDetailed;
    status(remoteStatus: RemoteTournamentStatus): TournamentStatus | undefined;
    venue(remoteVenue: RemoteVenue): Venue;

    TournamentResponse(remoteTournamentResponse: RemoteTournamentResponse): TournamentResponse;
    ScheduleResponse(scheduleResponse: RemoteScheduleResponse): ScheduleResponse;
}
