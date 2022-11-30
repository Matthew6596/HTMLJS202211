var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);

var carImg = new Image();
carImg.src = "images/car.png";

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    
    //
    timer = requestAnimationFrame(main);
}