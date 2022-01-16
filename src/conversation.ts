import {conversation} from '@assistant/conversation';
import dotenv from 'dotenv';
import {getTournament} from './handlers/getTournament.js';
import {isDevelopment} from './utils.js';

if (isDevelopment()) {
    dotenv.config();
}

const conversationApp = conversation({debug: isDevelopment()});

// todo delete old handler name
conversationApp.handle('getLeaderboard', getTournament);

conversationApp.handle('getTournament', getTournament);

export default conversationApp;
