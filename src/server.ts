import app from './app.js';

const port = 3000;
const server = app.listen(3000, () => console.log(`listening on port ${port}`));

export default server;
