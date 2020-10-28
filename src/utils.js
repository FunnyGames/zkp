const sha256 = require('crypto-js/sha256');

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

module.exports.solve_sudoku_puzzle = (puzzle) => {
    let solution = [
        1, 7, 2, 5, 4, 9, 6, 8, 3,
        6, 4, 5, 8, 7, 3, 2, 1, 9,
        3, 8, 9, 2, 6, 1, 7, 4, 5,
        4, 9, 6, 3, 2, 7, 8, 5, 1,
        8, 1, 3, 4, 5, 6, 9, 7, 2,
        2, 5, 7, 1, 9, 8, 4, 3, 6,
        9, 6, 4, 7, 1, 5, 3, 2, 8,
        7, 3, 1, 6, 8, 2, 5, 9, 4,
        5, 2, 8, 9, 3, 4, 1, 6, 7
    ];
    return solution;
}

module.exports.puzzleCommitment = (permuedSolution, nonces) => {
    let { length } = nonces;
    let list = []
    for (let i = 0; i < length; ++i) {
        let nonce = nonces[i];
        let val = permuedSolution[i];
        let encoded = sha256(String(nonce) + String(val));
        let hex = encoded.toString();
        list.push(hex);
    }
    return list;
}

module.exports.chunk = (puzzle, size) => {
    let list = [];
    let { length } = puzzle;
    for (let i = 0; i < length; i += size) {
        let c = puzzle.slice(i, i + size);
        list.push(c);
    }
    return list;
}

module.exports.puzzleRows = (puzzle) => {
    return this.chunk(puzzle, 9);
}

module.exports.allDigitsExistsOnce = (puzzle) => {
    let digitMask = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let { length } = digitMask;
    for (let i = 0; i < length; ++i) {
        let x = puzzle[i];
        digitMask[x - 1] = 1;
    }
    return digitMask.filter(x => x > 0).length === digitMask.length;
}

module.exports.verifyArrays = (array1, array2) => {
    if (!array1 || !array2) return false;
    if (array1.length !== array2.length) return false;
    let { length } = array1;
    for (let i = 0; i < length; ++i) {
        let a1 = array1[i];
        let a2 = array2[i];
        if (a1 !== a2) return false;
    }
    return true;
}

// let solution = this.solve_sudoku_puzzle();
// let permutations = this.createPermutations();

// let nonces = this.generateNonces();

// let permuted = this.puzzlePermute(solution, permutations);
// let commitment = this.puzzleCommitment(permuted, nonces);

// let third_row = this.puzzleRows(permuted)[2];
// let third_row_nonces = this.puzzleRows(nonces)[2];

// let third_row_commitment = this.puzzleRows(commitment)[2];

// let sudoku_verification = this.allDigitsExistsOnce(third_row);
// console.log(sudoku_verification);

// let commitment_verification = this.puzzleCommitment(third_row, third_row_nonces);

// let isHashOk = this.verifyArrays(commitment_verification, third_row_commitment);
// console.log(isHashOk);
