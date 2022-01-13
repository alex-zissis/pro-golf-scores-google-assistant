import {Provider} from './golfscores';

export type CacheObject<T> = T & {expiresUtc: string};

export interface CurrentTournament {
    provider: Provider;
    name: string;
    year: number;
}
