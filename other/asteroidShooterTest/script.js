var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);


//
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);


//Vars
var pews = [];
var pewMaxDist = 400;
var maxPews = 4;


var asteroids = [];
var level = -1;
var numAsteroids = 5;
var astMinSpd = 1;
var astMaxSpd = 3;
var removeID = -1;


var mousex = 0;
var mousey = 0;
var up = false;
var down = false;
var left = false;
var right = false;
var shootLock = false;
var globalColor = "white";
var gameOver = false;


var player = new PlayerShip();
var lives = 3;
var respawnTime = -1;
var levelTimer = false;


var frameByFrame = false;
var frameAdvance = !frameByFrame;


//OBJECTS - O B J E C T S ---------------------------------------------------------------------------------------------------------


function Pew(angle){
    this.x = player.x+player.rotPoints[0][0];
    this.y = player.y+player.rotPoints[0][1];
    this.r = 5;
    this.spd = 3;
    this.angle = angle+180;
    this.dist = 0;


    this.move = function(){
        this.x+=Math.cos(toRadians(this.angle))*this.spd;
        this.y+=Math.sin(toRadians(this.angle))*this.spd;


        this.x=screenWrap(this.x,this.r,canvas.width);
        this.y=screenWrap(this.y,this.r,canvas.height);


        this.dist+=Math.sqrt(Math.pow(Math.cos(toRadians(this.angle))*this.spd,2)+Math.pow(Math.sin(toRadians(this.angle))*this.spd,2))
    }
    this.draw = function(){
        ctx.fillStyle = globalColor;
        ctx.fillRect(this.x-this.r/2,this.y-this.r/2,this.r,this.r);
    }
}


function PlayerShip(){ // _______________________________________________________________________________________________SHIP
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.dx = 0;
    this.dy = 0;
    this.applyDX = 0;
    this.applyDY = 0;
    this.finDX = 0;
    this.finDY = 0;
    this.maxSpd = 2;
    this.backModify = 4;
    this.acc = 0.02;
    this.dec = 0;
    this.thrustReduce = 20;
    this.faceAngle = 90;
    this.moveAngle = 0;
    this.applyAngle = 0;
    this.moveMag = 0;
    this.rotPoints = [[0,-15],[-10,15],[10,15]];
    this.points = [[0,0],[0,0],[0,0]]
    this.shipSize = 20;
    this.pAngles = [0,0,0];
    this.turnSpd = 1.5;
    for(i=0; i<this.rotPoints.length; i++){
        this.pAngles[i] = getAngle(this.rotPoints[i][0],this.rotPoints[i][1]);
        this.rotPoints[i][0] = Math.cos(toRadians(this.pAngles[i]))*this.shipSize;
        this.rotPoints[i][1] = Math.sin(toRadians(this.pAngles[i]))*this.shipSize;
    }
    this.draw = function(){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.strokeStyle = globalColor;
        ctx.lineWidth = "2";
        ctx.beginPath();
        ctx.moveTo(this.rotPoints[0][0],this.rotPoints[0][1]);
        ctx.lineTo(this.rotPoints[1][0],this.rotPoints[1][1]);
        ctx.lineTo(this.rotPoints[2][0],this.rotPoints[2][1]);
        ctx.lineTo(this.rotPoints[0][0],this.rotPoints[0][1]);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    this.thrust = function(up){
        if(up){
            this.dx+=this.acc;
            this.dy+=this.acc;
        }else{
            this.dx-=this.acc/this.backModify;
            this.dy-=this.acc/this.backModify;
        }


        this.applyDX=Math.cos(toRadians(this.faceAngle+180))*this.dx;
        this.applyDY=Math.sin(toRadians(this.faceAngle+180))*this.dy;
        this.applyAngle = getAngle(this.applyDX,this.applyDY);
        if(this.applyAngle<0){this.applyAngle+=360;}
        //APPLY VECTOR
        //console.log(getAngle(this.applyDX,this.applyDY)+", "+getMag(this.applyDX,this.applyDY));
    }
    this.move = function(){


        this.finDX = Math.cos(toRadians(this.moveAngle))*this.moveMag;
        this.finDY = Math.sin(toRadians(this.moveAngle))*this.moveMag;


        this.finDX += this.applyDX/this.thrustReduce;
        this.finDY += this.applyDY/this.thrustReduce;


        this.x+=this.finDX;
        this.y+=this.finDY;


        this.moveAngle = getAngle(this.finDX,this.finDY);
        this.moveMag = getMag(this.finDX,this.finDY);
        if(this.moveAngle<0){this.moveAngle+=360;}


        if(this.moveMag>this.maxSpd){this.moveMag=this.maxSpd;}
        if(this.moveMag>0){this.moveMag-=this.dec;}


        visualizeVector(this.x,this.y,this.moveAngle,this.moveMag,"green");
        visualizeVector(this.x,this.y,this.applyAngle,getMag(this.applyDX,this.applyDY),"red");


        if(this.dx>this.maxSpd/this.backModify){this.dx=this.maxSpd/this.backModify;}
        if(this.dy>this.maxSpd/this.backModify){this.dy=this.maxSpd/this.backModify;}


        this.x = screenWrap(this.x,this.shipSize,canvas.width);
        this.y = screenWrap(this.y,this.shipSize,canvas.height);


        for(iii=0; iii<this.points.length; iii++){
            this.points[iii][0] = this.rotPoints[iii][0] + this.x;
            this.points[iii][1] = this.rotPoints[iii][1] + this.y;
        }
    }
}


function Asteroid(x,y,size){ //_______________________________________________________________________________________ASTEROID
    this.x = x;
    this.y = y;
    this.angle = randNum(0,360);
    this.size = size;
    this.mag = randNum(astMinSpd,astMaxSpd)/this.size;
   
    this.rotPoints = [[0,12],[17,0],[10,-13],[-10,-17],[-20,0]];
    this.pAngles = [0,0,0];
    this.rotateSpd = randNum(-20/this.size,20/this.size);


    this.points = [[0,0],[0,0],[0,0],[0,0],[0,0]];
    while(Math.abs(this.rotateSpd)<10/this.size){this.rotateSpd=randNum(-20/this.size,20/this.size)}


    for(i=0; i<this.rotPoints.length; i++){
        this.pAngles[i] = getAngle(this.rotPoints[i][0],this.rotPoints[i][1]);
        this.rotPoints[i][0] = Math.cos(toRadians(this.pAngles[i]))*this.size;
        this.rotPoints[i][1] = Math.sin(toRadians(this.pAngles[i]))*this.size;
    }


    this.draw = function(){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.strokeStyle = globalColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.rotPoints[0][0],this.rotPoints[0][1]);
        for(i=1; i<this.rotPoints.length; i++){ctx.lineTo(this.rotPoints[i][0],this.rotPoints[i][1]);}
        ctx.lineTo(this.rotPoints[0][0],this.rotPoints[0][1]);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    this.move = function(){
        this.x += getPoint(this.mag,this.angle,"x");
        this.y += getPoint(this.mag,this.angle,"y");


        this.x = screenWrap(this.x,this.size,canvas.width);
        this.y = screenWrap(this.y,this.size,canvas.height);


        for(ii=0; ii<this.points.length; ii++){
            this.points[ii][0] = this.rotPoints[ii][0] + this.x;
            this.points[ii][1] = this.rotPoints[ii][1] + this.y;
        }
    }
}
//Input Functions ---------------------------------------------------------------------------------------------------------------


function keyDown(e){//w:87 a:65 s:83 d:83
    if(e.which==32&&!shootLock){shoot(player.faceAngle); shootLock = true;}
    if(e.which==65||e.which==37){left = true;}
    if(e.which==68||e.which==39){right = true;}
    if(e.which==87||e.which==38){up = true;}
    if(e.which==83||e.which==40){down = true;}
    if(e.which==70&&frameByFrame){frameAdvance=true;}
}
function keyUp(e){//w:87 a:65 s:83 d:83
    if(e.which==32){shootLock = false;}
    if(e.which==65||e.which==37){left = false;}
    if(e.which==68||e.which==39){right = false;}
    if(e.which==87||e.which==38){up = false;}
    if(e.which==83||e.which==40){down = false;}
    if(e.which==70&&frameByFrame){frameAdvance=false;}
}


//FUNCTIONS - F U N C T I O N S -----------------------------------------------------------------------------------------------------
function randNum(low, high){return Math.random()*(high-low)+low;}


function getAngle(a,b){
    if(b==0){return (a>0) ? 0:180;}
    return toDegrees((Math.acos(a/Math.sqrt(Math.pow(a,2)+Math.pow(b,2)))*(b/(Math.abs(b)))));
}
function getMag(a,b){
    return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}
function getPoint(mag,dir,XorY){
    if(XorY=="x"){return Math.cos(toRadians(dir))*mag;}
    else if(XorY=="y"){return Math.sin(toRadians(dir))*mag;}
}
function toRadians(deg){return deg*(Math.PI/180);}
function toDegrees(rad){return rad*(180/Math.PI);}


function visualizeVector(originX, originY, angle, mag, color){
    var x = getPoint(mag*80,angle,"x");
    var y = getPoint(mag*80,angle,"y");
    ctx.save();
    ctx.translate(originX,originY);
    ctx.strokeStyle = color;
    ctx.lineWidth = "2";
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(x,y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}


function compareAngles(a1,a2){
    return (Math.abs(getPoint(1,a1,"x")-getPoint(1,a2,"x"))<0.1&&Math.abs(getPoint(1,a1,"y")-getPoint(1,a2,"y"))<0.1);
}


function shoot(a){
    if(pews.length<maxPews&&respawnTime==-1){pews.push(new Pew(a));}
}


function managePews(){
    for(i=0; i<pews.length; i++){
        pews[i].move();
        pews[i].draw();


        var go = true;
        //Asteroid Collision
        for(z=0; z<asteroids.length; z++){
            if(go&&((pews[i].x+pews[i].r>asteroids[z].x-asteroids[z].size)&&(pews[i].x-pews[i].r<asteroids[z].x+asteroids[z].size))
            &&((pews[i].y+pews[i].r>asteroids[z].y-asteroids[z].size)&&(pews[i].y-pews[i].r<asteroids[z].y+asteroids[z].size))){
                pews.splice(i,1);
                generateAsteroids(asteroids[z].size,asteroids[z].x,asteroids[z].y);
                asteroids.splice(z,1);
                z=asteroids.length;
                go = false;
                if(z==0){setTimeout(levelManager,3000);}
            }
        }


        if(go&&pews[i].dist>pewMaxDist){pews.splice(i,1);}
    }
}


function screenWrap(val,size,canv){
    if(val<-size){return canv+size;} //Wrap around screen
    else if(val>canv+size){return -size;}
    else{return val;}
}


function adjustPlayerAngle(rotateAmount){


    //Rotate
    player.faceAngle += rotateAmount;
    for(i=0; i<player.rotPoints.length; i++){
        player.pAngles[i] += rotateAmount;
        //Refresh Point Locations


        player.rotPoints[i][0] = Math.cos(toRadians(player.pAngles[i]))*player.shipSize;
        player.rotPoints[i][1] = Math.sin(toRadians(player.pAngles[i]))*player.shipSize;


        if(player.pAngles[i]>360){player.pAngles[i]-=360;}
        if(player.pAngles[i]<0){player.pAngles[i]+=360;}
        if(player.faceAngle>360){player.faceAngle-=360;}
        if(player.faceAngle<0){player.faceAngle+=360;}


    }
}


function manageAsteroids(){
    for(z=0; z<asteroids.length; z++){
        for(i=0; i<asteroids[z].rotPoints.length; i++){
            asteroids[z].pAngles[i] += asteroids[z].rotateSpd;
            //Refresh Point Locations


            asteroids[z].rotPoints[i][0] = Math.cos(toRadians(asteroids[z].pAngles[i]))*asteroids[z].size;
            asteroids[z].rotPoints[i][1] = Math.sin(toRadians(asteroids[z].pAngles[i]))*asteroids[z].size;


            if(asteroids[z].pAngles[i]>360){asteroids[z].pAngles[i]-=360;}
            if(asteroids[z].pAngles[i]<0){asteroids[z].pAngles[i]+=360;}
            if(asteroids[z].faceAngle>360){asteroids[z].angle-=360;}
            if(asteroids[z].faceAngle<0){asteroids[z].angle+=360;}


            asteroids[z].move();


            if(respawnTime<=0){playerCollision(z);}


        }
    }
}


function generateAsteroids(size,x,y){
    if(size==0){
        for(x=0; x<numAsteroids; x++){
            var tempX = randNum(0,canvas.width);
            var tempY = randNum(0,canvas.height);
            while((player.x+player.shipSize>tempX-50)&&(player.x-player.shipSize<tempX+50)){tempX = randNum(0,canvas.width);}
            while((player.y+player.shipSize>tempY-50)&&(player.y-player.shipSize<tempY+50)){tempY = randNum(0,canvas.height);}
            asteroids[x] = new Asteroid(tempX,tempY,50);
        }
    }else if(size==50){
        asteroids.push(new Asteroid(x,y,25));
        asteroids.push(new Asteroid(x,y,25));
    }else if(size==25){
        asteroids.push(new Asteroid(x,y,10));
        asteroids.push(new Asteroid(x,y,10));
    }
}


function playerCollision(id){ //Make collision more ACCURATE
    if(((player.x+player.shipSize*50>asteroids[id].x-asteroids[id].size)&&(player.x-player.shipSize*50<asteroids[id].x+asteroids[id].size))
    &&((player.y+player.shipSize*50>asteroids[id].y-asteroids[id].size)&&(player.y-player.shipSize*50<asteroids[id].y+asteroids[id].size))){
        if(respawnTime==0){
            respawnTime += 2;
        }
    }
    if(paCollide(id)){
        console.log("bruh");
        if(respawnTime==-1&&!gameOver){
            player.shipSize = 0;
            adjustPlayerAngle(0);
            lives--;
            removeID = id;
            respawnTime = 4;
            player.x = canvas.width/2;
            player.y = canvas.height/2;
            player.finDX = 0;
            player.finDY = 0;
            player.moveMag = 0;
            if(lives>0){respawn();}
        }
    }
    if(lives<=0){gameOver = true;}
}


function paCollide(id){
    /*return (((player.x+player.shipSize/10>asteroids[id].x-asteroids[id].size)&&(player.x-player.shipSize/10<asteroids[id].x+asteroids[id].size))
    &&((player.y+player.shipSize/10>asteroids[id].y-asteroids[id].size)&&(player.y-player.shipSize/10<asteroids[id].y+asteroids[id].size)))*/


    for(zz=0; zz<asteroids[id].points.length; zz++){ //For each asteroid line
        var C = asteroids[id].points[zz];
        var D, Cx, Dx, Cy, Dy, CDm, CDy; //comment!

        if(zz==asteroids[id].points.length-1){D = asteroids[id].points[0];}//First and last point get paired
        else{D = asteroids[id].points[zz+1];} //Points get paired

        CDm = function(){return Cx;}
        console.log(CDm());
        
        if(C[0]>D[0]){ //Making sure points are in order
            var temp = C;
            C = D;
            D = temp;
        }

        Cx = C[0]; //C is left-most point
        Cy = C[1];
        Dx = D[0]; //D is right-most point
        Dy = D[1];

        

        for(iz=0; iz<player.points.length; iz++){ //For  each player point
            var A = player.points[iz];

        }
    }
    return false;
}
/*function paCollide(id){
    return false;
}*/


function respawn(){
    respawnTime--;
    if(respawnTime>=0){setTimeout(respawn,1000);}
    else{
        respawnTime = -1;
        player.shipSize = 20;
        adjustPlayerAngle(0);
    }
}


function lockMove(){
    player.x = canvas.width/2;
    player.y = canvas.height/2;
    player.finDX = 0;
    player.finDY = 0;
    player.moveMag = 0;
}


function removeAst(){
    generateAsteroids(asteroids[removeID].size,asteroids[removeID].x,asteroids[removeID].y);
    asteroids.splice(removeID,1);
    removeID = -1;
}


function levelManager(){ //First level is 0, var starts at -1, gets increased
    level++;
    if(level==1){
        numAsteroids += 5;
    }
    generateAsteroids(0);
}
//


function main(){ //MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    if(frameAdvance){
        managePews();
        if(left){adjustPlayerAngle(-player.turnSpd);}
        if(right){adjustPlayerAngle(player.turnSpd);}
        if(up){player.thrust(true);}
        //else if(down){player.thrust(false);}
        else{player.applyDX=0; player.applyDY=0; player.dx=0; player.dy=0;}
        player.move();
        manageAsteroids();
        if(removeID!=-1){removeAst();}
        if(respawnTime!=-1||gameOver){lockMove();}
    }


        player.draw();
        for(a=0; a<asteroids.length; a++){asteroids[a].draw();}


    //
    timer = requestAnimationFrame(main);
}


levelManager();