//Vars
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);

var start = 58;
var finish = 956;
var carX = 2;
var wKey = false;
var startFuel = [];
var fuelUses = [];
var speeds = [];
var fuelBarWidth = 512;
var gameOver = true;
var winner = "none";
var cars = [];
var startFinishW = 10;

var rStar = new Image();
rStar.src = "images/rStar.png";
var gStar = new Image();
gStar.src = "images/gStar.png";
var bStar = new Image();
bStar.src = "images/bStar.png";
bStar.onload = function(){main();}

var seconds = 3;
var fps = 60;
var frames = fps;

reset();

console.log(cars[0].fuel);
console.log(cars[1].fuel);
console.log(cars[2].fuel);

//Listeners
document.addEventListener("keydown",keyDown)
document.addEventListener("keyup",keyUp)

//Objects
function Car(fuel,color,spd,use,hi){
    this.fuel = fuel;
    this.color = color;
    this.x = carX;
    this.fuelUse = use;
    this.speed = spd;
    this.y = hi;
    this.carW = 40;
    this.carH = 20;

    this.draw = function(){
        var img = 0;
        if(this.color=="red"){img=rStar;}
        if(this.color=="green"){img=gStar;}
        if(this.color=="blue"){img=bStar;}
        ctx.fillStyle = this.color;
        ctx.drawImage(img,this.x,(canvas.height/2)+this.y-this.carH,this.carW,this.carH);
    }
    this.move = function(){
        this.x+=this.speed;
        this.fuel-=this.fuelUse;
    }
}
//Functions
function keyDown(e){
    if(e.which==87){wKey=true;}
    if(e.which==32&&gameOver){gameOver=false;}
    if(e.which==32&&winner!="none"){gameOver=false;reset();}
}
function keyUp(e){
    if(e.which==87){wKey=false;}
}
function randNum(high,low){
    return Math.round(Math.random()*(high-low)+low);
}
function reset(){
    winner = "none";
    startFuel = [randNum(canvas.width, 400),randNum(canvas.width, 400),randNum(canvas.width, 400)];
    fuelUses = [randNum(4,1),randNum(4,1),randNum(4,1)];
    speeds = [Math.random()+randNum(3,1),Math.random()+randNum(3,1),Math.random()+randNum(3,1)];
    seconds = 3;
    fps = 60;
    frames = fps;
    cars[0] = new Car(startFuel[0],"red",speeds[0],fuelUses[0],100);
    cars[1] = new Car(startFuel[1],"green",speeds[1],fuelUses[1],0);
    cars[2] = new Car(startFuel[2],"blue",speeds[2],fuelUses[2],-100);
}
function drawStartFinish(){
    ctx.fillStyle = "black";
    var disFromScrn = 200;
    for(i=0;i<35;i++){
        if(i%2==0){ctx.fillStyle="black";ctx.strokeStyle="white";}
        else{ctx.fillStyle="white";ctx.strokeStyle="black";}
        ctx.fillRect(start,disFromScrn+(i*startFinishW),startFinishW,startFinishW);
        ctx.strokeRect(start,disFromScrn+(i*startFinishW),startFinishW,startFinishW);
        ctx.fillRect(finish,disFromScrn+(i*startFinishW),startFinishW,startFinishW);
        ctx.strokeRect(finish,disFromScrn+(i*startFinishW),startFinishW,startFinishW);
    }
    
}
function drawFuelBar(){
    for(num=0;num<cars.length;num++){
        var h = 30+(num*15);
        var currentBarWidth = fuelBarWidth * (cars[num].fuel/startFuel[num]);
        ctx.fillStyle = "darkGrey";
        ctx.fillRect(start, h, fuelBarWidth, 10);
        if(cars[num].fuel>0){
            ctx.fillStyle = cars[num].color;
            ctx.fillRect(start,h,currentBarWidth,10);
        }
    }
}
function carsFunc(){
    for(num=0;num<cars.length;num++){
        if(wKey&&cars[num].fuel>0&&winner=="none"){cars[num].move();}
        ctx.font = "12px Courier New";
        ctx.textAlign = "left";
        ctx.fillStyle = cars[num].color;
        ctx.fillText("Energy: "+cars[num].fuel,(100*num)+180,20);
        if(cars[num].fuel<0){cars[num].fuel=0;}
        cars[num].draw();
    }
}
function runStartTimer(){
    frames--;
    if(frames<0){
        frames = fps;
        seconds--;
    }
}
function drawStartTimer(){
    ctx.fillStyle = "gold";
    ctx.strokeStyle = "lightgrey";
    ctx.font = "48px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(seconds,canvas.width/2,canvas.height/2);
    ctx.strokeText(seconds,canvas.width/2,canvas.height/2);
}
function holdWText(){
    ctx.fillStyle = "gold";
    ctx.strokeStyle = "lightgrey";
    ctx.font = "24px Courier New";
    ctx.textAlign = "right";
    ctx.fillText("Hold W!",canvas.width-60,60);
    ctx.strokeText("Hold W!",canvas.width-60,60);
    
}
function drawResults(){
    for(num=0;num<cars.length;num++){
        if(cars[num].x-startFinishW>finish){
            ctx.fillStyle = cars[num].color;
            ctx.font = "25px Courier New";
            ctx.textAlign = "center";
            if(num==0&&(winner=="none"||winner=="red")){ctx.fillText("Red Star Won!",canvas.width/2,canvas.height/2); winner="red";}
            if(num==1&&(winner=="none"||winner=="green")){ctx.fillText("Green Star Won!",canvas.width/2,canvas.height/2); winner="green";}
            if(num==2&&(winner=="none"||winner=="blue")){ctx.fillText("Blue Star Won!",canvas.width/2,canvas.height/2); winner="blue";}
            ctx.fillStyle = "gold";
            ctx.fillText("Press Space to Restart",canvas.width/2,(canvas.height/2)+30);
        }
    }
}
//Main
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    if(gameOver){
        ctx.fillStyle = "gold";
        ctx.strokeStyle = "lightgrey";
        ctx.font = "30px Courier New";
        ctx.textAlign = "center";
        ctx.fillText("Press Space to Start", canvas.width/2, canvas.height/2);
        ctx.strokeText("Press Space to Start", canvas.width/2, canvas.height/2);
    }else{
        if(seconds>0){wKey=false; runStartTimer(); drawStartTimer();}
        drawStartFinish();
        carsFunc();
        drawFuelBar();
        holdWText();
        for(num=0;num<cars.length;num++){
            if(cars[num].x>finish || cars[num].fuel<=0){drawResults();}
        }
        if((cars[0].fuel==0&&cars[1].fuel==0&&cars[2].fuel==0)&&(winner=="none"||winner=="bruh")){
            ctx.fillStyle = "gold";
            ctx.font = "25px Courier New";
            ctx.textAlign = "center";
            ctx.fillText("Nobody Won!",canvas.width/2,canvas.height/2); winner="bruh";
            ctx.fillText("Press Space to Restart",canvas.width/2,(canvas.height/2)+30);
        }
    }
    //
    timer = requestAnimationFrame(main);
}