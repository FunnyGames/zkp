module.exports.serviceResponse = (status, data) => ({ status, data });

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

module.exports.puzzleColumns = (puzzle) => {
    let list = [];
    let size = 9;
    for (let i = 0; i < size; ++i) {
        let c = [];
        for (let j = 0; j < size; ++j) {
            let index = i + j * size;
            c.push(puzzle[index]);
        }
        list.push(c);
    }
    return list;
}

module.exports.puzzleCubes = (puzzle) => {
    let list = [];
    let size = 9;
    for (let i = 0; i < size; i++) {
        let c = [];
        for (let j = 0; j < size; ++j) {
            let index = j;
            let secIndex = index % 3;
            if (index >= 3 && index <= 5) secIndex += 9;
            else if (index >= 6 && index <= 8) secIndex += 18;
            if (i >= 0 && i <= 2)
                index = i * 3 + secIndex;
            else if (i >= 3 && i <= 5)
                index = i * 3 + 18 + secIndex;
            else if (i >= 6 && i <= 8)
                index = i * 3 + 36 + secIndex;
            c.push(puzzle[index]);
        }
        list.push(c);
    }
    return list;
}

module.exports.createEmptySudoku = () => {
    let sudoku = [
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    return sudoku;
}

module.exports.randomType = () => {
    let types = ['row', 'col', 'cube'];
    let randIndex = this.randomNumber(0, types.length);
    return types[randIndex];
}

module.exports.randomNumber = (min, max) => {
    let diff = max - min;
    return min + Math.floor((Math.random() * diff));
}

module.exports.hasDuplicates = (puzzle) => {
    let digitMask = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let { length } = digitMask;
    for (let i = 0; i < length; ++i) {
        let x = puzzle[i];
        digitMask[x - 1]++;
    }
    return digitMask.filter(x => x > 1).length > 0;
}

module.exports.countSolved = (board) => {
    return board.filter(x => x > 0).length;
}

module.exports.drawSudoku = (board) => {
    let rows = this.puzzleRows(board);
    let { length } = rows;
    for (let i = 0; i < length; ++i) {
        let row = rows[i];
        drawRow(row, i);
    }
}

function drawRow(row, level) {
    let { length } = row;
    for (let i = 0; i < length; ++i) {
        process.stdout.write(`${row[i]}`);
        if (i < length - 1)
            process.stdout.write('|');
    }
    process.stdout.write('\n');
    if (level < 8)
        process.stdout.write('-----------------\n');
}