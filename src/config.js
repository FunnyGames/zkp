const routes = require('./routes');
const express = require('express');

module.exports.configRoutes = (app) => {
    app.use(express.static('public'));
    app.use(routes);
}