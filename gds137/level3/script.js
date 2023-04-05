var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var timer = setInterval(main, 1000/60);


document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

function keyDown(e){
    if(e.key=="s"){p1.vy=8;}
    if(e.key=="w"){p1.vy=-8;}
}
function keyUp(e){
    if(e.key=="w"||e.key=="s"){p1.vy=0;}
}

var p1 = new Obj("joe",0,canvas.height/2,20,100,"rect",0,0);
p1.bouncy = 0;

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
    ball.move();
    ball.bounceIn(-100,0,canvas.width,canvas.height);
    if(ball.x<-ball.radius){ball.x=canvas.width/2;}
    paddleCollision();

    p1.draw();
    ball.draw();

}

function paddleCollision(){
    if(ball.x<p1.x+p1.radius+ball.radius){
        if(ball.y>p1.y-p1.height/2-ball.radius&&ball.y<p1.y+p1.height/2+ball.radius){

            ball.x = p1.x+p1.radius+ball.radius;
            ball.vx *= -1;

            if(ball.y>p1.y+p1.height/6){
                ball.vy = 5;
            }
            else if(ball.y<p1.y-p1.height/6){
                ball.vy = -5;
            }
            
        }
    }
}