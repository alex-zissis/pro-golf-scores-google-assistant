import express from 'express';
import bodyParser from 'body-parser';
import golf from './golf.js';

const app = express();
app.use(bodyParser.json());

app.post('/', golf);

app.get('/health', (req, res) => res.status(200).send('👍'));

app.get('*', function (req, res) {
    res.status(404).json({message: 'route does not exist'});
});

const port = 3000;
app.listen(3000, () => console.log(`listening on port ${port}`));
