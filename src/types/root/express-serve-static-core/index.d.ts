import _core from 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Request {
        requestId: string;
    }
}
