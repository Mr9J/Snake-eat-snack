const canvas = document.getElementById("mainCanvas");
const canvasContext = canvas.getContext("2d");
const mode = document.getElementById("myonoffswitch");

const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

let easyMode = false;
function modeChange() {
  if (mode.checked) {
    easyMode = true;
    return;
  } else {
    easyMode = false;
  }
}

//snake body
let snake = [];
function generateSnake() {
  snake[0] = { x: 80, y: 0 };
  snake[1] = { x: 60, y: 0 };
  snake[2] = { x: 40, y: 0 };
  snake[3] = { x: 20, y: 0 };
  snake[4] = { x: 0, y: 0 };
}

//keyboard control
window.addEventListener("keydown", changeDirection);
let direction = "right";
function changeDirection(e) {
  if ((e.key == "ArrowUp" || e.key == "w") && direction != "down") {
    direction = "up";
  } else if ((e.key == "ArrowDown" || e.key == "s") && direction != "up") {
    direction = "down";
  } else if ((e.key == "ArrowLeft" || e.key == "a") && direction != "right") {
    direction = "left";
  } else if ((e.key == "ArrowRight" || e.key == "d") && direction != "left") {
    direction = "right";
  }

  //prevent fast input bug
  window.removeEventListener("keydown", changeDirection);
}

function render() {
  //clean canvas
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  //check is snake eating itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(theGame);
      alert("Game Over");
      return;
    }
  }

  //check is snake hitting wall
  if (!easyMode) {
    if (
      snake[0].x >= canvas.width ||
      snake[0].y >= canvas.height ||
      snake[0].x < 0 ||
      snake[0].y < 0
    ) {
      clearInterval(theGame);
      alert("Game Over");
      return;
    }
  }

  //put snack
  theSnack.putSnack();

  //snake config
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      canvasContext.fillStyle = "yellow";
    } else {
      canvasContext.fillStyle = "white";
    }
    canvasContext.fillRect(snake[i].x, snake[i].y, unit, unit);

    if (easyMode) {
      if (snake[i].x >= canvas.width) {
        snake[i].x = 0;
      }
      if (snake[i].x < 0) {
        snake[i].x = canvas.width - unit;
      }
      if (snake[i].y >= canvas.height) {
        snake[i].y = 0;
      }
      if (snake[i].y < 0) {
        snake[i].y = canvas.height - unit;
      }
    }

    canvasContext.strokeStyle = "black";
    canvasContext.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //snake movement
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (direction == "right") {
    snakeX += unit;
  } else if (direction == "left") {
    snakeX -= unit;
  } else if (direction == "up") {
    snakeY -= unit;
  } else if (direction == "down") {
    snakeY += unit;
  }
  let snakeHead = {
    x: snakeX,
    y: snakeY,
  };

  //check is snake eat
  if (snake[0].x == theSnack.x && snake[0].y == theSnack.y) {
    //put new snack, score++
    theSnack.locationRule();
    score++;
    setScore(score);
    document.getElementById("myScore").innerHTML = "Score: " + score;
    document.getElementById("highestScore").innerHTML =
      "Highest Score: " + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(snakeHead);

  window.addEventListener("keydown", changeDirection);
}

class Snack {
  constructor() {
    this.x = unit;
    this.y = unit;
  }

  putSnack() {
    canvasContext.fillStyle = "red";
    canvasContext.fillRect(this.x, this.y, unit, unit);
  }

  locationRule() {
    let overlapping = false;
    let newX;
    let newY;
    do {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;
      checkOverlap(newX, newY);
    } while (overlapping);

    this.x = newX;
    this.y = newY;

    function checkOverlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }
  }
}

//score setting
function getHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}

//initial set
generateSnake();
modeChange();
let theSnack = new Snack();
let theGame = setInterval(render, 100);

//score
let score = 0;
document.getElementById("myScore").innerHTML = "Score: " + score;
let highestScore;
getHighestScore();
document.getElementById("highestScore").innerHTML =
  "Highest Score: " + highestScore;
