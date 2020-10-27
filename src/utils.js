const sha256 = require('crypto-js/sha256');
const bigInt = require('big-integer');

module.exports.serviceResponse = (status, data) => ({ status, data });

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports.createPermutations = () => {
    let permutations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(permutations);
    permutations = [0, ...permutations];
    return permutations;;
}

module.exports.puzzlePermute = (puzzle, permutations) => {
    let list = [];
    let { length } = puzzle;
    for (let i = 0; i < length; ++i) {
        let x = puzzle[i];
        list.push(permutations[x]);
    }
    return list;
}

module.exports.generateNonces = () => {
    let size = 9 ** 2;
    let nonces = [];
    for (let i = 0; i < size; ++i) {
        let x = bigInt.randBetween(0, '2e256');
        nonces.push(x);
    }
    return nonces;
}