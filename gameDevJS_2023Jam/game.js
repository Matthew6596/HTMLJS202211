var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var timer = setInterval(main,1000/60);

document.addEventListener("mousemove",function(e){updateMousePos(e);});

function updateMousePos(e){
    var rect = canvas.getBoundingClientRect();
    mousex = Math.round(e.clientX - rect.left);
    mousey = Math.round(e.clientY - rect.top);
}

/*-----------------------------------INPUT-----------------------------------*/
var mousex = 0;
var mousey = 0;
function mouseInside(l,r,t,b){
    if(context=="ctx"){
        return ((mousex>l)&&(mousex<r))&&((mousey>t)&&(mousey<b));
    }
}
function mouseInsideObj(obj){
    return mouseInside(obj.left,obj.right,obj.top,obj.bottom);
}

document.addEventListener("keydown",documentKeyDown);
document.addEventListener("keyup",documentKeyUp);
document.addEventListener("click",onUserClick);

var a_KeysPressed = [];
var onClick = function(){console.log("userhasclicked");}

function documentKeyDown(e){
    var eventKey = e.key.toLowerCase();
    if(!a_KeysPressed.includes(eventKey)){
        a_KeysPressed.push(eventKey);
    }
}
function documentKeyUp(e){
    var eventKey = e.key.toLowerCase();
    if(a_KeysPressed.includes(eventKey)){
        for(var dkd=0; dkd<a_KeysPressed.length; dkd++){
            if(a_KeysPressed[dkd]==eventKey){
                a_KeysPressed.splice(dkd,1);
                break;
            }
        }
    }
}

function getKey(key){
    return a_KeysPressed.includes(key.toLowerCase());
}

function getAllKeys(arr){
    for(var gak=0; gak<arr.length; gak++){
        if(!a_KeysPressed.includes(arr[gak])){return false;}
    }
    return true;
}

function getAnyKey(arr){
    for(var gak=0; gak<arr.length; gak++){
        if(a_KeysPressed.includes(arr[gak])){return true;}
    }
    return false;
}

function onUserClick(){
    if(mouseInside(0,canvas.width,0,canvas.height)){
        onClick();
    }
}
/*-----------------------------------UTILITY-----------------------------------*/

function randNum(low, high){return Math.random()*(high-low)+low;}
function randInt(lo, hi){return Math.round(randNum(lo, hi))}
function getDist(x1,y1,x2,y2){return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));}
function percent(chance){ return (randNum(0,100)<=chance)}

/*-----------------------------------OBJECTS-----------------------------------*/
function Obj(x=0,y=0,w=100,h=100){
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.force = 1;
    this.friction = 0.95;
    this.dir = 1;
    this.width = w;
    this.height = h;
    this.color = "red";
    this.controls = false;

    this.left = this.x-this.width/2;
    this.right = this.x+this.width/2;
    this.top = this.y-this.height/2;
    this.bottom = this.y+this.height/2;

    this.draw = function(shape="rect"){
        var halfW = this.width/2
        var halfH = this.height/2
        if(shape=="rect"){
            ctx.save();
            ctx.translate(this.x,this.y);
            ctx.fillStyle = this.color;
            ctx.fillRect(-halfW,-halfH,this.width,this.height);
            ctx.restore();
        }else if(shape=="circle"){
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.translate(this.x,this.y);
            ctx.arc(0,0,halfW,0,Math.PI/180,true)
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    this.move = function(){
        if(this.controls){
            this.controller();
        }
        this.vx*=this.friction;
        this.vy*=this.friction;

        this.x += this.vx;
        this.y += this.vy;

        this.refreshColPoints();
    }

    this.controller = function(){
        if(getAnyKey(["w","arrowup"])){
            this.vy -= this.force;
        }
        if(getAnyKey(["s","arrowdown"])){
            this.vy += this.force;
        }
        if(getAnyKey(["a","arrowleft"])){
            this.vx -= this.force;
        }
        if(getAnyKey(["d","arrowright"])){
            this.vx += this.force;
        }
        if(getKey("shift")){
            this.force = 0.9;
        }else{
            this.force = 0.6;
        }
    }

    this.refreshColPoints = function(){
        this.left = this.x-this.width/2;
        this.right = this.x+this.width/2;
        this.top = this.y-this.height/2;
        this.bottom = this.y+this.height/2;
    }
}
/*-----------------------------------VARIABLES-----------------------------------*/
var player = new Obj(100,100,20,20);
player.force = 0.6;
player.friction = 0.85;
player.controls = true;

/*-----------------------------------MAIN-----------------------------------*/
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    player.move();
    player.draw();
}