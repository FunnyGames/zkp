const utils = require('./utils');
const response = utils.serviceResponse;

const memory = {};

function getNext() {
    let type = utils.randomType();
    let cord = utils.randomNumber(0, 10);
    return { type, cord };
}

function getX(type, coordinate, index) {
    switch (type) {
        case 'row': return coordinate * 9 + index;
        case 'col': return coordinate + index * 9;
        case 'cube':
            let secIndex = index % 3;
            if (index >= 3 && index <= 5) secIndex += 9;
            else if (index >= 6 && index <= 8) secIndex += 18;
            if (coordinate >= 0 && coordinate <= 2)
                return coordinate * 3 + secIndex;
            else if (coordinate >= 3 && coordinate <= 5)
                return coordinate * 3 + 18 + secIndex;
            else if (coordinate >= 6 && coordinate <= 8)
                return coordinate * 3 + 36 + secIndex;
    }
}

function addInfoToBoard(board, array, type, coordinate) {
    console.log('Add info to board');
    let { length } = array;
    for (let i = 0; i < length; ++i) {
        let x = getX(type, coordinate, i);
        board[x] = array[i];
    }
    utils.drawSudoku(board);
}

function validateArray(arr) {
    let { length } = arr;
    for (let i = 0; i < length; ++i) {
        let a = arr[i];
        if (utils.hasDuplicates(a)) return false;
    }
    return true;
}

function validateBoard(board) {
    let cubes = utils.puzzleCubes(board);
    let colums = utils.puzzleColumns(board);
    let rows = utils.puzzleRows(board);
    return validateArray(cubes) && validateArray(colums) && validateArray(rows);
}

function deleteSudoku(uuid) {
    delete memory[uuid];
    console.log('Deleted uuid - ' + uuid);
    console.log('Current memory:');
    console.log(memory);
}

module.exports.startSimulation = (data) => {
    let { uuid } = data;
    memory[uuid] = {
        board: utils.createEmptySudoku(),
        trust: 0,
    };
    let { type, cord } = getNext();
    let res = {
        ...memory[uuid],
        type,
        cord,
        isTrustful: false,
    };
    setTimeout(() => deleteSudoku(uuid), 200000);
    return response(200, res);
}

module.exports.nextIteration = (data) => {
    let { uuid, array, type: t, cord: c } = data;
    let mem = memory[uuid];
    if (!mem) return response(404, 'Not Found');
    addInfoToBoard(mem.board, array, t, c);
    let isValid = validateBoard(mem.board);
    if (!isValid) {
        console.log('Board is not valid');
        deleteSudoku(uuid);
        return response(400, 'Failed. Wrong solution.');
    } else {
        mem.trust += 1 / 27;
        if (mem.trust > 1) mem.trust = 1;
    }
    let isTrustful = false;
    if (mem.trust > 0.8) {
        console.log('Client is trustful');
        isTrustful = true;
    }
    let { type, cord } = getNext();
    let res = {
        ...memory[uuid],
        type,
        cord,
        isTrustful,
    };
    return response(200, res);
}