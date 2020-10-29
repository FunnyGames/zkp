
let sol = 
    [[[3,8,1,6,7,2,5,4,9],[4,9,6,8,1,5,2,3,7],[2,7,5,9,3,4,6,8,1],[1,3,7,5,8,6,4,9,2],[6,2,4,1,9,7,3,5,8],[8,5,9,4,2,3,7,1,6],[5,6,8,7,4,1,9,2,3],[7,1,2,3,5,9,8,6,4],[9,4,3,2,6,8,1,7,5]],
    [[4,2,7,6,3,1,9,8,5],[6,5,8,4,2,9,7,1,3],[3,1,9,7,8,5,2,4,6],[1,3,4,5,6,2,8,9,7],[5,7,2,8,9,3,4,6,1],[8,9,6,1,4,7,3,5,2],[9,8,3,2,1,6,5,7,4],[7,4,1,3,5,8,6,2,9],[2,6,5,9,7,4,1,3,8]],
    [[4,3,5,2,6,9,7,8,1],[6,8,2,5,7,1,4,9,3],[1,9,7,8,3,4,5,6,2],[8,2,6,1,9,5,3,4,7],[3,7,4,6,8,2,9,1,5],[9,5,1,7,4,3,6,2,8],[5,1,9,3,2,6,8,7,4],[2,4,8,9,5,7,1,3,6],[7,6,3,4,1,8,2,5,9]],
    [[1,5,2,4,8,9,3,7,6],[7,3,9,2,5,6,8,4,1],[4,6,8,3,7,1,2,9,5],[3,8,7,1,2,4,6,5,9],[5,9,1,7,6,3,4,2,8],[2,4,6,8,9,5,7,1,3],[9,1,4,6,3,7,5,8,2],[6,2,5,9,4,8,1,3,7],[8,7,3,5,1,2,9,6,4]],
    [[5,7,8,9,2,4,1,3,6],[2,9,6,3,1,7,4,8,5],[1,4,3,8,6,5,2,9,7],[6,3,9,4,5,2,8,7,1],[7,5,2,6,8,1,3,4,9],[8,1,4,7,3,9,6,5,2],[9,8,1,5,4,6,7,2,3],[4,2,5,1,7,3,9,6,8],[3,6,7,2,9,8,5,1,4]]]
const NUM_OF_SOL = 4
const COL = 9;
const ROW = 9;
const startUrl = "http://localhost:3000/api/start"
const nextUrl = "http://localhost:3000/api/next"
var convertedRow = 0;
var convertedCol = 0;
var array = []
var uuid = "123"

const create_UUID = () =>{
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
const convertCordToCube = (cord) =>{
    switch(cord){
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
//receiving the other responses from the server until he believes us
const drawServerTable = (type, cord, board, isTrustful) => {
    //Drawing the server board
    for(var i = 0 ; i < ROW * ROW ; i++){
        for(var j = 0 ; j < COL; j++){ 
            var cell = document.getElementById('v' + i + 'x' + j);
            if(typeof cell !== 'undefined' && cell !== null) {
                cell.innerHTML = board[i];
              }
            //cell.innerText = board[i]

         }
    }
    document.getElementById("reli").value = isTrustful;
    getRowOrCol(type, cord, isTrustful)

}
const nextIteration = async (type, cord, array) => {
    try{
        const data = {
            uuid,
            array,
            type,
            cord
        }
        var res = await axios.post(nextUrl, data);
        console.log(res.data);
        drawServerTable(res.data.type, res.data.cord, res.data.board, res.data.isTrustful)
    }catch(err){
        console.log(err.message)
    }
}
//receiving the first response from the server- type:(row/col), cord(0-8)
const getRowOrCol = (type, cord, isTrustful) => {
    if(isTrustful){
        console.log(isTrustful)
        document.getElementById("reli").value = isTrustful;
        return;
    }
    console.log(type + " " + cord)
        switch(type){
            case 'row':
                array = [];
                for(var i = 0 ; i < COL ; i++){
                    array.push(+document.getElementById(cord + 'x' + i).innerText)
                }
                nextIteration(type, cord, array)
                break;
            case 'col':
                array = [];
                for(var i = 0 ; i < ROW ; i++){
                    array.push(+document.getElementById(i + 'x' + cord).innerText)
                }
                nextIteration(type, cord, array)
                break;
            case 'cube':
                array = [];
                convertCordToCube(cord);
                for(var i = 0 ; i < ROW / 3 ; i++){
                    for(var j = 0 ; j < COL / 3 ; j++){
                        array.push(+document.getElementById(convertedRow + 'x' + convertedCol).innerText)
                        convertedCol++;
                    }
                    convertedCol = (convertedCol % 3) + 3
                    convertedRow++;
                }
                nextIteration(type, cord, array)
                break;
             default:
                 console.log('ERROR GETTING DATA');
                 break;   
            }

}
//Sending initial request to the server
const sendRequest = async () => {
    try{
        const data = {uuid}
        const res = await axios.post(startUrl, data);
        getRowOrCol(res.data.type, res.data.cord, res.data.isTrustful);
    }catch(err){
        console.log("Error sending request to the server");
    }
}

(function(window, document, undefined){
    window.onload = init;
    //Filling the board with 1 out of 4 possible solutions 
    function init(){
      //  uuid = create_UUID();
        var randomSol = Math.floor(Math.random() * NUM_OF_SOL); 
        for(var i = 0 ; i < ROW ; i++){
            for(var j = 0 ; j < COL; j++){ 
                var cell = document.getElementById(i + 'x' + j);
                cell.innerText = sol[randomSol][i][j]

             }
        }
      
    }
        
})(window, document, undefined);