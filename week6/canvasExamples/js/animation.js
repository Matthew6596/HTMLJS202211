var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var timer = requestAnimationFrame(main);
var x = 100;
var y = 300;
var r = 20;
var xspd = 2;
var yspd = 2;
var yacc = 0.1;
var marioSize = 50;
var grow = true;
var mario = new Image();
mario.src = "images/mario.png";
mario.onload = function(){main();}

var bg = new Image();
bg.src = "images/galaxy.jfif";
bg.onload = function(){main();}

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    /*
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
    */
    //draw sprite image
    ctx.drawImage(bg,0,0,canvas.width,canvas.height);
    ctx.drawImage(mario, x, y, marioSize, marioSize);
    //marioSize++;
    x+=xspd;
    y+=yspd;
    yspd+=yacc;
    if((y>canvas.height-marioSize || y<=0)&&(x>canvas.width-marioSize || x<=0)){
        xspd=(Math.abs(xspd)+2);
        yspd=(Math.abs(yspd)+2);
    }
    if(y>=canvas.height-marioSize){
        //marioSize = 20+Math.random(20,100)*100;
        //y=-marioSize;
        yspd = -yspd
    }
    if(yspd>=7){
        yspd=7;
    }
    if(x>canvas.width-marioSize || x<0){
        //marioSize = 20+Math.random(20,100)*100;
        //x=-marioSize;
        xspd = -xspd
    }
    timer = requestAnimationFrame(main);
}

