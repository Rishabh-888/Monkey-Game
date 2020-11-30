//game states
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Declaration of global variables
var monkey, monkey_running;
var ground, invisibleGround, groundImg;

var foodGroup, banana, bananaImage;
var obstacleGroup, obstacle, obstacleImage;

var score;
var survivalTime;
var gameOverImg, restartImg;
var jumpSound , checkPointSound, dieSound;

localStorage["HighestScore"] = 0;

function preload(){
  
  monkey_running =            loadAnimation("monkey_0.png","monkey_1.png","monkey_2.png","monkey_3.png","monkey_4.png","monkey_5.png","monkey_6.png","monkey_7.png","monkey_8.png");
  
  //to load images
  groundImg = loadImage("ground.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.jpg");
  
  
  //to load sounds
  //jumpSound = loadSound("jump.mp3");
  //dieSound = loadSound("die.mp3");
  //checkPointSound = loadSound("checkpoint.mp3");
}

function setup() {
  createCanvas(550, 450);
  
  //creating monkey
  monkey = createSprite(80, 315, 20, 20);  
  
  monkey.addAnimation("running",monkey_running);
  monkey.scale=0.1;
  
  ground = createSprite(400,350,1200,10);
  ground.addImage("ground", groundImg)
  ground.x = ground.width /2;
  
  gameOver = createSprite(275,205);
  gameOver.addImage("gameOver",gameOverImg);
  
  restart = createSprite(275,255);
  restart.addImage(restartImg);
  
  restart.scale = 0.1;
  
  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(90,382,300,50);
  invisibleGround.visible = false;
    
  //create food and obstacle group
  foodGroup=createGroup();
  obstacleGroup=createGroup();
  
  monkey.setCollider("rectangle",0,0,monkey.width,monkey.height);
  monkey.debug = false;
  
  score = 0;
  survivalTime = 0;
  
}


function draw() {
 background("pink");
 //displaying score and survival Time               
 stroke("black");
 textSize(18);
 fill("black");
 text("Score : "+score,20,35);
 text("Survival Time : "+survivalTime, 350, 35);  
 
  if (gameState===PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
    
   ground.velocityX = -(4 + 3* score/10);
   //Scoring
   if(monkey.isTouching(foodGroup)){
   foodGroup.destroyEach();
   score=score+2;
   }
   //Survival time
   survivalTime = Math.ceil(frameCount/frameRate());
    
     if(score>0 && score%10 === 0){
      checkPointSound.play();
    }
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& monkey.y >= 100) {
        monkey.velocityY = -6;
      //  jumpSound.play();
    }
    
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8;
    
    //spawn the food
    spawnFood();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
  //End state condition
 if(obstacleGroup.isTouching(monkey)){
    //monkey.velocityY = -12;
    //jumpSound.play();
    gameState = END;
    //dieSound.play()
      
    }
  }
  
  else if (gameState === END) {
    gameOver.visible=true;
    restart.visible=true;
    
    
    
    ground.velocityX = 0;
    monkey.velocityY = 0
    
    obstacleGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);
     
    obstacleGroup.setVelocityXEach(0);
    foodGroup.setVelocityXEach(0);  
     
      if(mousePressedOver(restart)) {
      reset();
      }
  }
    
  //stop monkey from falling down
  monkey.collide(invisibleGround);
    
  drawSprites();
}


function spawnObstacles(){
  if (frameCount % 300 === 0){
    var obstacle = createSprite(400,320,10,40);
    obstacle.velocityX = -(6 + score/100);
    
    obstacle.scale = 0.2;
    obstacle.addImage(obstacleImage)
    obstacle.lifetime = 120;
    obstacleGroup.add(obstacle);
  }
}

function spawnFood(){
  //code to spawn the foods
  if (frameCount % 80 === 0){
    var banana = createSprite(600,165,10,40);
    banana.y = Math.round(random(100, 200));
    banana.addImage(bananaImage);
    banana.scale = 0.08;
    banana.velocityX = -5;
    
    //assign lifetime to the variable
    banana.lifetime = 130;
    
    foodGroup.add(banana);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  foodGroup.destroyEach();
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  survivalTime=0;
}