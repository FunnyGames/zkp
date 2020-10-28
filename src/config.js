const routes = require('./routes');
const express = require('express');
const bodyParser = require('body-parser');

module.exports.configRoutes = (app) => {
    app.use(bodyParser.json());
    app.use(express.static('public'));
    app.use(routes);
}