//Variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);

var numAster = 10;
var aLowSpd = 1;
var aHighSpd = 5;
var asteroids = [];
var asteroidSize = 4;
var player = new Player();
var lost = false;
var started = false;
var startTextY = canvas.height/2
var startTextSize = 64;
var explosions = [];
var score = 0;
var scoreTextX = -1000;
var highscore = 0;
var firstStart = true;
var stars = [];

var fps = 60;
var frames = fps;

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
    this.x = canvas.width/2;
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
    this.begin = function(){
        this.beginning = true;
        this.y -= (this.y-(canvas.height-11))*0.1;
        if(this.y<=(canvas.height-10)){this.beginning=false;this.began=true;}
    }
}
function Explosion(x,y,color,speed,radius){
    this.x = [x,x,x,x,x,x,x,x];
    this.y = [y,y,y,y,y,y,y,y];
    this.col = color;
    this.spd = speed;
    this.r = radius;
    this.off = false;
    this.lwidth = 2;
    if(this.col=="red"){this.lwidth=1;}
    

    this.update = function(){
        for(i=0;i<this.x.length;i++){
            if(this.off){this.x[i]=-3-this.r;}
            else if((((this.x[i]-this.r)>canvas.width)||((this.x[i]+this.r)<0))&&(((this.y[i]-this.r)>canvas.height)||((this.y[i]+this.r)<0))){this.off=true;}
        }
        if(!this.off){
            var div = 1.5;
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
}
//Input
function keyDown(e){//w:87 a:65 s:83 d:83
    if(e.which==32&&started){reset();/*location.reload();*/}
    else if(e.which==32){started = true;}
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
function asteroidManage(n){
    if((asteroids[n].x>(player.x-asteroids[n].radius)&&asteroids[n].x<(player.x+player.w+asteroids[n].radius)&&asteroids[n].y>player.y-player.w&&asteroids[n].y<player.y+asteroids[n].radius)){gameOver();}
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
    explosions = [];
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
    frames--;
    if(frames<0){
        frames = fps;
        score++;
        difficulty();
    }
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
function scoreText(){
    ctx.lineWidth="0.75";
    ctx.font="24px Courier New";
    ctx.strokeStyle="green";
    ctx.textAlign="left";
    ctx.strokeText(score,scoreTextX,20);
}
function scoreTextMove(first){
    if(first){scoreTextX += (5-scoreTextX)*0.05;}
    else{scoreTextX += ((-32*(score/10)-32)-scoreTextX)*0.01}
}
function difficulty(){
    if(score%20==0){
        asteroids[asteroids.length] = new Asteroid("red");

        console.log(explosions.length);
        console.log(asteroids.length);
    }
    if(score%10==0&&aHighSpd<14){
        if(aHighSpd-aLowSpd==4){aLowSpd++;}
        else{aHighSpd++;}
    }
    if(score%30==0&&asteroidSize<24){asteroidSize++;}
}
function gameOver(){
    if(!lost){
        boom1.play();
        explosions[0] = new Explosion(player.x+player.w/2,player.y-player.w/2,"green",6,3.5);
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
    if(score>highscore){highscore = score;}
}
//Main
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    for(i=0;i<explosions.length;i++){explosions[i].update();}
    for(i=0;i<stars.length;i++){stars[i].draw();}
    if(startTextY>=-70||lost){startText();}
    if(started){
        if(!lost){scoreCount();}
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
        if(lost||!player.kW){doThrAudio(false);}
        if(music.currentTime>=16){music.currentTime=0;}
        if(music.paused){music.play();}
    }
    //
    timer = requestAnimationFrame(main);
}