import express from 'express';
import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import AWS from 'aws-sdk';
import {format} from 'date-fns';
import crypto from 'crypto';
const startTime = new Date();

AWS.config.update({
    region: process.env.AWS_REGION ?? 'ap-southeast-2',
});

import expressWinston from 'express-winston';
import bodyParser from 'body-parser';
import {v4 as uuidv4} from 'uuid';
import conversationApp from './conversation.js';
import {isDevelopment, isProduction} from './utils.js';

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    req.requestId = uuidv4();
    next();
});

const defaultLogFormat =
    (isDevelopment() && !process.env.DEV_JSON_LOGGING) || process.env.DISABLE_LOGS
        ? [winston.format.colorize(), winston.format.cli()]
        : [winston.format.json(), ...(process.env.DEV_JSON_LOGGING ? [winston.format.prettyPrint()] : [])];

winston.configure({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(...defaultLogFormat),
        }),
    ],
});

if (isProduction() || isDevelopment()) {
    app.use(
        expressWinston.logger({
            transports: [
                isProduction() && !process.env.DISABLE_LOGS
                    ? new WinstonCloudWatch({
                          name: 'http-access-log',
                          logGroupName: '/zico/micro/pro-golf-scores-api',
                          logStreamName: () => {
                              return `http_access_log-${format(new Date(), 'yyyyMMdd')}-${crypto
                                  .createHash('md5')
                                  .update(startTime.toISOString())
                                  .digest('hex')}`;
                          },
                          jsonMessage: true,
                      })
                    : new winston.transports.Console(),
            ],
            format: winston.format.combine(...defaultLogFormat),
            msg: 'HTTP {{req.method}} {{req.url}}',
            expressFormat: true,
            meta: true,
            colorize: isDevelopment() && !process.env.DEV_JSON_LOGGING,
            ignoreRoute: (req) => {
                if ((req.originalUrl ?? req.url) === '/health' && req.headers['x-override-ignore'] !== '1') {
                    return true;
                }

                return false;
            },
            dynamicMeta: (req, res) => {
                return {
                    req: {
                        url: req.url,
                        headers: req.headers,
                        method: req.method,
                        httpVersion: req.httpVersion,
                        originalUrl: req.originalUrl,
                        query: req.query,
                        requestId: req.requestId,
                    },
                    res: {statusCode: res.statusCode},
                    ip: req.ip,
                };
            },
        })
    );
}

app.set('trust proxy', true);

app.post('/', conversationApp);

app.get('/health', (req, res) => res.status(200).send('👍'));

app.get('*', (req, res) => {
    res.status(404).json({message: 'route does not exist'});
});

export default app;
