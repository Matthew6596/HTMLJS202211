//Variables !A majority of this code was written before week 8, and thus isn't optimized well! *state machine
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);
//Asteroid Attributes Vars
var numAster = 10;
var aLowSpd = 1;
var aHighSpd = 5;
var asteroidSize = 4;
//Objects Vars
var asteroids = [];
var stars = [];
var player = new Player();
var explosions = new Explosion(0,0,"rgba(0,0,0,0)",0,0);
var explosions2 = new Explosion(0,0,"rgba(0,0,0,0)",0,0);
var starPos = 0;
//Score & Text Vars
var score = 0;
var scoreTextX = -1000;
var startTextY = canvas.height/2;
var startTextSize = 64;
var highscore = 0;
//State Vars
var lost = false;
var started = false;
var firstStart = true;
//Time Vars
var fps = 60;
var frames = fps;
var trueFPS = 90;
var fpsCounter = 0;
var fpsModifier = 1;
var refresh = false;
//Audio Vars
var throttle = document.getElementById("thr");
var boom1 = document.getElementById("boom1");
var music = document.getElementById("music");

//Istantiation
throttle.volume = 0.1;
boom1.volume = 0.2;
music.volume = 0.2;
for(i=0;i<100;i++){
    stars[i] = new Star();
}
scoreCount();
starPosRefresh(true);
setTimeout(getFPS,1000);

//Listeners
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);
document.addEventListener("DOMContentLoaded",function(e){console.log("DOMContentLoaded");});
throttle.addEventListener("loadedmetadata",function(e){console.log("loadedmetadata");});
throttle.addEventListener("waiting",function(e){console.log("waiting");});
throttle.addEventListener("suspend",function(e){console.log("suspend");});

//Objects
function Asteroid(col){
    this.radius = randNum(asteroidSize,asteroidSize+12);
    this.x = randNum(this.radius,canvas.width-this.radius);
    this.y = randNum(this.radius,canvas.height-this.radius) - canvas.height;
    this.vy = randNum(aLowSpd,aHighSpd);
    this.color = col;

    this.draw = function(){
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = "1";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}
function Star(){
    this.rand1 = randNum(0,3);
    this.x = randNum(0,canvas.width);
    this.y = randNum(0,canvas.height);
    this.vy = randNum(0.1,1);
    if(this.rand1<=1){this.color="white";}
    else if(this.rand1<=2){this.color="violet";}
    else if(this.rand1<=3){this.color="lightblue";}

    this.draw = function(){
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = "1";
        ctx.beginPath();
        ctx.arc(this.x,this.y,0.75,0,Math.PI*2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        this.y+=this.vy;
        if(this.y>canvas.height+2){
            this.rand1 = randNum(0,3);
            this.y = -2;
            this.x = randNum(0,canvas.width);
            this.vy = randNum(0.1,1);
            if(this.rand1<=1){this.color="white";}
            else if(this.rand1<=2){this.color="violet";}
            else if(this.rand1<=3){this.color="blue";}
        }
    }
}
function Player(){
    this.w = 40;
    this.x = (canvas.width/2)-(this.w/2);
    this.y = canvas.height+this.w*2;
    this.color = "green";
    this.spd = 6;
    this.yspd = 2;
    this.kD = false;
    this.kA = false;
    this.kW = false;
    this.kS = false;
    this.beginning = false;
    this.began = false;
    this.flameLength = 0.75;

    this.draw = function(){
        if(this.kW){ //Propulsion Flame
            if(throttle.currentTime<24.9){
                ctx.save();
                if(this.flameLength==0.75){this.flameLength=1;}
                else{this.flameLength=0.75;}
                ctx.translate(this.x,this.y);
                ctx.strokeStyle = "orange";
                ctx.lineWidth = "1";
                ctx.beginPath();
                ctx.moveTo(this.w*(3/16),0);
                ctx.lineTo(this.w*(1/16),this.flameLength*this.w/2);
                ctx.lineTo(this.w*(3/16),this.flameLength*this.w/7);
                ctx.lineTo(this.w*(4.5/16),this.flameLength*this.w*(3/4));
                ctx.lineTo(this.w*(5.5/16),this.flameLength*this.w/3);
                ctx.lineTo(this.w*(8/16),this.flameLength*this.w);
                ctx.lineTo(this.w*(10.5/16),this.flameLength*this.w/3);
                ctx.lineTo(this.w*(11.5/16),this.flameLength*this.w*(3/4));
                ctx.lineTo(this.w*(13/16),this.flameLength*this.w/7);
                ctx.lineTo(this.w*(15/16),this.flameLength*this.w/2);
                ctx.lineTo(this.w*(13/16),0);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }
        }
        ctx.save(); //Main Ship
        ctx.translate(this.x,this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = "2";
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(this.w,0);
        ctx.lineTo((this.w/2),-this.w);
        ctx.lineTo(0,0);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        
    }
    this.move = function(){
        if(this.kD){this.x+=this.spd;}//Right
        if(this.x>canvas.width-this.w){this.x=canvas.width-this.w;}
        if(this.kA){this.x-=this.spd;}//Left
        if(this.x<0){this.x=0;}
        if(this.kW&&this.y>=canvas.height/2){this.y-=this.spd;}//Vertical
        if(!(this.y>=canvas.height-10)){
            if(this.kS){this.y+=this.yspd*2;}
            else{this.y+=this.yspd;}
        }
        if(this.y<canvas.height/2){this.y=canvas.height/2;}
    }
    this.begin = function(){
        this.beginning = true;
        this.y -= (this.y-(canvas.height-11))*0.1;
        if(this.y<=(canvas.height-10)){this.beginning=false;this.began=true;}
    }
}
function Explosion(x,y,color,speed,radius){ //Buggy, seems to only work once outside of player lose
    this.x = [x,x,x,x,x,x,x,x];
    this.y = [y,y,y,y,y,y,y,y];
    this.col = color;
    this.spd = speed;
    this.r = radius;
    this.lwidth = 2;
    if(this.col=="red"||this.col=="orange"||this.col=="grey"||this.col=="yellow"){this.lwidth=1;}
    

    this.update = function(){
        var div = 1.5;
        var zero = false;
        this.x[0] += this.spd;
        this.x[1] += this.spd/div;//
        //this.x[2]
        this.x[3] -= this.spd/div;//
        this.x[4] -= this.spd;
        this.x[5] -= this.spd/div;//
        //this.x[6]
        this.x[7] += this.spd/div;//
        //this.y[0]
        this.y[1] -= this.spd/div;//
        this.y[2] -= this.spd;
        this.y[3] -= this.spd/div;//
        //this.y[4]
        this.y[5] += this.spd/div;//
        this.y[6] += this.spd;
        this.y[7] += this.spd/div;//

        if((this.col=="red"||this.col=="orange"||this.col=="grey"||this.col=="yellow")&&!zero){this.r--;}
        if(this.r<=0){this.r=0;}

        ctx.strokeStyle = this.col;
        ctx.lineWidth = this.lwidth;
        for(i=0;i<this.x.length;i++){
            ctx.beginPath();
            ctx.arc(this.x[i],this.y[i],this.r,0,Math.PI*2);
            ctx.stroke();
            ctx.closePath();
        }
    }
}
//Input
function keyDown(e){//w:87 a:65 s:83 d:83
    if(e.which==32){
        if(lost){reset();}
        else if(refresh){location.reload();}
        else if(started){funnyFunction();}
        else{started = true;}
    }
    if(!lost){
        if(e.which==65||e.which==37){player.kA = true;}
        if(e.which==68||e.which==39){player.kD = true;}
        if(e.which==87||e.which==38){player.kW = true;}
        if(e.which==83||e.which==40){player.kS = true;}
    }
}
function keyUp(e){//w:87 a:65 s:83 d:83
    if(!lost){
        if(e.which==65||e.which==37){player.kA = false;}
        if(e.which==68||e.which==39){player.kD = false;}
        if(e.which==87||e.which==38){player.kW = false;}
        if(e.which==83||e.which==40){player.kS = false;}
    }
}
//Functions
function randNum(low,high){
    return (Math.random()*(high-low)+low);
}
function funnyFunction(){
    gameOver();
}
function cordsInside(mainx, mainy, x1,x2,y1,y2){
    if(((mainx>x1)&&(mainx<x2))&&((mainy>y1)&&(mainy<y2))){return true;}
    else{return false;}
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
function asteroidInstantiate(){
    if(started&&asteroids.length==0){
        for(i=0;i<numAster;i++){
            var col = randNum(0,4);
            if(col<1){col="red";}
            else if(col<=2){col="grey";}
            else if(col<=3){col="orange";}
            else if(col<=4){col="yellow";}
            asteroids[i] = new Asteroid(col);
        }
    }
}
function collisionDetect(a){
    var xDis = (player.x+player.w/2)-asteroids[a].x
    var yDis = (player.y-player.w/2)-asteroids[a].y
    var distance = Math.sqrt((xDis*xDis)+(yDis*yDis));
    if(distance<(player.w/2+asteroids[a].radius)){return true;}
    else{return false;}
}
function asteroidManage(n){
    if(collisionDetect(n)){gameOver();}
    if(asteroids[n].y-asteroids[n].radius>canvas.height){
        var colorN = randNum(0,4)
        asteroids[n].radius = randNum(asteroidSize,asteroidSize+12);
        asteroids[n].x = randNum(asteroids[n].radius,canvas.width-asteroids[n].radius);
        asteroids[n].y = -(asteroids[n].radius+100);
        asteroids[n].vy = randNum(aLowSpd,aHighSpd);
        if(colorN<1){asteroids[n].color="red";}
        else if(colorN<=2){asteroids[n].color="grey";}
        else if(colorN<=3){asteroids[n].color="orange";}
        else if(colorN<=4){asteroids[n].color="yellow";}
    }
    asteroids[n].y+=asteroids[n].vy;
    asteroids[n].draw();
}
function reset(){
    numAster = 10;
    aLowSpd = 1;
    aHighSpd = 5;
    asteroids = [];
    asteroidSize = 4;
    player = new Player();
    lost = false;
    started = true;
    explosions = new Explosion(0,0,"rgba(0,0,0,0)",0,0);
    explosions2 = new Explosion(0,0,"rgba(0,0,0,0)",0,0);
    score = 0;
    scoreTextX = -1000;
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
function scoreCount(){
    if(!lost&&started){
        score++;
        difficulty();
    }
    setTimeout(scoreCount,1000);
}
function startText(){
    ctx.lineWidth="1";
    ctx.font=startTextSize+"px Courier New";
    ctx.strokeStyle="green";
    ctx.textAlign="center";
    if(firstStart){ctx.strokeText("Press Space to Start",canvas.width/2,startTextY);}
    else{
        ctx.strokeText("Press Space to Restart",canvas.width/2,startTextY);
        ctx.font=(startTextSize-10)+"px Courier New";
        ctx.strokeText("Highscore: "+highscore,canvas.width/2,startTextY+(16+startTextSize)/1.2);
        ctx.strokeText("Score: "+score,canvas.width/2,startTextY+(86+startTextSize)/1.2);
    }
}
function startTextMove(){
    startTextY -= (startTextY+140)*0.05;
    startTextSize -= (startTextSize-12)*0.1;
}
function endTextMove(){
    startTextY += ((canvas.height/2)-startTextY)*0.05;
    startTextSize += (startTextSize-12)*0.1;
}
function getFPS(){
    player.spd /= fpsModifier;
    player.yspd /= fpsModifier;
    explosions.spd /= fpsModifier;
    explosions2.spd /= fpsModifier;
    for(i=0;i<asteroids.length;i++){asteroids[i].vy = asteroids[i].vy/fpsModifier;}
    for(i=0;i<stars.length;i++){stars[i].vy = stars[i].vy/fpsModifier;}
    trueFPS = fpsCounter;
    fpsCounter = 0;
    fpsModifier = (30/trueFPS)*4;
    player.spd *= fpsModifier;
    player.yspd *= fpsModifier;
    explosions.spd *= fpsModifier;
    explosions2.spd *= fpsModifier;
    for(i=0;i<stars.length;i++){stars[i].vy *= fpsModifier;}
    for(i=0;i<asteroids.length;i++){asteroids[i].vy *= fpsModifier;}
    setTimeout(getFPS,1000);
}
function FPSCount(){
    fpsCounter++;
}
function scoreText(){
    ctx.lineWidth="0.8";
    ctx.font="30px Courier New";
    ctx.strokeStyle="green";
    ctx.textAlign="left";
    ctx.strokeText(score,scoreTextX,24);
}
function scoreTextMove(first){
    if(first){scoreTextX += (5-scoreTextX)*0.05;}
    else{scoreTextX += ((-32*(score/10)-32)-scoreTextX)*0.01}
}
function difficulty(){
    var rand = Math.round(randNum(2,4));
    if(score%rand==0){
        explosions2 = new Explosion(randNum(0,canvas.width),0,"yellow",10,5);
    }
    if(score%10==0&&aHighSpd<14){
        if(aHighSpd-aLowSpd==4){aLowSpd++;}
        else{aHighSpd++;}
        explosions2 = new Explosion(randNum(50,(canvas.width)-50),0,"orange",10,10);
    }
    if(score%20==0){
        asteroids[asteroids.length] = new Asteroid("red");
        explosions = new Explosion(asteroids[asteroids.length-1].x,0,"red",10,16);

        console.log(asteroids.length);
    }
    if(score%30==0&&asteroidSize<24){asteroidSize++; explosions = new Explosion(randNum(200,canvas.width-200),0,"grey",10,24);}
    if((score-highscore)==1){explosions2 = new Explosion(randNum(200,canvas.width-200),randNum(200,canvas.height-200),"violet",7,1);}
}
function starPosRefresh(first){
    if(first){starPos = stars[0].y;}
    else{
        console.log("bruh");
        if(starPos==stars[0].y){refresh=true;}
    }
    starPos = stars[0].y;
    setTimeout(function(){starPosRefresh(false);},1000);
}
function refreshPage(){
    ctx.lineWidth="1";
    ctx.font="48px Courier New";
    ctx.strokeStyle="red";
    ctx.textAlign="center";
    ctx.strokeText("Please refresh the page",canvas.width/2,canvas.height/2);
}
function gameOver(){
    if(!lost){
        boom1.play();
        explosions = new Explosion(player.x+player.w/2,player.y-player.w/2,"green",6,3.5);
    }
    firstStart = false;
    lost = true;
    console.log("Hit!");
    player.w = 0;
    player.kA = false;
    player.kS = false;
    player.kD = false;
    player.kW = false;
    doThrAudio(false);
    if(score>highscore){highscore = score; explosions2 = new Explosion(canvas.width/2,canvas.height/2,"violet",5,5);}
}
function play(){
    if(lost&&scoreTextX>(-32*(score/10)-32)){scoreText(); scoreTextMove(false);}
    else if(!lost){scoreText();}
    if(!lost&&scoreTextX<5){scoreTextMove(true);}
    if(startTextY>=-70&&!lost){startTextMove();}
    if(startTextSize<64&&lost){endTextMove();}
    if(!player.began){player.begin();}
    asteroidInstantiate();
    for(i=0;i<asteroids.length;i++){asteroidManage(i);}
    player.draw();
    if(player.began){player.move();}
    if(!lost&&player.kW){doThrAudio(true);}
    else{doThrAudio(false);}
    if(music.currentTime>=16){music.currentTime=0;}
    if(music.paused){music.play();}
}
//Main
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    if(!refresh){
        FPSCount();
        explosions.update();
        explosions2.update();
        for(i=0;i<stars.length;i++){stars[i].draw();}
        if(startTextY>=-70||lost){startText();}
        if(started){play();}
    }else{refreshPage();}
    //
    timer = requestAnimationFrame(main);
}

//State machine: array of functions with code for that state
/*
var states = [];
var currentState = 0;
states[0] = function(){

}
states[1] = function(){

}
states[currentState]; in main
*/