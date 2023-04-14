var timer = setInterval(main,1000/60);

/*Variable Declarations*/
var player = new Obj("joe",canvas.width/2,canvas.height-50,50,50,"rect",0,0);
player.color = "#FFFF00";
player.maxVx = 100;
player.maxVy = 100;
player.force = 2;
player.bouncy = 0;

var score = 0;
var hazards = [];
var items = [];

var currentState = "default";

var fX = 0.85;

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    playerMove();
    for(var i=0; i<5; i++){
        hazards[i].move();
        items[i].move();

        objLoop(hazards[i]);
        objLoop(items[i]);

        if(player.collides(hazards[i])){
            currentState = "ouch";
            setTimeout(function(){currentState="default";},500);
            gameStart();
        }
        if(player.collides(items[i])){
            currentState = "yay!";
            setTimeout(function(){currentState="default";},500);
            score++;
            resetObj(items[i]);
        }

        //
        hazards[i].draw();
        items[i].draw();
    }

    doStates();

    //
    player.draw();
    drawScore();
}

function drawScore(){
    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Score: "+score,30,30);
    ctx.restore();
}

function gameStart(){
    hazards = [];
    items = [];
    score = 0;
    for(var i=0; i<5; i++){
        hazards.push(new Obj("grr",randNum(0,canvas.width),randNum(0,canvas.height)-canvas.height,30,30,"circle",0,randNum(3,6)));
        hazards[i].color = "red";
        hazards[i].maxVy = 100;
        hazards[i].bounded = false;
        items.push(new Obj("yay",randNum(0,canvas.width),randNum(0,canvas.height)-canvas.height,30,30,"rect",0,randNum(3,6)));
        items[i].color = "green";
        items[i].maxVy = 100;
        items[i].bounded = false;
    }
}

function playerMove(){
    if(a){
        player.vx += -player.force
    }
    if(d){
        player.vx += player.force
    }
    player.vx *= fX;
    player.x += player.vx;

    player.updateColPoints();
    player.bounceIn(0,0,canvas.width,1000);
}

function objLoop(obj){
    if(obj.top>canvas.height){
        resetObj(obj);
    }
}

function resetObj(obj){
    obj.y = -obj.height;
    obj.vy = randNum(3,6);
    obj.x = randNum(0,canvas.width);
}

function doStates(){
    switch(currentState){
        case ("default") : 
        player.color = "#FFFF00";
        break;
        case ("ouch") : 
        player.color = "red";
        break;
        case ("yay!") : 
        player.color = "lime";
        break;
    }
}

gameStart();