let snake, food, scl = 20, score = 0, gameOver = false;
let snakeImg, foodImg;
let paused = false;
let bgp;


function preload() {
  bgp = loadImage("3858.jpg");
  snakeImg = loadImage("snake01.png");
  foodImg = loadImage("donut.png");
}

function startGame() {
  console.log("Game started");

  document.getElementById("startScreen").style.display = "none";

  scl = parseInt(document.getElementById("sizeSelect").value);
  let speed = parseInt(document.getElementById("speedSelect").value);

  console.log("Settings -> scl:", scl, "speed:", speed);

  frameRate(speed);

  snake = new Snake();
  newFood();

  console.log("Initial snake:", snake);
  console.log("Initial food:", food);

  loop();
}


function setup() {
  let c = createCanvas(500, 500);
  c.parent("game-container");
  noLoop();
  //*********** */ Read user-selected size & speed*********//
  scl = parseInt(document.getElementById("sizeSelect").value);
  let speed = parseInt(document.getElementById("speedSelect").value);

  frameRate(speed);

  snake = new Snake();
  newFood();

  document.getElementById("restartBtn").onclick = restart;
}
function draw() {
  console.log("Frame start. gameOver:", gameOver, "paused:", paused);

  background(bgp);

  if (gameOver) {
    console.log("Game over frame");
    return showGameOver();
  }
  if (paused) {
    console.log("Game paused");
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("PAUSED", width / 2, height / 2);
    return;
  }

  snake.update();
  snake.show();

  if (snake.eat(food)) {
    score++;
    console.log("Food eaten! New score:", score);
    document.getElementById("score").innerText = "Score: " + score;
    newFood();
    console.log("New food position:", food);
  }

  image(foodImg, food.x, food.y, scl, scl);

  snake.checkDeath();
}


function keyPressed() {
  if (keyCode === UP_ARROW) snake.dir(0, -1);
  if (keyCode === DOWN_ARROW) snake.dir(0, 1);
  if (keyCode === RIGHT_ARROW) snake.dir(1, 0);
  if (keyCode === LEFT_ARROW) snake.dir(-1, 0);

 
  if (key === ' ') paused = !paused;
}



function newFood() {
  food = createVector(
    floor(random(width / scl)),
    floor(random(height / scl))
  );
  food.mult(scl);
}

function showGameOver() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("GAME OVER", width / 2, height / 2 - 20);
  textSize(20);
  text("Score: " + score, width / 2, height / 2 + 10);

  document.getElementById("restartBtn").style.display = "inline-block";
}
function restart() {
  score = 0;
  gameOver = false;
  paused = false;

  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("restartBtn").style.display = "none";

  
  scl = parseInt(document.getElementById("sizeSelect").value);
  let speed = parseInt(document.getElementById("speedSelect").value);
  frameRate(speed);

  snake = new Snake();
  newFood();
}



function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.tail = [];
  this.angle = 0; // rotation angle

  this.dir = (x, y) => {
    this.xspeed = x;
    this.yspeed = y;

    if (x === 1)  this.angle = 0;          // right
    if (x === -1) this.angle = PI;         // left
    if (y === 1)  this.angle = HALF_PI;    // down
    if (y === -1) this.angle = -HALF_PI;   // up
  };

  this.grow = false;
  this.growEffect =0;
  this.eat = pos => {
  if (dist(this.x, this.y, pos.x, pos.y) < 1) {
    this.grow = true; 
    this.growEffect =10;  // tell snake to grow next update
    return true;
  }
  return false;

};


 this.update = () => {
  console.log("Update snake. Head before:", this.x, this.y, "tail length:", this.tail.length, "grow:", this.grow);

  if (this.grow) {
    this.tail.push(createVector(this.x, this.y));
    this.grow = false;
  } else if (this.tail.length > 0) {
    this.tail.shift();
    this.tail.push(createVector(this.x, this.y));
  }

  this.x += this.xspeed * scl;
  this.y += this.yspeed * scl;

 if (this.x < 0 || this.x >= width || this.y < 0 || this.y >= height) { 
  gameOver = true; 
}

  console.log("Head after:", this.x, this.y, "tail length:", this.tail.length);
};



 this.show = () => {
  let sizeBoost = 1;

  if (this.growEffect > 0) {
    sizeBoost = 1.3;      // 30% larger
    this.growEffect--;    // countdown
  }

  // draw tail
  for (let t of this.tail) {
    push();
    translate(t.x + scl / 2, t.y + scl / 2);
    rotate(this.angle);
    scale(sizeBoost);
    imageMode(CENTER);
    image(snakeImg, 0, 0, scl, scl);
    pop();
  }

  // draw head
  push();
  translate(this.x + scl / 2, this.y + scl / 2);
  rotate(this.angle);
  scale(sizeBoost);
  imageMode(CENTER);
  image(snakeImg, 0, 0, scl, scl);
  pop();
};


  this.checkDeath = () => {
    for (let t of this.tail)
      if (dist(this.x, this.y, t.x, t.y) < 1) gameOver = true;
  };
}






