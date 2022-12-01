//Variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);

var numAster = 10;
var aLowSpd = 1;
var aHighSpd = 5;
var asteroids = [];
var player = new Player();

//Istantiation
for(i=0;i<numAster;i++){
    var col = randNum(4,0);
    if(col<1){col="red";}
    else if(col<=2){col="white";}
    else if(col<=3){col="orange";}
    else if(col<=4){col="yellow";}
    asteroids[i] = new Asteroid(col);
}

//Listeners
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

//Objects
function Asteroid(col){
    this.radius = randNum(2,15);
    this.x = randNum(this.radius,canvas.width-this.radius);
    this.y = randNum(this.radius,canvas.height-this.radius) - canvas.height;
    this.vy = randNum(aLowSpd,aHighSpd);
    this.color = col;

    this.draw = function(){
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}
function Player(){
    this.w = 40;
    this.x = canvas.width/2;
    this.y = canvas.height-10;
    this.color = "green";
    this.spd = 6;
    this.kD = false;
    this.kA = false;

    this.draw = function(){
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = "2";
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x+this.w,this.y);
        ctx.lineTo(this.x+(this.w/2),this.y-this.w);
        ctx.lineTo(this.x,this.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    this.move = function(){
        if(this.x>=canvas.width-this.w){this.kD=false;}
        if(this.x<=0){this.kA=false;}
        if(this.kD){this.x+=this.spd;}
        if(this.kA){this.x-=this.spd;}
    }
}

//Input
function keyDown(e){//w:87 a:65 s:115 d:83
    if(e.which==65){player.kA = true;}
    if(e.which==68){player.kD = true;}
}
function keyUp(e){//w:87 a:65 s:115 d:83
    if(e.which==65){player.kA = false;}
    if(e.which==68){player.kD = false;}
}
//Functions
function randNum(low,high){
    return (Math.random()*(high-low)+low);
}
function asteroidManage(n){
    if((asteroids[n].x>(player.x-asteroids[n].radius)&&asteroids[n].x<(player.x+player.w+asteroids[n].radius)&&asteroids[n].y>player.y-player.w/1.2)){gameOver();}
    if(asteroids[n].y-asteroids[n].radius>canvas.height){
        var colorN = randNum(4,0)
        asteroids[n].radius = randNum(2,15);
        asteroids[n].x = randNum(asteroids[n].radius,canvas.width-asteroids[n].radius);
        asteroids[n].y = -(asteroids[n].radius+100);
        asteroids[n].vy = randNum(aLowSpd,aHighSpd);
        if(colorN<1){asteroids[n].color="red";}
        else if(colorN<=2){asteroids[n].color="white";}
        else if(colorN<=3){asteroids[n].color="orange";}
        else if(colorN<=4){asteroids[n].color="yellow";}
    }
    asteroids[n].y+=asteroids[n].vy;
    asteroids[n].draw();
}
function gameOver(){
    console.log("Hit!");
    player.w = 1;
}
//Main
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    for(i=0;i<asteroids.length;i++){asteroidManage(i);}
    player.draw();
    player.move();
    //
    timer = requestAnimationFrame(main);
}