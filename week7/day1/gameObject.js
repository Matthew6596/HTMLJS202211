var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var timer = requestAnimationFrame(main);
var acc = 0.2;

function randomRange(low,high){
    return Math.random()*(high - low) + low;
}

function GameObject(){
    //examples of properties of a class
    this.width = randomRange(10,150);
    this.height = randomRange(10,150);
    this.radius = randomRange(20,75);
    this.x = randomRange(0+this.radius,canvas.width-this.radius);
    this.y = randomRange(0+this.radius,canvas.height-this.radius);
    this.color = `rgb(${randomRange(0,255)},${randomRange(0,255)},${randomRange(0,255)})`;
    this.vx = randomRange(0.2,7);
    this.vy = randomRange(0.4,4);

    //example of method or function
    this.drawSquare = function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x-this.width,this.y-this.height,this.width,this.height);
    }
    this.drawCircle = function(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    this.move = function(){
        //move
        this.vy += acc;
        this.x += this.vx;
        this.y += this.vy;
        //collision
        if(this.x<0+this.radius || this.x>canvas.width-this.radius){this.vx *= -1;}
        if(this.y>canvas.height-this.radius && this.radius>1){this.vy *= -1; this.vy-=acc; this.radius-=1}
        if(this.y<0+this.radius){this.vy*=-1;}
    }
}

/*var sqaure1 = new GameObject();
var sqaure2 = new GameObject();

sqaure1.drawSquare();
sqaure2.drawSquare();*/

var squares = [];
var numSquares = 14;

for(var i = 0; i<numSquares; i++){
    squares[i] = new GameObject();
    squares[i].drawSquare();
}

var circles = [];
var numCircles = 8;

for(var i = 0; i<numCircles; i++){
    circles[i] = new GameObject();
    circles[i].drawCircle();
}

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(var i = 0; i<circles.length; i++){
        circles[i].move();
        circles[i].drawCircle();
    }
    timer = requestAnimationFrame(main);
}
main();