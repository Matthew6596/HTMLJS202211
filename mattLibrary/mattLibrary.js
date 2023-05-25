/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
mattLibrary.js by Matthew A. Satterfield - (begun 05/21/2023)
Version 0

To Do:
    -uhhh idk

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*--------------------------CANVAS/BASIC-STUFF--------------------------*/
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var timer = setInterval(main,1000/60);

/*--------------------------FUNCTIONS--------------------------*/
function randNum(low, high){return Math.random()*(high-low)+low;}
function randInt(lo, hi){return Math.round(randNum(lo, hi));}
function percent(chance){ return (randNum(0,100)<=chance);}

function toRadians(deg){return deg*(Math.PI/180);}
function toDegrees(rad){return rad*(180/Math.PI);}

function getAngle(a,b){return toDegrees(Math.atan2(b,a));}
function getMag(a,b){return Math.hypot(a,b);}
function getPoint(vect,XorY){
    if(XorY=="x"){return Math.cos(toRadians(vect[1]))*vect[0];}
    else if(XorY=="y"){return Math.sin(toRadians(vect[1]))*vect[0];}
}
function getCircum(radius){return (2*Math.PI*radius);}
function getRotatePercent(amount,radius){return amount/getCircum(radius);}

function follow(obj,target,rate){
    var dx = target.x-obj.x;
    var dy = target.y-obj.y;
    obj.vx = dx*rate;
    obj.vy = dy*rate;
}

function draw(arr){
    for(var dr=0; dr<arr.length; dr++){
        arr[dr].draw();
    }
}
function move(arr){
    for(var dr=0; dr<arr.length; dr++){
        arr[dr].move();
    }
}

function pointIn(x,y,obj){
    return ((x>=obj.left())&&(x<=obj.right()))&&((y>=obj.top())&&(y<=obj.bottom()));
}

/*--------------------------INPUT--------------------------*/
var mousex = 0;
var mousey = 0;
function mouseInside(l,r,t,b){
    return ((mousex>l)&&(mousex<r))&&((mousey>t)&&(mousey<b));
}
function mouseInsideObj(obj){
    return mouseInside(obj.left(),obj.right(),obj.top(),obj.bottom());
}

function updateMousePos(e){
    var rect = canvas.getBoundingClientRect();
    mousex = Math.round(e.clientX - rect.left);
    mousey = Math.round(e.clientY - rect.top);
}

document.addEventListener("mousemove",function(e){updateMousePos(e);});
document.addEventListener("keydown",documentKeyDown);
document.addEventListener("keyup",documentKeyUp);
document.addEventListener("click",onUserClick);
document.addEventListener("keypress",onKeyPress);

var a_KeysDown = [];
var a_KeysPressed = [];
var onClick = function(){}
var justStarted = false;

function onKeyPress(e){
    var eventKey = e.code.toLowerCase();
    //console.log(eventKey);
    if(!a_KeysPressed.includes(eventKey)){
        a_KeysPressed.push(eventKey);
    }
}

function documentKeyDown(e){
    var eventKey = e.code.toLowerCase();
    //console.log(eventKey);
    if(!a_KeysDown.includes(eventKey)){
        a_KeysDown.push(eventKey);
    }
}
function documentKeyUp(e){
    var eventKey = e.code.toLowerCase();
    if(a_KeysDown.includes(eventKey)){
        for(var dkd=0; dkd<a_KeysDown.length; dkd++){
            if(a_KeysDown[dkd]==eventKey){
                a_KeysDown.splice(dkd,1);
                break;
            }
        }
    }
}

function getKey(key){
    return a_KeysDown.includes(key.toLowerCase());
}

function getKeyPress(key){
    return a_KeysPressed.includes(key.toLowerCase());
}

function getAllKeys(arr){
    for(var gak=0; gak<arr.length; gak++){
        if(!a_KeysDown.includes(arr[gak].toLowerCase())){return false;}
    }
    return true;
}

function getAnyKey(arr){
    for(var gak=0; gak<arr.length; gak++){
        if(a_KeysDown.includes(arr[gak].toLowerCase())){return true;}
    }
    return false;
}

function onUserClick(){
    if(mouseInside(0,canvas.width,0,canvas.height)){
        onClick();
    }
}
/*--------------------------OBJECTS--------------------------*/
function Obj(obj){
    this.x = 0;
    this.y = 0;

    this.width = 1;
    this.height = 1;
    this.radius = this.width/2
    this.color = "rgba(0,0,0,0)";
    this.stroke = "rgba(0,0,0,0)";
    this.lineWidth = 1;
    this.force = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.shape = "rect";
    this.angle = 0;
    this.friction = 1;
    this.currentState = "default";

    //P for properties, extra obj properties you may want to add
    this.p = {
        health:100, //Sample Property
    };

    //States for this obj
    this.states = {
        "default":function(){/*code*/}, //Sample State
    }

    if(obj!== undefined)
    {
        for(value in obj)
        {
            if(this[value]!== undefined)
            this[value] = obj[value];
        }
    }

    this.draw = function(){
        switch(this.shape){
            case "circle":
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.strokeStyle = this.stroke;
                ctx.lineWidth = this.lineWidth;
                ctx.beginPath();
                ctx.translate(this.x,this.y);
                ctx.arc(0,0,this.radius,0,Math.PI/180,true)
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                break;
            case "rect":
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.strokeStyle = this.stroke;
                ctx.lineWidth = this.lineWidth;
                ctx.translate(this.x,this.y);
                ctx.rotate(toRadians(this.angle));
                ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
                ctx.strokeRect(-this.width/2,-this.height/2,this.width,this.height);
                ctx.restore();
                break;
        }
    }

    this.move = function(){
        this.vx*=this.friction;
        this.vy*=this.friction;
        this.x += this.vx;
        this.y += this.vy;
    }

    this.left = function(){return this.x-this.width/2;}
    this.right = function(){return this.x+this.width/2;}
    this.top = function(){return this.y-this.height/2;}
    this.bottom = function(){return this.y+this.height/2;}

    this.hits = function(obj){
        return (((this.right()>=obj.left())
        &&(this.left()<=obj.right()))&&
        ((this.bottom()>=obj.top())
        &&(this.top()<=obj.bottom())));
    }
    this.collides = function(obj){
        if(this.hits(obj)){
            var a_temp = [
                Math.abs(this.right()-obj.left()),
                Math.abs(this.left()-obj.right()),
                Math.abs(this.bottom()-obj.top()),
                Math.abs(this.top()-obj.bottom()),
            ];
            a_temp.sort(function(a, b){return b-a});

            switch(a_temp[3]){
                case(Math.abs(this.right()-obj.left())):
                while(this.right()>obj.left()){
                    this.x--;
                }
                this.vx=0;
                break;
                case(Math.abs(this.left()-obj.right())):
                while(this.left()<obj.right()){
                    this.x++;
                }
                this.vx=0;
                break;
                case(Math.abs(this.bottom()-obj.top())):
                while(this.bottom()>obj.top()){
                    this.y--;
                }
                this.vy=0;
                break;
                case(Math.abs(this.top()-obj.bottom())):
                while(this.top()<obj.bottom()){
                    this.y++;
                }
                this.vy=0;
                break;
            }
        }
    }

    this.doState = function(){
        this.states[this.currentState]();
    }
}

function Text(obj){
    this.x = 0;
    this.y = 0;

    this.vx = 0;
    this.vy = 0;
    this.friction = 1;
    this.angle = 0;

    this.text = "Text";
    this.color = "black";
    this.stroke = "black";
    this.lineWidth = 0;
    this.align = "center";
    this.font = "24px Arial";

    if(obj!== undefined)
    {
        for(value in obj)
        {
            if(this[value]!== undefined)
            this[value] = obj[value];
        }
    }

    this.draw = function(){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.lineWidth;
        ctx.textAlign = this.align;
        ctx.font = this.font;
        ctx.translate(this.x,this.y);
        ctx.rotate(toRadians(this.angle));
        ctx.fillText(this.text,0,0);
        ctx.strokeText(this.text,0,0);
        ctx.restore();
    }

    this.move = function(){
        this.x += this.vx*this.friction;
        this.y += this.vy*this.friction;
    }
}

/*--------------------------GAMESTATES/MAIN--------------------------*/
var currentState = "default";
var gamestates = {
    "default":function(){
        // "main" code
    }
}

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    gamestates[currentState]();
    a_KeysPressed = [];
}

/*--------------------------SCREEN-MOVEMENT--------------------------*/
var offset = {x:0,y:0};
var levelObjs = [];
var camTarget = {x:0,y:0}; //could set = to player
var camera = {x:0,y:0};
var camBorders = {l:-10000000,r:10000000,t:-10000000,b:10000000};

function moveCamera(rate){
    follow(camera,camTarget,rate);
    var _bool1 = ((player.x<canvas.width/2&&offset.x<camBorders.l)||(player.x>canvas.width/2&&offset.x>camBorders.r));
    var _bool2 = ((player.y<canvas.height/2&&offset.y<camBorders.t)||(player.y>canvas.height/2&&offset.y>camBorders.b));
    if(!_bool1){
        offset.x += camera.vx;
        for(var mc=0; mc<levelObjs.length; mc++){
            levelObjs[mc].x -= camera.vx;
        }
    }if(!_bool2){
        offset.y += camera.vy;
        for(var mc=0; mc<levelObjs.length; mc++){
            levelObjs[mc].y -= camera.vy;
        }
    }
}