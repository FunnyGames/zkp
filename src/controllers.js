const services = require('./services');

module.exports.startSimulation = (req, res, next) => {
    let resp = services.startSimulation(req.body);
    res.status(resp.status).send(resp.data);
}

module.exports.nextIteration = (req, res, next) => {
    let resp = services.nextIteration(req.body);
    res.status(resp.status).send(resp.data);
}

module.exports.indexFile = (req, res, next) => {
    res.sendFile('index.html');
}