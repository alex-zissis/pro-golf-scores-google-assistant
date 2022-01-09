import express from 'express';
import bodyParser from 'body-parser';
import golf from './golf.js';

const app = express();
app.use(bodyParser.json());

app.post('/', golf);

app.listen(3000, () => console.log('listening'));
