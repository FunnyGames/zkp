const sha256 = require('crypto-js/sha256');

module.exports.serviceResponse = (status, data) => ({ status, data });