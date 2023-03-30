var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var timer = requestAnimationFrame(main);

//

var ball = new Ball("joe");

function Ball(name="Unnamed Ball :("){
    this.name = name;
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.width = 80;
    this.height = "i forgot";
    this.color = "green";
    this.force = 0;
    this.vx = 0;
    this.vy = 0;

    this.draw = function(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.width/2,0,Math.PI/180,true)
        ctx.closePath();
        ctx.fill();
    }

    this.move = function(){

    }
}


/*-------------Main------------*/
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //

    ball.draw();

    //
    timer = requestAnimationFrame(main);
}