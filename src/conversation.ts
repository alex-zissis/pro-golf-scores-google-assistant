import {conversation} from '@assistant/conversation';
import dotenv from 'dotenv';
import winston from 'winston';
import {getTournament} from './handlers/getTournament.js';
import {isDevelopment} from './utils.js';

if (isDevelopment()) {
    dotenv.config();
}

const conversationApp = conversation({
    verification: 'progolfscores',
    logger: winston,
    debug: isDevelopment() && process.env.DEBUG_CONVERSATION === '1',
});

conversationApp.handle('getTournament', getTournament);

export default conversationApp;
