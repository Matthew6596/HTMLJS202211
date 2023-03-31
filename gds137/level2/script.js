var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var timer = setInterval(main, 1000/60);


document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

function keyDown(e){
    console.log(e.key);
    if(e.key=="s"){p1.vy=8;}
    if(e.key=="w"){p1.vy=-8;}
}
function keyUp(e){
    if(e.key=="w"||e.key=="s"){p1.vy=0;}
}

var p1 = new Obj("joe",0,canvas.height/2,20,100,"rect",0,0);
p1.bouncy = 0;

/*-------------Main------------*/
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //

    p1.move();
    p1.draw();

}