const services = require('./services');

module.exports.main = (req, res, next) => {
    let resp = services.main();
    res.status(resp.status).send(resp.data);
}

module.exports.indexFile = (req, res, next) => {
    res.sendFile('index.html');
}