/* Details for finish the game

    ¤Change the color of the ball when it hit the paddle Done
    ¤More points for brick. Done
    ¤Show the score in the final alert of the game . Done
    ¤Adjust the bounds of the canvas to when the gamer use the mouse get the paddle always get seen. Done
    ¤Change the number of lives. Done
    ¤Change the ball trajectory when it hit the paddle. Done
    ¤Controll the start of the game. Done
    ¤Make an opacity img-background for canvas
    ¤Detail footer

*/

//Def the canvas and the context of game
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Def the initial values of the ball
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;

//Add how much pixels gona be refresh the ball(Control of Velocity)
var dx = 2;
var dy = -2;

//Paddle Size
var paddleHeight = 10;
var paddleWidth = 75;

//Paddle Displacement 
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

//Bricks, Lifes and Score
var brickRowCount = 5;
var brickColumnCount = 4;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

//Control var to change the color ball
var color = "#";
//Control var to not hack the speed
var count = 0;

//Wall Brick
var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//Listeners (Mouse and keys Displacements)
document.addEventListener('keypress', keyStartHandler,false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//Check the key pressed
function keyStartHandler(e){
    if(e.keyCode == 32 && count == 0){
        spacePressed = true;
        draw();
        count++;
    }
}
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

//Mouse Movement Function and close the bounds for the paddle don't get out of the canvas
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    } else if (relativeX >= canvas.width) {
        paddleX = canvas.width - paddleWidth; //Rigth Close
    } else if (relativeX <= canvas.width) {
        paddleX = 0; //Left Close
    }
}

//Collition Detection
function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += 2;
                    if ((score / 2) == brickRowCount * brickColumnCount) {
                        let message = "YOU WIN, CONGRATS!\nYOUR SCORE\n" + score + " POINTS";
                        alert(message);
                        document.location.reload();
                    }
                }
            }
        }
    }
}

//New Color Generation Function
function generateNewColorBall() {
    let symbols = "0123456789ABCDEF";
    color = "#";
    for (let i = 0; i < 6; i++) {
        color = color + symbols[Math.floor(Math.random() * 16)];
    }
    console.info(color);
    return color;
}
//Draw Ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

//Draw Paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#3066BE";
    ctx.fill();
    ctx.closePath();
}

//Draw Bricks
function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#3066BE";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//Draw Score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#3066BE";
    ctx.fillText("Score: " + score, 8, 20);
}
//Draw Lives
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#3066BE";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

//Main Function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    //Check the ball collition with the sides
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) { //Check top or bottom collition
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) { //Check if hit the ground or the paddle
        generateNewColorBall(); //Execute the changing color function if the ball hit the paddle
        dy += 1; //Add Velocity to the ball each paddle hit
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    //Check the displacement of the paddle with the keys
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

//draw();

