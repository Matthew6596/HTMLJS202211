var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var p4 = document.getElementById("p4");
var timer = 0;

document.addEventListener("click", onClick);

var active = false;
var loading = false;
var mousex = 0;
var mousey = 0
var x = 400;
var y = 300;
var xv = 2
var yv = 2

ctx.font = "32px Arial";
ctx.strokeRect(300,200,200,200);
ctx.fillText("Click the box to start",250,150);
p4.volume = 0.5;

//document.addEventListener("keypress", onKeyPress)

function mouseInside(mousex, mousey, x1,x2,y1,y2){
    if(mousex>=x1&&mousex<=x2&&mousey>=y1&&mousey<=y2){return true;}
    else{return false;}
}

function onClick(e){
    var rect = canvas.getBoundingClientRect();
    mousex = Math.round(e.clientX - rect.left)
    mousey = Math.round(e.clientY - rect.top)
    if(mouseInside(mousex,mousey,300,500,200,400)){
        if(!loading&&!active){loading = true; main(); p4.play();}
    }
}

function hit(){
    p4.play();
    p4.currentTime = 0;
}

function main(){
    if(loading){
        console.log("loading...");
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillText("Loading...",325,300);
        if(!p4.paused&&p4.currentTime>0.01){p4.pause(); loading = false; active = true; console.log("loaded!");}
    }
    if(active){
        ctx.fillStyle = "green";
        ctx.clearRect(0,0,canvas.width,canvas.height);

        x+=xv;
        y+=yv;

        if(x>=canvas.width-100 || x<=0){xv=-xv; hit();}
        if(y>=canvas.height-100 || y<=0){yv=-yv; hit();}

        ctx.fillRect(x,y,100,100);
    }
    timer = requestAnimationFrame(main);
}