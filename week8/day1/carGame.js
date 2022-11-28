//Vars
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);

var start = 50;
var finish = 750;
var carX = 2;
var wKey = false;
var startFuel = [];
var fuelUses = [];
var speeds = [];
var fuelBarWidth = 300;
var gameOver = true;
var winner = "none";
var cars = [];

var seconds = 3;
var fps = 60;
var frames = fps

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

    this.draw = function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,(canvas.height/2)+this.y,40,20);
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
    frames = fps
    cars[0] = new Car(startFuel[0],"red",speeds[0],fuelUses[0],30);
    cars[1] = new Car(startFuel[1],"green",speeds[1],fuelUses[1],0);
    cars[2] = new Car(startFuel[2],"blue",speeds[2],fuelUses[2],-30);
}
function drawStartFinish(fill){
    ctx.fillStyle = fill;
    ctx.fillRect(start,50,10,500);
    ctx.fillRect(finish,50,10,500);
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
        if(wKey&&cars[num].fuel>0){cars[num].move();}
        ctx.font = "12px Arial";
        ctx.textAlign = "left";
        ctx.fillStyle = cars[num].color;
        ctx.fillText("Fuel: "+cars[num].fuel,60*num,10);
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
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.textAlign = "center";
    ctx.fillText(seconds,canvas.width/2,canvas.height/2);
}
function holdWText(){
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Hold W!",canvas.width-20,20);
    
}
function drawResults(){
    for(num=0;num<cars.length;num++){
        if(cars[num].x+40>finish){
            ctx.fillStyle = cars[num].color;
            ctx.font = "25px Arial";
            ctx.textAlign = "center";
            if(num==0&&(winner=="none"||winner=="red")){ctx.fillText("Red Car Won!",canvas.width/2,canvas.height/2); winner="red";}
            if(num==1&&(winner=="none"||winner=="green")){ctx.fillText("Green Car Won!",canvas.width/2,canvas.height/2); winner="green";}
            if(num==2&&(winner=="none"||winner=="blue")){ctx.fillText("Blue Car Won!",canvas.width/2,canvas.height/2); winner="blue";}
            ctx.fillStyle = "black";
            ctx.fillText("Press Space to Restart",canvas.width/2,(canvas.height/2)+30);
        }
    }
}
//Main
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    if(gameOver){
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Press Space to Start", canvas.width/2, canvas.height/2);
    }else{
        if(seconds>0){wKey=false; runStartTimer(); drawStartTimer();}
        drawStartFinish("black");
        carsFunc();
        drawFuelBar();
        holdWText();
        for(num=0;num<cars.length;num++){
            if(cars[num].x>finish || cars[num].fuel<=0){drawResults();}
        }
        if((cars[0].fuel==0&&cars[1].fuel==0&&cars[2].fuel==0)&&(winner=="none"||winner=="bruh")){
            ctx.fillStyle = "black";
            ctx.font = "25px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Nobody Won!",canvas.width/2,canvas.height/2); winner="bruh";
            ctx.fillText("Press Space to Restart",canvas.width/2,(canvas.height/2)+30);
        }
    }
    //
    timer = requestAnimationFrame(main);
}