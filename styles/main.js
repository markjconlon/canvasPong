window.onload=function() {
  const canvas = document.getElementById('canvas');
  let canvasContext = canvas.getContext('2d');
  canvasContext.font = "24px Arial"

  var ballX = 50;
  var ballY = 50;
  var ballSpeedX = 5;
  var ballSpeedY = 5;

  var playerScore = 0;
  var computerScore = 0;
  var winningScore = 10;
  var gameOver = false;

  var paddleSpeed = 7;
  var paddle1Y = 250;
  var paddle2Y = 250;
  const paddleHeight = 100;
  const paddleThickness = 10;

  setInterval(function(){
    move();
    drawEverything();
  }, 1000/60);

  canvas.addEventListener('mousemove', function (e) {
    var mousePos = calculateMousePos(e);
    paddle1Y = mousePos.y - paddleHeight/2;
  });

  canvas.addEventListener('mousedown', function (e) {
    if (gameOver) {
      playerScore = 0;
      computerScore = 0;
      gameOver = false;
    }
  });
  function calculateMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = e.clientX - rect.left - root.scrollLeft;
    var mouseY = e.clientY - rect.top - root.scrollTop;
    return {
      x: mouseX,
      y: mouseY,
    }
  }

  function move(){
    if (gameOver) {
      return;
    }
    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if(ballX > canvas.width - paddleThickness){
      if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;

        // changing verticl speed based on paddle position
        var deltaY = ballY -(paddle2Y + paddleHeight/2)
        ballSpeedY = deltaY/3;

      } else {
        playerScore += 1;
        ballReset();
      }
    }

    if (ballX < paddleThickness) {
      if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;

        // changing verticl speed based on computer's paddle position
        var deltaY = ballY -(paddle1Y + paddleHeight/2)
        ballSpeedY = deltaY/3;
      } else {
        computerScore += 1;
        ballReset();
      }
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY < 0){
      ballSpeedY = -ballSpeedY;
    }
  }

  function computerMovement(){
    if (paddle2Y + paddleHeight/2 < ballY - paddleHeight/3) {
      paddle2Y += paddleSpeed;
    } else if (paddle2Y + paddleHeight/2 > ballY + paddleHeight/3) {
      paddle2Y -= paddleSpeed;
    }
  }

  function drawRect(x, y, width, height, color){
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
  }

  function ballReset(){
    if (playerScore >= winningScore || computerScore >= winningScore){
      gameOver = true;
    }
    ballSpeedX = -ballSpeedX;
    ballSpeedY = ballSpeedX
    ballX = canvas.width/2;
    ballY = canvas.height/2;
  }

  function drawEverything() {
    // draws board
    drawRect(0,0,canvas.width,canvas.height, "black");
    canvasContext.fillStyle = "white";

    if (gameOver) {
      if (playerScore >= winningScore) {
        canvasContext.fillText("Player 1 Wins!", canvas.width/2 -100, 100);
        canvasContext.fillText("Click to Continue", canvas.width/2 -100, 200);
      } else {
        canvasContext.fillText("Computer Wins!", canvas.width/2 -100, 100);
        canvasContext.fillText("Click to Continue", canvas.width/2 -100, 200);
      }
      return;
    }
    // draws paddle
    drawRect(0,paddle1Y, paddleThickness, paddleHeight, "white");
    // draws second paddle
    drawRect(canvas.width - paddleThickness, paddle2Y, paddleThickness ,100, "white");
    // draws center line
    drawRect(canvas.width/2 - 2, 4, 4, canvas.height - 8, "white")
    // scores player
    canvasContext.fillText(playerScore, canvas.width/2 -110, 100);
    // scores computer
    canvasContext.fillText(computerScore, canvas.width/2 + 100, 100);
    // draws ball
    canvasContext.fillStyle = "red";
    canvasContext.beginPath();
    canvasContext.arc(ballX, ballY, 10, 0,Math.PI*2, true);
    canvasContext.fill();
  }

}
