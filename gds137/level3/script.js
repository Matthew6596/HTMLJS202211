var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var timer = setInterval(main, 1000/60);


document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

function keyDown(e){
    //console.log(e.key);
    if(e.key=="s"){p1.vy=8;}
    if(e.key=="w"){p1.vy=-8;}
    if(e.key=="ArrowUp"){p2.vy=-8;}
    if(e.key=="ArrowDown"){p2.vy=8;}
}
function keyUp(e){
    if(e.key=="w"||e.key=="s"){p1.vy=0;}
    if(e.key=="ArrowUp"||e.key=="ArrowDown"){p2.vy=0;}
}

var p1 = new Obj("joe",10,canvas.height/2,20,100,"rect",0,0);
p1.bouncy = 0;
var p2 = new Obj("not joe",canvas.width-10,canvas.height/2,20,100,"rect",0,0);
p2.bouncy = 0;

var p1Wins=0,p2Wins=0;

var ball = new Obj("Prof. Ball",canvas.width/2,canvas.height/2,20,20,"circle",5,5);
ball.bounded = false;
ball.color = "blue";
ball.vx*=-1;
ball.vy = 0;

/*-------------Main------------*/
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //

    p1.move();
    p2.move();
    ball.move();
    ball.bounceIn(-100,0,canvas.width+100,canvas.height);
    if(ball.x<-ball.radius||ball.x>canvas.width+ball.radius){
        if(ball.x<-ball.radius){p2Wins++;}
        else{p1Wins++;}
        ball.x=canvas.width/2;
        ball.y=canvas.height/2;
    }
    paddleCollision(p1,1);
    paddleCollision(p2,-1);

    p1.draw();
    p2.draw();
    drawText("Player 1 | Player 2", canvas.width/2,20);
    drawText(p1Wins+" - "+p2Wins, canvas.width/2,40);
    ball.draw();

}

function paddleCollision(pd,leftRight){
    var xOffset = (pd.radius+ball.radius)*leftRight;
    var xBool;
    if(leftRight==1){xBool = ball.x<pd.x+xOffset;}
    else{xBool = ball.x>pd.x+xOffset;}
    if(xBool){
        if(ball.y>pd.y-pd.height/2-ball.radius&&ball.y<pd.y+pd.height/2+ball.radius){

            ball.x = pd.x+xOffset;
            ball.vx *= -1;

            if(ball.y>pd.y+pd.height/6){
                ball.vy = 5;
            }
            else if(ball.y<pd.y-pd.height/6){
                ball.vy = -5;
            }
            
        }
    }
}

function drawText(text,x=0,y=0,fill="black",align="center"){
    ctx.save();
    ctx.fillStyle = fill;
    ctx.textAlign = align;
    ctx.fillText(text,x,y)
    ctx.restore();
}