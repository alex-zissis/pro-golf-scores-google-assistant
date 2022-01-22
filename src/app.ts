import express from 'express';
import winston from 'winston';
import {configureWinston, configureApp} from '@zicodev/micro';
import conversationApp from './conversation.js';

const app = express();

configureWinston(winston);

configureApp(
    app,
    () => {
        app.post('/conversation', conversationApp);
    },
    {logGroupName: '/zico/micro/pro-golf-scores'}
);

export default app;
