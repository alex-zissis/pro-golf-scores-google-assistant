import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import golf from './golf.js';
import {isDevelopment} from './utils.js';

const app = express();
app.use(bodyParser.json());
if (isDevelopment()) {
    app.use(morgan('dev'));
}

app.post('/', golf);

app.get('/health', (req, res) => res.status(200).send('👍'));

app.get('*', (req, res) => {
    res.status(404).json({message: 'route does not exist'});
});

export default app;
