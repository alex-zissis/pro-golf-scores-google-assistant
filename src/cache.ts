import {promises as fs} from 'fs';
import path from 'path';
import {CacheObject} from './types/cache.js';
import {dirname} from './utils.js';

enum CacheKeys {
    CurrentTournament = 'currentTournament.json',
}

const CacheDir = path.resolve(dirname, '..', '..', '.cache');
await fs.mkdir(CacheDir, {recursive: true});

function readCache<T>(cacheKey: CacheKeys): Promise<CacheObject<T> | undefined> {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(CacheDir, cacheKey))
            .then((buffer) => {
                const cacheJson = JSON.parse(buffer.toString()) as CacheObject<T> | undefined;
                if (!cacheJson) {
                    resolve(undefined);
                    return;
                }

                const expiredDate = new Date(cacheJson.expiresUtc).getTime();
                const now = new Date().getTime();

                if (now >= expiredDate) {
                    invalidateCache(cacheKey);
                    resolve(undefined);
                    return;
                }

                resolve(cacheJson);
            })
            .catch((err: any) => {
                if (err && err.code) {
                    if (err.code === 'ENOENT') {
                        resolve(undefined);
                        return;
                    }
                }

                reject(err);
            });
    });
}

function writeCache<T>(cacheKey: CacheKeys, value: CacheObject<T>): Promise<void> {
    return fs.writeFile(path.resolve(CacheDir, cacheKey), JSON.stringify(value, null, 2));
}

function invalidateCache(cacheKey: CacheKeys): Promise<void> {
    return fs.rm(path.resolve(CacheDir, cacheKey));
}

export {CacheKeys};

export default {
    readCache,
    writeCache,
};
