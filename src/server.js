const express = require('express');
const config = require('./config');
const app = express();

config.configRoutes(app);

let port = 3000;
let server = app.listen(port);
server.on('listening', () => console.log(`Server is listening on port ${port}`));
server.on('error', err => console.error(`Error: ${err}`));