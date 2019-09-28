var myPaddle,
    myBall,
    bricks=[],
    lifeCount = 3,
    brickNum,
    count = 1

function setup() {
  createCanvas(600,600)
  myPaddle = new paddle()
  myBall = new ball()
  createBricksRow(20,60,40,6)
  createBricksRow(20,120,40,6)
  createBricksRow(20,180,40,6)
  brickNum = bricks.length
}

function createBricksRow(x, y, spacing, numBricks){
  for(i=0; i<numBricks; i++){
    var aBrick = new brick ((60 + spacing) * i + x, y , 60, 20, ('#CCFFCC'), (0,0,0), 1)
    bricks.push(aBrick)
  }
}

function drawBricks(){
  for(i=0; i<bricks.length; i++){
    bricks[i].draw()
  }
}

function detectBrickCollision() {
  for(i=0; i<bricks.length; i++){
    bricks[i].ballCollision(myBall)
  }
}


function drawTitle(){
  textSize(40)
  textAlign(CENTER)
  stroke(51)
  fill(0)
  text("Brickbreaker", width/2, 40)
}

function drawLives(lives){
  textSize(20)
  textAlign(LEFT)
  stroke(51)
  fill(0)
  text("Lives: " + lives, width/100, 600)
}

function paddle(){
  this.x = width/2
  this.y = height-30
  this.xSize = 50
  this.ySize = 20
  this.colour = ('#00FF00')
  this.speed = 10

  this.draw = function(){
    fill (this.colour)
    rect(this.x, this.y, this.xSize, this.ySize)
  }

  this.move = function(){
    if (keyIsDown(LEFT_ARROW)){
      this.x -= this.speed
    }
    else if (keyIsDown(RIGHT_ARROW)){
      this.x += this.speed
    }

    if (this.x < 0){
      this.x = 0
    }
    else if (this.x + this.xSize > width){
      this.x = width - this.xSize
    }
  }
}

function ball(){
  this.x = width / 2
  this.y = height / 2
  this.radius = 7
  this.colour = (0,0,255)
  this.xSpeed = 0
  this.ySpeed = 5

  this.draw = function(){
    fill(0,0,255)
    ellipse(this.x, this.y, this.radius*2, this.radius*2)
  }

  this.move = function(){
    this.x += this.xSpeed
    this.y += this.ySpeed

    if (this.x + this.radius >= width){
      this.xSpeed = -this.xSpeed
    }
    else if (this.x - this.radius <= 0){
      this.xSpeed = -this.xSpeed
    }
    else if (this.y - this.radius <= 0){
      this.ySpeed = -this.ySpeed
    }
  }
}

function brick(x, y, xSize, ySize, innerColor, outerColor, hitCount){
  this.x = x
  this.y = y
  this.xSize = xSize
  this.ySize = ySize
  this.innerColor = innerColor
  this.outerColor = outerColor
  this.hitCount = hitCount
  this.inXSpace = false
  this.inYSpace = false

  this.draw = function() {
    if(this.hitCount>0) {
      stroke(this.outerColor)
      fill(this.innerColor)
      rect(this.x, this.y, this.xSize, this.ySize)
    }

  }

  this.ballCollision = function(aBall) {
    if((this.hitCount > 0) && (aBall.x > this.x) && (aBall.x < this.x + this.xSize)) {
      this.inXSpace = true
      if (this.inYSpace){
        this.hitCount -= 1
        aBall.xSpeed *= -1
        brickNum --
      }
    }
    else {
      this.inXSpace = false
    }
    if((this.hitCount > 0) && (aBall.y > this.y) && (aBall.y < this.y + this.ySize)) {
      this.inYSpace = true
      if (this.inXSpace){
        this.hitCount -= 1
        aBall.ySpeed *= -1
        brickNum --
      }
    }
    else {
      this.inYSpace = false
    }
  }
}

function ballPaddleCollision (aBall, aPaddle){
  var ballSpeed, theta
  if ((aPaddle.y - aBall.y <= aBall.radius) && (aBall.x > aPaddle.x) && (aBall.x < aPaddle.x + aPaddle.xSize)) {
    theta = ((aBall.x - aPaddle.x) / aPaddle.xSize) * 180
    ballSpeed = sqrt(sq(aBall.xSpeed)+sq(aBall.ySpeed))
    aBall.xSpeed = -ballSpeed *cos(theta)
    aBall.ySpeed = -ballSpeed *sin(theta)
  }
  else if (aBall.y > aPaddle.y) {
    aBall.xSpeed = 0
    aBall.ySpeed = 0
    lifeCount -=1
    aBall.x = width/2
    aBall.y = height/2
    aBall.xSpeed = 0
    aBall.ySpeed = 5
  }
}


function draw(){
  if (brickNum == 0){
    background (240)
    fill(0)
    textSize(75)
    text("YOU WIN",width/2,height/2)
  }
  else if (lifeCount > 0){
    background(240)
    drawLives(lifeCount)
    drawTitle()
    ballPaddleCollision(myBall,myPaddle)
    drawBricks()
    detectBrickCollision()
    myPaddle.move()
    myPaddle.draw()
    myBall.move()
    myBall.draw()
  }
  else {
    background(240)
    fill(0)
    textSize(75)
    text("GAME OVER",width/2,height/2)
  }
}
