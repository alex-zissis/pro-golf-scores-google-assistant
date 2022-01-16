import winston from 'winston';
import app from './app.js';

const port = 3000;
const server = app.listen(3000, () => {
    winston.info({message: `🚀 Listening on port ${port}`, port});
});

export default server;
