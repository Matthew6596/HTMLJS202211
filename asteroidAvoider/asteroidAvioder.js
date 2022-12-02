//Variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);

var numAster = 10;
var aLowSpd = 1;
var aHighSpd = 5;
var asteroids = [];
var player = new Player();
var lost = false;

var seconds = 5;
var fps = 60;
var frames = fps;

var throttle = document.getElementById("thr");
var boom1 = document.getElementById("boom1");

//Istantiation
throttle.volume = 0.2;
boom1.volume = 0.3
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
document.addEventListener("DOMContentLoaded",function(e){console.log("DOMContentLoaded");});
throttle.addEventListener("loadedmetadata",function(e){console.log("loadedmetadata");});
throttle.addEventListener("waiting",function(e){console.log("waiting");});
throttle.addEventListener("suspend",function(e){console.log("suspend");});

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
    this.yspd = 2;
    this.kD = false;
    this.kA = false;
    this.kW = false;
    this.kS = false;

    this.draw = function(){
        ctx.save(); //Main Ship
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
        if(this.kW){ //Propulsion Flame
            if(throttle.currentTime<24.9){
                ctx.save();
                ctx.strokeStyle = "orange";
                ctx.lineWidth = "1";
                ctx.beginPath();
                ctx.moveTo(this.x+this.w*(3/16),this.y);
                ctx.lineTo(this.x+this.w*(1/16),this.y+this.w/2);
                ctx.lineTo(this.x+this.w*(3/16),this.y+this.w/7);
                ctx.lineTo(this.x+this.w*(4.5/16),this.y+this.w*(3/4));
                ctx.lineTo(this.x+this.w*(5.5/16),this.y+this.w/3);
                ctx.lineTo(this.x+this.w*(8/16),this.y+this.w);
                ctx.lineTo(this.x+this.w*(10.5/16),this.y+this.w/3);
                ctx.lineTo(this.x+this.w*(11.5/16),this.y+this.w*(3/4));
                ctx.lineTo(this.x+this.w*(13/16),this.y+this.w/7);
                ctx.lineTo(this.x+this.w*(15/16),this.y+this.w/2);
                ctx.lineTo(this.x+this.w*(13/16),this.y);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
    }
    this.move = function(){
        if(this.kD&&this.x<canvas.width-this.w){this.x+=this.spd;}
        if(this.kA&&this.x>0){this.x-=this.spd;}
        if(this.kW&&this.y>canvas.height/2){this.y-=this.spd;}
        if(!(this.y>=canvas.height-10)){
            if(this.kS){this.y+=this.yspd*2;}
            else{this.y+=this.yspd;}
        }
        if(this.kW&&this.y<=canvas.height/2){this.y=canvas.height/2;}
    }
}

//Input
function keyDown(e){//w:87 a:65 s:83 d:83
    if(e.which==32){location.reload();}
    if(!lost){
        if(e.which==65){player.kA = true;}
        if(e.which==68){player.kD = true;}
        if(e.which==87){player.kW = true;}
        if(e.which==83){player.kS = true;}
    }
}
function keyUp(e){//w:87 a:65 s:83 d:83
    if(!lost){
        if(e.which==65){player.kA = false;}
        if(e.which==68){player.kD = false;}
        if(e.which==87){player.kW = false;}
        if(e.which==83){player.kS = false;}
    }
}
//Functions
function randNum(low,high){
    return (Math.random()*(high-low)+low);
}
function runStartTimer(){
    console.log(seconds);
    frames--;
    if(frames<0){
        frames = fps;
        seconds--;
    }
    if(seconds>0){timer = requestAnimationFrame(runStartTimer);}else{console.log("timer done");main();}
}
function asteroidManage(n){
    if((asteroids[n].x>(player.x-asteroids[n].radius)&&asteroids[n].x<(player.x+player.w+asteroids[n].radius)&&asteroids[n].y>player.y-player.w/1.2&&asteroids[n].y<player.y+asteroids[n].radius)){gameOver();}
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
function doThrAudio(on){
    if(on){
        if(throttle.paused){throttle.play();}
        if(throttle.currentTime>=25){throttle.currentTime=0;}
    }else{
        if(!throttle.paused){
            throttle.pause();
            throttle.currentTime = 0;
        }
    }   
}
function loadedAudio(e){
    console.log("loaded");
}
function gameOver(){
    if(!lost){boom1.play();}
    lost = true;
    console.log("Hit!");
    player.w = 0;
    player.kA = false;
    player.kS = false;
    player.kD = false;
    player.kW = false;
    doThrAudio(false);
}
//Main
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
        for(i=0;i<asteroids.length;i++){asteroidManage(i);}
        player.draw();
        player.move();
        if(!lost&&player.kW){doThrAudio(true);}
        if(lost||!player.kW){doThrAudio(false);}
    //
    timer = requestAnimationFrame(main);
}