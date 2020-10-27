//GVar
var dog, database, foodS, foodStock;
var addFeed, feed, vacc, vaccsche;
var fedTime, lastFed;
var foodObj;
var ground;

//images----------------------------------------------------------***********************------------------------------------------------------
var dogIMG1, happyDog, bed, garden, washroom, living, vaccineTime;
/*motion images*/ 
var runLeft, runRight, lazy, dead;
/*overHead images*/
var inject;
//images over ------------------------------------------------******************---------------------------------------------------------------

//gameState------------------------------------------------------------------------------------------------------------------------------------
var gameState = 0;
var readState, changeState;
//---------------------------------------------------------------------------------------------------------------------------------------------

function preload()
{
  //load images here
  dogIMG1 = loadImage("images/Dog.png");
  happyDog = loadImage("images/happy dog.png");
  milk = loadImage("images/milk.png");
  bed = loadImage("images/Bed Room.png")
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
  vaccineTime = loadImage("images/dogVaccination.png");
  runLeft = loadImage("images/runningLeft.png");
  runRight = loadImage("images/running.png");
  inject = loadImage("images/Injection.png");
  lazy = loadImage("images/Lazy.png");
  dead = loadImage("images/deadDog.png");
  living = loadImage("images/Living Room.png")

}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);

  //foodObj = new Food();

  /*feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);*/

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  });

  feed=createButton("Feed Dog");
  feed.position(600,15);
  feed.mousePressed(feedDog);

  addFeed=createButton("Add Food");
  addFeed.position(700,15);
  addFeed.mousePressed(addFoods);

  vacc=createButton("Vaccine");
  vacc.position(790,15);
  vacc.mousePressed(vacci);

  vacc=createButton("Vaccine Schedule");
  vacc.position(870,15);
  vacc.mousePressed(vacciSche);

  dog = createSprite(760, 250, 200, 200);
  dog.addImage(dogIMG1);
  dog.scale = 0.3;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

}


function draw() {  
  background(46, 139, 87);

  /*if (foodS+1) {
    image(milk,720,220,70,70);
  }*/

  var x=80,y=100;

  imageMode(CENTER);
  //image(milk,720,220,70,70);

  if (foodS!=0) {
      for(var i=0; i<foodS; i++){
          if (i%10==0) {
              x=80;
              y=y+50;
          }
          image(milk,x,y,50,50);
          x=x+30;
      }
  }

  getBgIMG();

  currentTime=hour();
  if (currentTime==(lastFed+1)) {
    gameState.update("playing");
    dog.addImage(garden);
  }else if(currentTime==(lastFed+2)){
    gameState.update("Sleeping");
    dog.addImage(bed);
  }else if(currentTime>(lastFed+2) && currentTime <= (lastFed+4)){
    gameState.update("Bathing");
    dog.addImage(washroom);
  }else{
    gameState.update("Hungry");
    dog.addImage(dogIMG1);
  }

  if (gameState != "Hungry") {
    feed.hide();
    addFeed.hide();
  }else{
    feed.show();
    addFeed.show();
    dog.addImage(dead);
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);
  if (lastFed>=12) {
    text("Last Fed: "+ lastFed%12 +" PM",450,30);
  }else if (lastFed == 0) {
    text("Last Fed: 12 AM", 450,30);
  }else{
    text("Last Feed: " + lastFed + " AM", 450,30);
  }
  
  drawSprites();

}

function readStock(data){
  foodS = data.val();
}

function writeStock(x) {

  if (x <= 0) {
    x = 0;
  }else{
    x = x - 1;
  }

   database.ref('/').update({
     Food:x
   })
}

/*function feedDog(){
  dog.addImage(dogIMG2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}*/

//---------------------------------------------------------------------------------------------------------------------------------
function addFoods() {
  foodS++;
  dog.addImage(dogIMG1);
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog() {
  foodS--;
  dog.addImage(happyDog);
  database.ref('/').update({
    Food:foodS
  })

}

//********************************************************************************************************************************* 
function vacci() {
var injection;
injection = createSprite(800,250,50,50);
injection.addImage(inject);
injection.scale = 0.1;
}

function vacciSche() {
  var schedule;
  schedule = createSprite(300,300,50,50);
  schedule.addImage(vaccineTime);
  schedule.scale=0.5;
}
//---------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------------
async function getBgIMG(){
  var response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  var daytime = responseJSON.datetime;
  var hour = daytime.slice(11,13);
  if (hour >= 14 && hour <= 17) {
      dog.addImage(garden);
  }else if(hour >= 22 && hour <= 8){
      dog.addImage(bed);
  }else if(hour > 17 && hour < 22){
      dog.addImage(lazy);
  }else{
    dog.addImage(living)
  }
}