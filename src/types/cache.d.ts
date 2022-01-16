import {Provider} from './golfscores.js';

export type CacheObject<T> = T & {expiresUtc: string};

export interface CurrentTournament {
    provider: Provider;
    name: string;
    year: number;
}
