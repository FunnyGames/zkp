const utils = require('./utils');
const response = utils.serviceResponse;

module.exports.main = () => {
    return response(200, 'Sudoku ZKP');
}