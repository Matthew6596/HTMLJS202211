var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var interval = setInterval(main, 1000/60);

//

var ball = new Ball("joe");

function Ball(name="Unnamed Ball :("){
    this.name = name;
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.width = 80;
    this.height = "i forgot";
    this.radius = this.width/2
    this.color = "green";
    this.force = 0;
    this.vx = 4;
    this.vy = 2;

    this.draw = function(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI/180,true)
        ctx.closePath();
        ctx.fill();
    }

    this.move = function(){
        this.x+=this.vx;
        this.y+=this.vy;

        if(this.x+this.radius>=canvas.width||this.x-this.radius<=0){this.vx*=-1; this.color="blue";}
        if(this.y+this.radius>=canvas.height||this.y-this.radius<=0){this.vy*=-1; this.color="green";}
    }
}


/*-------------Main------------*/
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //

    ball.draw();
    ball.move();

}