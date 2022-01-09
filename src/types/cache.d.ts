export type CacheObject<T> = T & {expiresUtc: string};

export interface CurrentTournament {
    id: string;
    name: string;
    year: number;
}
