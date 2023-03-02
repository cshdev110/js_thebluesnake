const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "blue";
const snakeBorder = "lightgreen";
const foodColor = "green";
const unitSize = 25;
const keyP = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

let snake = [
    {
        x:unitSize * 4,
        y:0
    },
    {
        x:unitSize * 3,
        y:0
    },
    {
        x:unitSize * 2,
        y:0
    },
    {
        x:unitSize,
        y:0
    },
    {
        x:0,
        y:0
    }
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

console.log(`gameWidth: ${gameWidth}`);
console.log(`unitSize: ${unitSize}`);


gameStart();
// createFood();
// drawFood();

function gameStart(){
    running = true;
    scoreText.textContext = score;
    createFood();
    drawFood();
    nextTick();
}

function nextTick(){
    if(running){
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    }
    else{
        displayGameOver();
    }
}

function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood(){
    function randomFood(min, max){
        /**All this little math to make the random num being a number divisible by 25.
         * Math.round is very important make this work.
         * max arguments is gameWidth - unitSize which means 500 - 25 = 475, so the food
         * won't get out of the canvas #gameBoard.
        */
        const randNum = Math.round((Math.random()* (max - min) + min)/unitSize) * 25;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);    
    console.log(`foodX: ${foodX}`);
}

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake(){
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    }
    snake.unshift(head);
    /**If food is eaten*/
    if (snake[0].x == foodX && snake[0].y == foodY) {
        score++;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
    // console.log(`snake head x: ${snake[0].x}`);
    // console.log(`snake head y: ${snake[0].y}`);
}

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

function changeDirection(event){
    const keyPressed = event.keyCode;
    console.log(keyPressed);

    const goingLEFT = (xVelocity == -unitSize);
    const goingUP = (yVelocity == -unitSize);
    const goingRIGHT = (xVelocity == unitSize);
    const goingDOWN = (yVelocity == unitSize);

    switch(true){
        case(keyPressed == keyP.LEFT && !goingRIGHT):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == keyP.UP && !goingDOWN):
            yVelocity = -unitSize;
            xVelocity = 0;
            break;
        case(keyPressed == keyP.RIGHT && !goingLEFT):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == keyP.DOWN && !goingUP):
            yVelocity = unitSize;
            xVelocity = 0;
    }
}

function checkGameOver(){
    switch(true){
        case(snake[0].x < 0):
            running = false;
            break;
        case(snake[0].x >= gameWidth):
            running = false;
            break;
        case(snake[0].y < 0):
            running = false;
            break;
        case(snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(i = 3; i < snake.length; i++){
        if((snake[0].x == snake[i].x) && (snake[0].y == snake[i].y)){
            running = false;
            break;
        }        
    }
}

function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fullStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth/2, gameHeight/2);
}

function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [{x:unitSize * 4, y:0 }, {x:unitSize * 3, y:0}, {x:unitSize * 2, y:0}, {x:unitSize, y:0}, {x:0, y:0}];
    gameStart();
}