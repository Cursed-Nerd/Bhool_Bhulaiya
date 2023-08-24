
function rand(max){
    return Math.floor(Math.random() * max);
}

/* Shuffling an array using Fischer-Yates algo.
    generates a random number from (0-i) , let's say 'j' & swap the values at 'j' and 'i' */
function shuffle(a){
    for(let i = a.length-1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function changeBrightness(factor,sprite){
    /* The HTML <canvas> element is used to draw graphics, on the fly, via JavaScript.
    The <canvas> element is only a container for graphics. You must use JavaScript to actually draw the graphics.*/
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    /* The canvas context is an object with properties and methods that you can use to "render graphics" inside the canvas element.
    Each canvas element can only have one context. 
    If we use the getContext() method multiple times, it will return a reference to the same context object.*/
    var context = virtCanvas.getContext("2d");
    // The drawImage() method draws an image, canvas, or video onto the canvas.
    context.drawImage(sprite,0,0,500,500); // sprite is an image, which starts from (0,0) & resizes to (height,width :: 500,500)
    
    // retrieves the image data (pixel values) from the canvas. This data contains information about the colors of each pixel in the canvas.
    var imgData = context.getImageData(0,0,500,500);   // imgData is an array
    
    
    /*The following loop iterates through each pixel in the imgData array. The loop variable i increments by 4 in each iteration 
      because image data is stored in a format where each pixel is represented by four consecutive values: red, green, blue, and alpha (transparency).*/
      for(let i = 0; i < imgData.data.length; i+=4){
          imgData.data[i] = imgData.data[i] * factor;
          imgData.data[i+1] = imgData.data[i+1] * factor;
          imgData.data[i+2] = imgData.data[i+2] * factor;
        }
        context.putImageData(imgData,0,0); //  puts the modified image data back onto the canvas, updating the canvas with the adjusted pixel values.
        
        var spriteOutput = new Image(); //  creates a new HTML Image element(<img>). This will be used to hold the modified image.
        spriteOutput.src = virtCanvas.toDataURL(); // sets the src attribute of the <img> to the data URL representation of the canvas
        virtCanvas.remove(); // removes the temporary canvas from the DOM
        return spriteOutput; // returns the new image of adjusted brightness
    }
    
function displayVictoryMess(moves){
    document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps."; // It will show: "Congrats,u copmpleted the maze. u moved _ steps"
    toggleVisability("Message-Container");
}

function toggleVisability(id){
    var curr = document.getElementById(id);
    if(curr.style.visibility == "visible"){
        curr.style.visibility = "hidden";
    }
    else{
        curr.style.visibility = "visible";
    }
}

function Maze(Width,Height){
    var mazeMap; // 2d array
    var width = Width;
    var height = Height;
    var startCord, endCord;
    var dirns = ["n", "s", "e", "w"]; // array
    var modDir = { // map
        n: { // y = -1 for north because the 'origin'(0,0) of "coordinate sysytem in JS" is at top left corner instead of bottom left corner of a box
            y: -1,
            x: 0,
            o: "s" // o means opposite. To tell where they came from
        },
        s: {
            y: 1,
            x: 0,
            o: "n"
        },
        e: {
            y: 0,
            x: 1,
            o: "w"
        },
        w: {
            y: 0,
            x: -1,
            o: "e"
        }
    };

    this.map = function(){
        return mazeMap;
    };
    this.startCord = function(){
        return startCord;
    };
    this.endCord = function(){
        return endCord;
    };

    function genMap(){ // making the initial 2d array
        mazeMap = new Array(height);
        for(y = 0; y < height; y++){
            mazeMap[y] = new Array(width);
            for(x = 0; x < width; ++x){
                mazeMap[y][x] = {
                    n: false,
                    s: false,
                    e: false,
                    w: false,
                    visited: false,
                    priorPos: null
                };
            }
        }
    }

    // Let's populate the maze
    function defineMaze(){
        var isComp = false;
        var move = false;
        var cellsVisited = 1;
        var numLoops = 0;
        var maxLoops = 0;
        var numCells = width * height;
        var pos = {
            x: 0,
            y: 0
        };

        // Loop runs untill maze is completely generated
        while(!isComp){
            move = false;
            mazeMap[pos.x][pos.y].visited = true;

            if(numLoops >= maxLoops){
                shuffle(dirns);
                maxLoops = Math.round(rand(height/8)); // ************TRY CHANGING IT*****************
                numLoops = 0;
            }
            numLoops++;
            for(index = 0; index < dirns.length; index++){ // dirns.length = 4
                var direction = dirns[index];
                var nx = pos.x + modDir[direction].x;
                var ny = pos.y + modDir[direction].y;

                // Check if new pos is within grid or not
                if(nx >= 0 && nx < width && ny >= 0 && ny < height){
                    if(!mazeMap[nx][ny].visited){
                        mazeMap[pos.x][pos.y][direction] = true;
                        mazeMap[nx][ny][modDir[direction].o] = true;

                        mazeMap[nx][ny].priorPos = pos;
                        pos = {
                            x: nx,
                            y: ny
                        };
                        cellsVisited++;
                        move = true;
                        break;
                    }
                }
            }
            if(!move){
                pos = mazeMap[pos.x][pos.y].priorPos;
            }
            if(numCells == cellsVisited){
                isComp = true;
            }
        }
    }

    function defineStartEnd(){
        switch(rand(4)){
            case 0:
                startCord = { x: 0, y: 0 };
                endCord = { x: height - 1, y: width -1};
                break;
            case 1:
                startCord = { x: 0, y: width-1};
                endCord = { x: height-1, y: 0};
                break;
            case 2:
                startCord = { x: height-1, y: 0};
                endCord = { x: 0, y: width - 1};
                break;
            case 3:
                startCord = { x: height-1, y: width-1};
                endCord = { x: 0, y: 0};
                break;
        }
    }
    genMap();
    defineStartEnd();
    defineMaze();
}

function DrawMaze(Maze, ctx, cellsize, endSprite = null){
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    ctx.lineWidth = cellSize / 40;

    // This will help us change the difficulty of maze
    this.redrawMaze = function(size){
        cellSize = size;
        ctx.lineWidth = cellSize / 50;
        drawMap();
        drawEndMethod();
    }

    // Drawing Walla
    function drawCell(xCord, yCord, cell){
        var x = xCord * cellSize;
        var y = yCord * cellSize;

        // If a dirn of cell is marked as false, .:. there is no dirn in that direction
        if(cell.n == false){
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
        }
        if(cell.s == false){
            ctx.beginPath();
            ctx.moveTo(x,y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if(cell.e == false){
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if(cell.w == false){
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        }
    }

    function drawMap(){
        for(x = 0; x < map.length; x++){
            for(y = 0; y < map[x].length; y++){
                drawCell(x,y,map[x][y]);
            }
        }
    }
    
    function drawEndFlag(){
        var cord = Maze.endCord();
        var gridSize = 4;
        var fraction = (cellSize / gridSize) - 2;
        var colorSwap = true;
        // row iteration
        for(let y = 0; y < gridSize; y++){
            // to start each row with different color of it's prev row
            if(gridSize%2 == 0){
                colorSwap = !colorSwap;
            }
            // col iteration
            for(let x = 0; x < gridSize; x++){
                ctx.beginPath();
                // ctx.rect makes a rectangle with dimensions
                // rect(left padding (or x-coordinate of the top-left corner of the rectangle), top padding (or y-coordinate of the top-left corner of the rectangle), length, breadth)
                ctx.rect(
                    (cord.x * cellSize) + (x * fraction) + 4.5,
                    (cord.y * cellSize) + (y * fraction) + 4.5,
                    fraction,
                    fraction
                    );
                    if(colorSwap){
                        // black with oapcity 0.8
                        ctx.fillStyle = "rgba(0,0,0,0.8)";
                    }
                    else{
                        // white with opacity 0.8
                        ctx.fillStyle = "rgba(255,255,255,0.8)";
                    }
                    ctx.fill();
                    // swap color again for next col
                    // feels like a chessboard is in the making
                    colorSwap = !colorSwap;
                }
            }
        }
        
        // makes the image at endpoint
        function drawEndSprite(){
            // offsets are displacements
            var offsetLeft = cellSize / 50;
            var offsetRight = cellSize / 25;
            var cord = Maze.endCord();
            // endsprite is an image, which starts from (2,2) & resizes to (height,width)
            ctx.drawImage(
                endSprite, // image
                2,         // sx: x cord of start clipping
                2,         // sy: y cord of start clipping
                endSprite.width, // width of clipped image (given)
                endSprite.height, // height of clipped image (given)
                (cord.x * cellSize) + offsetLeft, // x coordinate where to place the image on the canvas
                (cord.y * cellSize) + offsetRight, // y coordinate where to place the image on the canvas
                cellSize - offsetRight, // The width of the image to use
                cellSize - offsetRight  // The height of the image to use
            );
        }

        //This call to clearRect effectively erases everything on the canvas within the specified rectangle, 
        //creating a blank canvas area
        function clear(){
            var canvasSize = cellSize * map.length;
            ctx.clearRect(0,0,canvasSize,canvasSize);
        }
        
        // if the image given to us is NULL, then we will just make a chess like flag
        // else we will use that image and put it on the endpoint    
        if(endSprite != null){
            drawEndMethod = drawEndSprite;
        }
        else{
            drawEndMethod = drawEndFlag;
        }
    clear();
    drawMap();
    drawEndMethod();
}

// This will define how the player will look
// if image provided, then use that, else a circle
function Player(maze,c,_cellsize,onComplete,sprite = null){
    var ctx = c.getContext("2d");
    var drawSprite;
    var moves = 0;
    drawSprite = drawSpriteCircle;
    if(sprite != null){
        drawSprite = drawSpriteImg;
    }
    var player = this;
    var map = maze.map();
    var cellCords = {
        x: maze.startCord().x,
        y: maze.startCord().y
    };
    var cellSize = _cellsize;
    var halfCellSize = cellSize/2;
    
    this.redrawPlayer = function(_cellsize){
        cellSize = _cellsize;
        drawSpriteImg(cellCords);
    };
    
    // representing player as a yellow colored circle, on whatsover cord is provided
    function drawSpriteCircle(cord){
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(
                ((cord.x + 1)*cellSize) - halfCellSize, // x
                ((cord.y + 1)*cellSize) - halfCellSize, // y, where {x,y} = center of circle
                halfCellSize-2, // radius
                0, // starting angle
                2*Math.PI // ending angle
            );
            ctx.fill();
            if(cord.x === maze.endCord().x && cord.y === maze.endCord().y){
                //displayVictoryMess(moves);
                onComplete(moves);
                player.unbindKeyDown();
            }
    }
        
    function drawSpriteImg(cord){
        var offsetLeft = cellSize/50;
        var offsetRight = cellSize/25;
        ctx.drawImage(
            sprite, // img
            0,      // x cord of where to start clipping from
            0,      // y cord of where to start clipping from
            sprite.width, // img width
            sprite.height, // img height
            (cord.x * cellSize) + offsetLeft, // Xn
            (cord.y * cellSize) + offsetLeft, // Yn, {Xn,Yn} = where to put the image on canvas
            cellSize - offsetRight, // how much width to use of cell
            cellSize - offsetRight // how much height to use of cell
        );
        if(cord.x === maze.endCord().x && cord.y === maze.endCord().y){
            //displayVictoryMess(moves);
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function removeSprite(cord){
        var offsetLeft = cellSize/50;
        var offsetRight = cellSize/25;
        ctx.clearRect(
            (cord.x * cellSize) + offsetLeft,
            (cord.y * cellSize) + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    // this is a dynamic function, which makes the player move or atleast makes it look like that
    function check(e){
        var cell = map[cellCords.x][cellCords.y];
        moves++;
        switch(e.keyCode){
            case 65: // Acii for 'A'(left)
            case 37: // west
                if(cell.w == true){
                    removeSprite(cellCords);
                    cellCords = {
                        x: cellCords.x - 1,
                        y: cellCords.y
                    };
                    drawSprite(cellCords);
                }
                break;
            case 87:  // Ascii for 'W'(up)
            case 38: // north
                if(cell.n == true){
                    removeSprite(cellCords);
                    cellCords = {
                        x: cellCords.x,
                        y: cellCords.y - 1
                    };
                    drawSprite(cellCords);
                }
                break;
            case 68: // Ascii for 'D'(right)
            case 39: // east
                if(cell.e == true){
                    removeSprite(cellCords);
                    cellCords = {
                        x: cellCords.x + 1,
                        y: cellCords.y
                    };
                    drawSprite(cellCords);
                }
                break;
            case 83: // Ascii for 'S'(down)
            case 40: // south
                if(cell.s == true){
                    removeSprite(cellCords);
                    cellCords = {
                        x: cellCords.x,
                        y: cellCords.y + 1
                    };
                    drawSprite(cellCords);
                }
                break;
        }
    }
    this.bindKeyDown = function(){
        // Listens when any key is pressed
        window.addEventListener("keydown",check,false);
        
        // This block sets up swipe gesture handling using the jQuery Mobile library.
        $("#view").swipe({
            swipe: function(
                event,
                direction,
                distance,
                duration,
                fingerCount,
                fingerData
            )   {
                console.log(direction);
                switch(direction){
                    case "up":
                        check({
                            keyCode: 38
                        });
                    break;
                    case "down":
                        check({
                            keyCode: 40
                    });
                    break;
                    case "left":
                        check({
                            keyCode: 37
                    });
                    break;
                    case "right":
                        check({
                            keyCode: 39
                        });
                    break;
                    }
            },
            threshold: 0
        });
    };

    // When work is done, listeners are removed
    this.unbindKeyDown = function(){
        window.removeEventListener("keydown",check,false);
        $("#view").swipe("destroy");
    };

    drawSprite(maze.startCord());
    this.bindKeyDown();
}

//--------------------------------------------------------------------------------------------------------------------------------------------------
var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;

window.onload = function(){
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if(viewHeight < viewWidth){
        ctx.canvas.width = viewHeight - (viewHeight/100);
        ctx.canvas.height = viewHeight - (viewHeight/100);
    }
    else{
        ctx.canvas.width = viewWidth - (viewWidth/100);
        ctx.canvas.height = viewWidth - (viewWidth/100);
    }
    
    var completeOne = false;
    var completeTwo = false;
    var isComplete = () => {
        if(completeOne === true && completeTwo === true){
            console.log("Runs");
            setTimeout(function(){
                makeMaze();
            }, 500);
        }
    };
    sprite = new Image();
    sprite.src = "man.png";
    sprite.onload = function(){
        sprite = changeBrightness(1.2,sprite);
        completeOne = true;
        console.log(completeOne);
        isComplete();
    };
    
    finishSprite = new Image();
    finishSprite.src = "house.png" ;
    finishSprite.onload = function(){
        finishSprite = changeBrightness(1.1,finishSprite);
        completeTwo = true;
        console.log(completeTwo);
        isComplete();
    };
};

window.onresize = function(){
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if(viewHeight < viewWidth){
        ctx.canvas.width = viewHeight - (viewHeight/100);
        ctx.canvas.height = viewHeight - (viewHeight/100);
    }
    else{
        ctx.canvas.width = viewWidth - (viewWidth/100);
        ctx.canvas.height = viewWidth - (viewWidth/100);
    }
    cellSize = mazeCanvas.width / difficulty;
    if(player != null){
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);
    }
};

function makeMaze(){
    if(player != undefined){
        player.unbindKeyDown();
        player = null;
    }
    var e = document.getElementById("diffSelect");
    difficulty = e.options[e.selectedIndex].value;
    cellSize = mazeCanvas.width / difficulty;
    
    maze = new Maze(difficulty,difficulty);
    draw = new DrawMaze(maze,ctx,cellSize,finishSprite);
    player = new Player(maze,mazeCanvas,cellSize,displayVictoryMess,sprite);
    if(document.getElementById("mazeContainer").style.opacity < "100"){
        document.getElementById("mazeContainer").style.opacity = "100";
    }
}
