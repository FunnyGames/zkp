const utils = require('./utils');
const response = utils.serviceResponse;

const memory = {};

function getNext() {
    let type = utils.randomType();
    let cord = utils.randomNumber(0, 9);
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
    console.log({ memory });
}

module.exports.startSimulation = (data) => {
    let { uuid } = data;
    let { type, cord } = getNext();
    memory[uuid] = {
        board: utils.createEmptySudoku(),
        trust: 0,
        type,
        cord,
    };
    let res = {
        ...memory[uuid],
        isTrustful: false,
    };
    setTimeout(() => deleteSudoku(uuid), 200000);
    return response(200, res);
}

module.exports.nextIteration = (data) => {
    let { uuid, array, type: t, cord: c } = data;
    let mem = memory[uuid];
    if (!mem) {
        return response(404, { error: 'Not Found' });
    }
    if (mem.cord !== c && mem.type !== t) {
        console.log(`Wrong values received: cord: ${c}, type: ${t}, expected: cord: ${mem.cord}, type: ${mem.type}`);
        return response(400, { error: 'Failed. Wrong values received.', ...mem, isTrustful: false });
    }
    let prevTotalSolved = utils.countSolved(mem.board);
    addInfoToBoard(mem.board, array, t, c);
    let isValid = validateBoard(mem.board);
    if (!isValid) {
        console.log('Board is not valid');
        let resData = { error: 'Failed. Wrong solution.', ...mem, isTrustful: false };
        deleteSudoku(uuid);
        return response(400, resData);
    } else {
        let totalSolved = utils.countSolved(mem.board);
        let diff = totalSolved - prevTotalSolved;
        mem.trust += diff / mem.board.length;
        if (diff === 0) {
            mem.trust += 0.03;
        }
        console.log('total solved: ', totalSolved);
    }
    let isTrustful = false;
    if (mem.trust > 0.8) {
        console.log('Client is trustful');
        isTrustful = true;
        deleteSudoku(uuid);
    }
    let { type, cord } = getNext();
    mem.type = type;
    mem.cord = cord;
    let res = {
        ...mem,
        isTrustful,
    };
    return response(200, res);
}