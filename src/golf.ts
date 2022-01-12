import {conversation} from '@assistant/conversation';
import dotenv from 'dotenv';
import {getLeaderboard} from './handlers/getLeaderboard.js';
import {isDevelopment} from './utils.js';

if (isDevelopment()) {
    dotenv.config();
}

const app = conversation({debug: isDevelopment()});

app.handle('getLeaderboard', getLeaderboard);

export default app;