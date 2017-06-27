var canvas;
var canvasContext;

var framesPerSecond = 60;
var zoom = 0.45;
var isPaused = false;
var winScreen = false;
var winner;
var scoreP1 = 0;
var scoreP2 = 0;

var ballX = 900;
var ballY = 500;
var ballSpeedX = 25;
var ballSpeedY = 0;
var radius = 80;

var paddle1Y = 250;
var paddle2Y = 370;
const PADDLE_THICKNESS = 30;
const PADDLE_HEIGHT = 400;
const DIFFICULTY = 10;
const BALL_CONTROL = 10;
const POINTS_NEEDED = 10;

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    // Why is this?
    var mouseX = evt.clientX/zoom - rect.left - root.scrollLeft;
    var mouseY = evt.clientY/zoom - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY,
    };
}
window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    // Zoom fix:
    document.getElementsByTagName("BODY")[0].style.zoom =
    (zoom*100).toString() + "%";

    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousemove', function(evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
    });
};
function moveEverything() {
    if (!isPaused){
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    }
    // Check if ball should return:
    if(ballX-radius < PADDLE_THICKNESS &&
    ballY > paddle1Y &&
    ballY < paddle1Y + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
        ballSpeedY += (ballY - paddle1Y-PADDLE_HEIGHT/2)
        /(BALL_CONTROL*PADDLE_HEIGHT/200);
    }
    if(ballX+radius>canvas.width-PADDLE_THICKNESS &&
    ballY > paddle2Y - PADDLE_HEIGHT/2 &&
    ballY < paddle2Y + PADDLE_HEIGHT/2) {
        ballSpeedX = -ballSpeedX;
        ballSpeedY += (ballY - paddle2Y)
        /(BALL_CONTROL*PADDLE_HEIGHT/200);
    }
    if(ballY+radius > canvas.height || ballY-radius < 0) {
        ballSpeedY = -ballSpeedY;
    }
    //Check if ball should reset:
    if (ballX < 0){
        scoreP2++;
        if(scoreP2 >= POINTS_NEEDED) {
            winScreen = true;
            isPaused = true;
            winner = "Player 2";
            setTimeout(function() {
                isPaused = false;
                winScreen = false;
                scoreP1 = 0;
                scoreP2 = 0;
            }, 4000);
        } else {
            isPaused = true;
            setTimeout(function() {
                isPaused = false;
            }, 400);
        }
        ballX = canvas.width*0.25;
        ballY = canvas.height/2;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = Math.random()*20 - 10;
    }
    if(ballX > canvas.width){
        scoreP1++;
        if(scoreP1 >= POINTS_NEEDED) {
            winScreen = true;
            isPaused = true;
            winner = "Player 1";
            setTimeout(function() {
                isPaused = false;
                winScreen = false;
                scoreP1 = 0;
                scoreP2 = 0;
            }, 4000);
        } else {
            isPaused = true;
            setTimeout(function() {
                isPaused = false;
            }, 400);
        }
        ballX = canvas.width*0.75;
        ballY = canvas.height/2;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = Math.random()*20 - 10;
    }
    // Paddle AI
    if(ballY > paddle2Y+DIFFICULTY){
        paddle2Y += DIFFICULTY;
    } else if(ballY < paddle2Y-DIFFICULTY){
        paddle2Y -= DIFFICULTY;
    } else {
        paddle2Y = ballY;
    }
}
function drawEverything() {
    colorRect(0,0,canvas.width,canvas.height,'black');
    // Table:
    colorRect(canvas.width/2-5, 0, 10, canvas.height, "white");
    canvasContext.beginPath();
    canvasContext.strokeStyle = "white";
    canvasContext.lineWidth = 10;
    canvasContext.arc(canvas.width/2,canvas.height/2,
    120,0,Math.PI*2);
    canvasContext.stroke();
    canvasContext.font = "150px Arial Black";
    canvasContext.textAlign = "center";
    canvasContext.strokeText(scoreP1, canvas.width*0.2, canvas.height/2);
    canvasContext.strokeText(scoreP2, canvas.width*0.8, canvas.height/2);
    // Left player paddle
    colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
    // Right computer paddle
    colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y-PADDLE_HEIGHT/2,
    PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
    // next line draw the ball
    colorCircle(ballX, ballY, radius, 'white');
    if(winScreen){
        canvasContext.fillStyle = "gold";
        canvasContext.fillText(winner+" is the winner!",
        canvas.width/2+20,canvas.height/4);
    }
}
function colorCircle(centerX, centerY, drawColor) {
canvasContext.fillStyle = drawColor;
canvasContext.beginPath();
canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
canvasContext.fill();
}
function colorRect(leftX,topY,width,height, drawColor) {
canvasContext.fillStyle = drawColor;
canvasContext.fillRect(leftX,topY,width,height);
}
