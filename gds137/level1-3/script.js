var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var timer = setInterval(main,1000/60);


/*Input*/
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

function keyDown(e){
    //console.log(e.key);
    if(e.key=="a"){a=true;}
    if(e.key=="d"){d=true;}
}
function keyUp(e){
    if(e.key=="a"){a=false;}
    if(e.key=="d"){d=false;}
}
//

/*Variable Declarations*/

var a = false;
var d = false;

var player = new Obj("Bob",canvas.width/2,canvas.height-50,250,40,"rect");
player.maxVx = 10;
player.ax = 0;
player.bouncy = 0.2;
player.color = "cyan";
player.friction = 0.4;

var ball = new Obj("ball",canvas.width/2,canvas.height/2,80,80,"circle",5);
ball.color = "magenta";
ball.bouncy = 1;
ball.ay = 1;
ball.maxVx = 25;
ball.maxVy = 35;
ball.force = 2;

var score = 0;

//

/*Main*/
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //

    /*Ball Move*/

    ballCollision();
    ball.move();
    player.move();

    //Drawing Stuff
    ball.draw();
    player.draw();
    drawLine();
    drawScore();

    playerStuff();

}

/*Functions*/
function drawScore(){
    ctx.save();
    ctx.textAlign = "left";
    ctx.font = "16px Arial black";
    ctx.fillStyle = "#555555";
    ctx.fillText("Score: "+score,80,25);
    ctx.restore();
}

function playerStuff(){
    if(a||d){
        player.ax=1;
        player.dir = 0;
        if(d){player.dir++;}
        if(a){player.dir--;}
    }
    if(!d&&!a||player.dir==0){
        player.ax=0;
        if(player.vx>0){player.vx-=player.friction;}
        else if(player.vx<0){player.vx+=player.friction;}
        if(Math.abs(player.vx)<0.6){player.vx=0;}
    }
}

function ballCollision(){
    if(ball.collides(player)){

        //Left1
        if (ball.x<player.left+player.width/6){
        ball.vx = ball.force*-5;
        }

        //Left2
        else if (ball.x>player.left+player.width/6 && ball.x<player.left+player.width/3){
        ball.vx = -ball.force;
        }

        //Right1
        else if (ball.x>player.right-player.width/3 && ball.x<player.right-player.width/6){
        ball.vx = ball.force;
        }

        //Right2
        else if (ball.x>player.right-player.width/6){
        ball.vx = ball.force*5;
        }

        score++;
        ball.y=player.top-ball.radius;
        ball.vy=-35;

    }

    if(ball.y>=canvas.height-ball.radius){score=0; ball.vy*=0.67;}
    if(ball.y<ball.radius){ ball.vy=0;}
}

function drawLine(){
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(player.x,player.y);
    ctx.lineTo(ball.x,ball.y);
    ctx.stroke();
    ctx.restore();
}