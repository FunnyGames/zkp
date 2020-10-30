// Constants
// Sudoku constants
let sol =
    [[[3, 8, 1, 6, 7, 2, 5, 4, 9], [4, 9, 6, 8, 1, 5, 2, 3, 7], [2, 7, 5, 9, 3, 4, 6, 8, 1], [1, 3, 7, 5, 8, 6, 4, 9, 2], [6, 2, 4, 1, 9, 7, 3, 5, 8], [8, 5, 9, 4, 2, 3, 7, 1, 6], [5, 6, 8, 7, 4, 1, 9, 2, 3], [7, 1, 2, 3, 5, 9, 8, 6, 4], [9, 4, 3, 2, 6, 8, 1, 7, 5]],
    [[4, 2, 7, 6, 3, 1, 9, 8, 5], [6, 5, 8, 4, 2, 9, 7, 1, 3], [3, 1, 9, 7, 8, 5, 2, 4, 6], [1, 3, 4, 5, 6, 2, 8, 9, 7], [5, 7, 2, 8, 9, 3, 4, 6, 1], [8, 9, 6, 1, 4, 7, 3, 5, 2], [9, 8, 3, 2, 1, 6, 5, 7, 4], [7, 4, 1, 3, 5, 8, 6, 2, 9], [2, 6, 5, 9, 7, 4, 1, 3, 8]],
    [[4, 3, 5, 2, 6, 9, 7, 8, 1], [6, 8, 2, 5, 7, 1, 4, 9, 3], [1, 9, 7, 8, 3, 4, 5, 6, 2], [8, 2, 6, 1, 9, 5, 3, 4, 7], [3, 7, 4, 6, 8, 2, 9, 1, 5], [9, 5, 1, 7, 4, 3, 6, 2, 8], [5, 1, 9, 3, 2, 6, 8, 7, 4], [2, 4, 8, 9, 5, 7, 1, 3, 6], [7, 6, 3, 4, 1, 8, 2, 5, 9]],
    [[1, 5, 2, 4, 8, 9, 3, 7, 6], [7, 3, 9, 2, 5, 6, 8, 4, 1], [4, 6, 8, 3, 7, 1, 2, 9, 5], [3, 8, 7, 1, 2, 4, 6, 5, 9], [5, 9, 1, 7, 6, 3, 4, 2, 8], [2, 4, 6, 8, 9, 5, 7, 1, 3], [9, 1, 4, 6, 3, 7, 5, 8, 2], [6, 2, 5, 9, 4, 8, 1, 3, 7], [8, 7, 3, 5, 1, 2, 9, 6, 4]],
    [[5, 7, 8, 9, 2, 4, 1, 3, 6], [2, 9, 6, 3, 1, 7, 4, 8, 5], [1, 4, 3, 8, 6, 5, 2, 9, 7], [6, 3, 9, 4, 5, 2, 8, 7, 1], [7, 5, 2, 6, 8, 1, 3, 4, 9], [8, 1, 4, 7, 3, 9, 6, 5, 2], [9, 8, 1, 5, 4, 6, 7, 2, 3], [4, 2, 5, 1, 7, 3, 9, 6, 8], [3, 6, 7, 2, 9, 8, 5, 1, 4]]]

const NUM_OF_SOL = 5;
const COL = 9;
const ROW = 9;

// URLs
const startUrl = "http://localhost:3000/api/start";
const nextUrl = "http://localhost:3000/api/next";

// Button ids
const autoStartButton = 'btn-auto-start';
const startButton = 'btn-start';
const nextButton = 'btn-next';
const resetButton = 'btn-reset';
const failCheckbox = 'checkbox-fail';

// Variables
var convertedRow = 0;
var convertedCol = 0;
var array = [];
var uuid;
var simRunning;
var runAutomatically;
var lastCord;
var lastType;

// Functions
const create_UUID = () => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const convertCordToCube = (cord) => {
    switch (cord) {
        case 0:
            convertedRow = 0;
            convertedCol = 0;
            break;
        case 1:
            convertedRow = 0;
            convertedCol = 3;
            break;
        case 2:
            convertedRow = 0;
            convertedCol = 6;
            break;
        case 3:
            convertedRow = 3;
            convertedCol = 0;
            break;
        case 4:
            convertedRow = 3;
            convertedCol = 3;
            break;
        case 5:
            convertedRow = 3;
            convertedCol = 6;
            break;
        case 6:
            convertedRow = 6;
            convertedCol = 0;
            break;
        case 7:
            convertedRow = 6;
            convertedCol = 3;
            break;
        case 8:
            convertedRow = 6;
            convertedCol = 6;
            break;
    }
}

function setErrorMessage(msg) {
    let e = document.getElementById('error-div');
    e.innerHTML = msg;
    e.style = 'display: block;';
}

function removeErrorMessage() {
    let e = document.getElementById('error-div');
    e.innerHTML = '';
    e.style = 'display: none;';
}

function displayError(error) {
    cancelRun();
    if (error && error.response) {
        let { data } = error.response;
        setErrorMessage(data.error);
    } else {
        setErrorMessage('Error in request');
    }
}

const nextIteration = async () => {
    try {
        const data = {
            uuid,
            array,
            type: lastType,
            cord: lastCord,
        };
        var res = await axios.post(nextUrl, data);
        let { type, cord, isTrustful, board, trust } = res.data;
        drawServerTable(board);
        updateInfo(type, cord, isTrustful, trust);
    } catch (err) {
        displayError(err);
        let { board } = err.response.data;
        drawServerTable(board);
    }
}

//receiving the first response from the server- type:(row/col), cord(0-8)
const populateArrayByRowOrCol = (type, cord) => {
    array = [];
    switch (type) {
        case 'row':
            for (var i = 0; i < COL; i++) {
                array.push(+document.getElementById(cord + 'x' + i).innerText);
            }
            break;
        case 'col':
            for (var i = 0; i < ROW; i++) {
                array.push(+document.getElementById(i + 'x' + cord).innerText);
            }
            break;
        case 'cube':
            convertCordToCube(cord);
            let startCol = convertedCol;
            for (var i = 0; i < ROW / 3; i++) {
                for (var j = 0; j < COL / 3; j++) {
                    array.push(+document.getElementById(convertedRow + 'x' + convertedCol).innerText);
                    convertedCol++;
                }
                convertedCol = startCol;
                convertedRow++;
            }
            break;
        default:
            setErrorMessage(`Error request type: ${type}`);
            break;
    }
    lastCord = cord;
    lastType = type;
    const shouldFail = getFailCheck();
    if (shouldFail) {
        array[2] = 1;
        array[3] = 1;
    }
}

async function updateInfo(type, cord, isTrustful, trust) {
    setTrust(isTrustful);
    setTrustLevel(trust);
    if (isTrustful) {
        cancelRun();
        return;
    }
    populateArrayByRowOrCol(type, cord);
    if (runAutomatically) {
        await sleep(1500);
        nextIteration();
    }
}

function getClientCell(x, y) {
    return document.getElementById(x + 'x' + y);
}

function setClientCell(x, y, val) {
    var cell = getClientCell(x, y);
    cell.innerText = val;
}

function getServerCell(x, y) {
    return document.getElementById(`v${x}x${y}`);;
}

function setServerCell(x, y, val) {
    let cell = getServerCell(x, y);
    cell.innerHTML = val;
    cell.style = '';
}

function setServerCellMarked(x, y) {
    let cell = getServerCell(x, y);
    if (cell.innerHTML) {
        cell.style = 'background-color: beige;';
    }
}

function drawServerTable(board) {
    for (let i = 0; i < ROW; ++i) {
        for (let j = 0; j < COL; ++j) {
            let index = j + i * ROW;
            let val = board[index];
            if (val > 0) {
                setServerCell(i, j, val);
            }
        }
    }
    if (lastCord >= 0 && lastType) {
        switch (lastType) {
            case 'row':
                for (var i = 0; i < COL; i++) {
                    setServerCellMarked(lastCord, i);
                }
                break;
            case 'col':
                for (var i = 0; i < ROW; i++) {
                    setServerCellMarked(i, lastCord);
                }
                break;
            case 'cube':
                convertCordToCube(lastCord);
                let startCol = convertedCol;
                for (var i = 0; i < ROW / 3; i++) {
                    for (var j = 0; j < COL / 3; j++) {
                        setServerCellMarked(convertedRow, convertedCol);
                        convertedCol++;
                    }
                    convertedCol = startCol;
                    convertedRow++;
                }
                break;
            default:
                setErrorMessage(`Error request type: ${lastType}`);
                break;
        }
    }
}

function getFailCheck() {
    let x = document.getElementById(failCheckbox);
    if (x) return x.checked;
    return false;
}

function turnCheckboxOff() {
    let x = document.getElementById(failCheckbox);
    if (x)
        x.checked = false;
}

const sendStartRequest = async () => {
    try {
        const data = { uuid };
        const res = await axios.post(startUrl, data);
        let { type, cord, isTrustful, board, trust } = res.data;
        await updateInfo(type, cord, isTrustful, trust);
        drawServerTable(board);
    } catch (err) {
        console.log("Error sending request to the server");
    }
}

async function startSimulation() {
    simRunning = true;
    if (!runAutomatically) {
        turnButtonOn(nextButton);
    }
    turnButtonOff(autoStartButton);
    turnButtonOff(startButton);
    await sendStartRequest();
}

async function runAutoSim() {
    runAutomatically = true;
    await startSimulation();
}

function setTrust(val) {
    let value = val ? 'True' : 'False';
    document.getElementById('reli').innerHTML = value;
    if (val) {
        document.getElementById('reli').style = 'font-weight: bold; color: green;';
    } else {
        document.getElementById('reli').style = '';
    }
}

function setTrustLevel(val) {
    let value = val ? val * 100 : 0;
    let number = String(value);
    if (number.length > 5) number = number.substring(0, 5);
    document.getElementById('trust-level').innerHTML = number;
}

function turnButtonOn(id) {
    document.getElementById(id).disabled = false;
}

function turnButtonOff(id) {
    document.getElementById(id).disabled = true;
}

function setSudokuId(id) {
    document.getElementById('sudoku-id').innerHTML = id;
}

function cancelRun() {
    if (simRunning) {
        simRunning = false;
        turnButtonOn(resetButton);
        turnButtonOff(nextButton);
    }
}

function reset() {
    uuid = create_UUID();
    //Filling the board with 1 out of possible solutions
    var randomSol = Math.floor(Math.random() * NUM_OF_SOL);
    for (var i = 0; i < ROW; i++) {
        for (var j = 0; j < COL; j++) {
            setClientCell(i, j, sol[randomSol][i][j]);
            setServerCell(i, j, null);
        }
    }
    setSudokuId(randomSol + 1);
    setTrust(false);
    setTrustLevel(0);
    simRunning = false;
    runAutomatically = false;
    turnButtonOff(resetButton);
    turnButtonOff(nextButton);
    turnButtonOn(startButton);
    turnButtonOn(autoStartButton);
    removeErrorMessage();
    turnCheckboxOff(failCheckbox);
}

(function (window, document, undefined) {
    window.onload = reset;
})(window, document, undefined);