var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

const xGridOffset = 450;
const yGridOffset = 250;

var board = [];
var solution = [
    [1,0,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,1]];
var cols;
var rows;
var xWidth;
var yHeight;

function updateColsRows(){
    rows = solution.length;
    cols = solution[0].length;
    xWidth = 500 / cols;
    yHeight = 500 / rows;
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isFilled = false;
        this.isXed = false;
    }

    draw() {
        ctx.fillStyle = "gray";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;    
        var xOffset = this.x * xWidth + xGridOffset;
        var yOffset = this.y * yHeight + yGridOffset;

        if(this.isFilled) {
            ctx.fillRect(xOffset+1, yOffset+1, xWidth-2, yHeight-2);
        }
        else if(this.isXed) {
            ctx.strokeRect(xOffset, yOffset, xWidth, yHeight);
            ctx.font = "bold 30px Arial";
            ctx.fillText("X", xOffset + 15, yOffset + 35);
        }
        else{
            ctx.fillStyle = "white";
            ctx.fillRect(xOffset, yOffset, xWidth, yHeight);
            ctx.strokeRect(xOffset, yOffset, xWidth, yHeight);
        }

        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;    
    }
}

newBoard();

function newBoard(){
    updateColsRows();

    board = [];
    for (var i = 0; i < cols; i++) {
        var currCol = [];
        for (var j = 0; j < rows; j++) {
            currCol.push(new Cell(i, j));
        }
        board.push(currCol);
    }

    drawBoard();
}

function drawBoard() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 30px Arial";
    //draw the board
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            board[i][j].draw();
        }
    }


    //draw the columns solution
    for (var i = 0; i < cols; i++) {
        var currStreak = 0;
        var breaks = 0;
        var drawList = [];
        for (var j = 0; j < rows; j++) {
            if(solution[j][i] == 1){
                currStreak++;
            }
            else if(solution[j][i] == 0 && currStreak > 0){
                drawList.push(currStreak);
                currStreak = 0;
                breaks++;
            }
            
            if(j == cols - 1){
                if(currStreak > 0){
                    drawList.push(currStreak);                    
                }
                else if (breaks == 0){
                    drawList.push("0");
                }
            }
        }

        drawList.reverse();

        //TODO make these dynamic to the size of the board
        for(var k = 0; k < drawList.length; k++){
            if(drawList[k] > 9){
                ctx.fillText(drawList[k], xGridOffset + (xWidth * i), yGridOffset - 5 - (30 * k));
            }
            else{
                ctx.fillText(drawList[k], xGridOffset + xWidth/(2.5) + (xWidth * i), yGridOffset - 5 - (30 * k));
            }
        }
    }


    //draw the rows solution
    for (var j = 0; j < rows; j++) {
        var currStreak = 0;
        var breaks = 0;
        var drawList = [];
        for (var i = 0; i < cols; i++) {
            if(solution[j][i] == 1){
                currStreak++;
            }
            else if(solution[j][i] == 0 && currStreak > 0){
                drawList.push(currStreak);
                currStreak = 0;
                breaks++;
            }
            
            if(i == cols - 1){
                if(currStreak > 0){
                    drawList.push(currStreak);                    
                }
                else if (breaks == 0){
                    drawList.push("0");
                }
            }
        }

        drawList.reverse();

        //TODO make these dynamic to the size of the board
        for(var k = 0; k < drawList.length; k++){

            if(drawList[k] > 9){
                ctx.fillText(drawList[k], xGridOffset - 25 - xWidth/(2.5) - (50 * k), yGridOffset + 35 + (yHeight * j));
            }
            else{
                ctx.fillText(drawList[k], xGridOffset - 25 - xWidth/(2.5) - (35 * k), yGridOffset + 35 + (yHeight * j));
            }
        }
    }
}

function CheckForComplete(){
    ///TODO make this check for more than one correct solution
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if((solution[j][i] != 1 && board[i][j].isFilled) || (solution[j][i] == 1 && !board[i][j].isFilled)){
                return;
            }
        }
    }

    ctx.font = "bold 30px Arial";
    ctx.fillText("CORRECT", 1000, 500);
}

function importSolution(){
    var sol = document.getElementById("solution").value;
    if(sol[0] != "["){
        var x = sol.indexOf("x");
        var board = [];
        for(var i = 0; i < sol.substring(0, x); i++){
            var currRow = [];
            for(var j = 0; j < sol.substring(x+1); j++){
                currRow.push(0);
            }
            board.push(currRow);
        }
        solution = board;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        newBoard();
    }
    else{
        solution = sol.split("],");
        for(var r = 0; r < solution.length; r++){
            var currRow = [];
            var i = 0;
            while(i < solution[r].length){
                if(solution[r][i] == "0"){
                    currRow.push(0);
                }
                if(solution[r][i] == "1"){
                    currRow.push(1);
                }
                i++;
            }
            solution[r] = currRow;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        newBoard();
    }

    
}

function exportBoard(){
    var out = ""
    for(var i = 0; i < cols; i++){
        out += "[";
        for(var j = 0; j < rows; j++){
            if(board[j][i].isFilled){
                out += "1,";
            }
            else{
                out += "0,";
            }
        }
        out = out.substring(0, out.length - 1);
        out += "],\n";
    }
    out = out.substring(0, out.length - 2);
    document.getElementById("solution").value = out;
}

drawBoard();

var mouse = {
    x: undefined,
    y: undefined
}

var isLeftDragging = false;
var isRightDragging = false;

window.addEventListener('mousedown', function(e) {
    if (isLeftDragging || isRightDragging) {
        return; // Prevent starting a new drag if already dragging
    }
    if (e.button === 0) { // Left mouse button
        isLeftDragging = true;
        mouse.x = e.offsetX;
        mouse.y = e.offsetY;
    } else if (e.button === 2) { // Right mouse button
        e.preventDefault();
        isRightDragging = true;
        mouse.x = e.offsetX;
        mouse.y = e.offsetY;
    }
});

var lastCell = undefined;
var deleting = true;
var drawing = true;

window.addEventListener('mousemove', function(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    if (isLeftDragging){
        if((mouse.x - xGridOffset) / xWidth >= 0 && (mouse.x - xGridOffset) / xWidth < cols && (mouse.y - yGridOffset) / yHeight >= 0 && (mouse.y - yGridOffset) / yHeight < rows) {
            var clickedCell = board[Math.floor((mouse.x - xGridOffset) / xWidth)][Math.floor((mouse.y - yGridOffset) / yHeight)];
            if(!clickedCell.isXed && clickedCell != lastCell){
                if(clickedCell.isFilled && deleting){
                    clickedCell.isFilled = false;
                    drawing = false;
                }
                else if(drawing){
                    clickedCell.isFilled = true;
                    deleting = false;
                }
                drawBoard();
                lastCell = clickedCell;
            }
        }
    }

    if (isRightDragging){
        e.preventDefault();
        if((mouse.x - xGridOffset) / xWidth >= 0 && (mouse.x - xGridOffset) / xWidth < cols && (mouse.y - yGridOffset) / yHeight >= 0 && (mouse.y - yGridOffset) / yHeight < rows) {
            var clickedCell = board[Math.floor((mouse.x - xGridOffset) / xWidth)][Math.floor((mouse.y - yGridOffset) / yHeight)];
            if(!clickedCell.isFilled){
                if(clickedCell.isXed && deleting){
                    clickedCell.isXed = false;
                    drawing = false;
                }
                else if(drawing){
                    clickedCell.isXed = true;
                    deleting = false;
                }
                drawBoard();
            }
        }
    }
});

window.addEventListener('mouseup', function(e) {
    isLeftDragging = false;
    isRightDragging = false;
    lastCell = undefined;
    deleting = true;
    drawing = true;
    CheckForComplete();
});

window.addEventListener('mouseout', () => {
    isLeftDragging = false;
    isRightDragging = false;
});

window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    if((mouse.x - xGridOffset) / xWidth >= 0 && (mouse.x - xGridOffset) / xWidth < cols && (mouse.y - yGridOffset) / yHeight >= 0 && (mouse.y - yGridOffset) / yHeight < rows) {
        var clickedCell = board[Math.floor((mouse.x - xGridOffset) / xWidth)][Math.floor((mouse.y - yGridOffset) / yHeight)];
        if(!clickedCell.isFilled){
            if(clickedCell.isXed && deleting){
                clickedCell.isXed = false;
                drawing = false;
            }
            else if(drawing){
                clickedCell.isXed = true;
                deleting = false;
            }
            drawBoard();
        }
    }
});

function set3x3Visible(){
    document.getElementById("l3x3").style.display = "block";
    document.getElementById("l5x5").style.display = "none";
    document.getElementById("l10x10").style.display = "none";
    document.getElementById("l15x15").style.display = "none";
    document.getElementById("Manual").style.display = "none";
}

function set5x5Visible(){
    document.getElementById("l3x3").style.display = "none";
    document.getElementById("l5x5").style.display = "block";
    document.getElementById("l10x10").style.display = "none";
    document.getElementById("l15x15").style.display = "none";
    document.getElementById("Manual").style.display = "none";
}

function set10x10Visible(){
    document.getElementById("l3x3").style.display = "none";
    document.getElementById("l5x5").style.display = "none";
    document.getElementById("l10x10").style.display = "block";
    document.getElementById("l15x15").style.display = "none";
    document.getElementById("Manual").style.display = "none";
}

function set15x15Visible(){
    document.getElementById("l3x3").style.display = "none";
    document.getElementById("l5x5").style.display = "none";
    document.getElementById("l10x10").style.display = "none";
    document.getElementById("l15x15").style.display = "block";
    document.getElementById("Manual").style.display = "none";
}

function setManualVisible(){
    document.getElementById("l3x3").style.display = "none";
    document.getElementById("l5x5").style.display = "none";
    document.getElementById("l10x10").style.display = "none";
    document.getElementById("l15x15").style.display = "none";
    document.getElementById("Manual").style.display = "block";
}

function set3x3Easy(){
    solution = [
        [1,1,1],
        [1,1,1],
        [1,1,1]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set3x3Medium(){
    solution = [
        [0,1,0],
        [1,0,1],
        [0,1,0]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set3x3Hard(){
    solution = [
        [0,1,0],
        [1,0,1],
        [1,0,0]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set5x5Easy(){
    solution = [
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [1,1,1,1,1]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set5x5Medium(){
    solution = [
        [1,0,1,1,1],
        [1,1,1,0,0],
        [1,1,1,0,0],
        [1,1,0,0,0],
        [0,1,0,0,0]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set5x5Hard(){
    solution = [
        [0,1,1,1,0],
        [0,1,0,1,0],
        [1,0,0,1,1],
        [1,0,0,0,0],
        [1,0,0,0,1]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set10x10Easy(){
    solution = [
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set10x10Medium(){
    solution = [
        [1, 0, 0, 1, 1, 0, 0, 0, 1, 1],
        [1, 0, 0, 1, 0, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 0],
        [1, 0, 0, 1, 1, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0],
        [1, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [1, 0, 0, 1, 1, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set10x10Hard(){
    solution = [
        [1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
        [1, 1, 1, 0, 0, 1, 0, 0, 1, 1],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 1, 1, 1, 0, 0, 1],
        [0, 1, 1, 0, 1, 0, 0, 1, 1, 0],
        [1, 0, 0, 1, 0, 1, 1, 0, 0, 1],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
        [1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set15x15Easy(){
    solution = [
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0],
        [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
        [1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1],
        [1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set15x15Medium(){
    solution = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}

function set15x15Hard(){
    solution = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newBoard();
}