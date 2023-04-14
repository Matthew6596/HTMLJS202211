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
    if(e.key=="w"){w=true;}
    if(e.key=="s"){s=true;}
    if(e.which==32){space=true;}
}
function keyUp(e){
    if(e.key=="a"){a=false;}
    if(e.key=="d"){d=false;}
    if(e.key=="s"){s=false;}
    if(e.key=="w"){w=false;}
    if(e.which==32){space=false;}
}
//

/*Variable Declarations*/

var a = false;
var d = false;
var w = false;
var s = false;
var space = false;

var color = [0,0,0]

/*Main*/
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    canvas.style.backgroundColor = "rgb("+color[0]+","+color[1]+","+color[2]+")";
    ctx.font = "160px monospace";
    ctx.textAlign = "center";
    ctx.fillText("amongus",canvas.width/2,canvas.height/2);
}


var lightenRate = 100;
setTimeout(lightenScreen,lightenRate);
function lightenScreen(){
    if(color[0]<245){
        for(var ls=0; ls<3; ls++){
            color[ls]++;
        }
        setTimeout(lightenScreen,lightenRate);
    }
}