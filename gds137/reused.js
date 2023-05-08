function Obj(name="Unnamed :(",x=canvas.width/2,y=canvas.height/2,width=80,height=80,shape="rect",vx=0,vy=0){
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = this.width/2
    this.color = "green";
    this.force = 0;
    this.vx = vx;
    this.vy = vy;
    this.ax = 0;
    this.ay = 0;
    this.maxVx = 1;
    this.maxVy = 1;
    this.shape = shape;
    this.bouncy = 1;
    this.bounded = true;
    this.hitEdge = false;
    this.dir = 1; //reuse as angle in radian
    this.angle = 0;
    this.mag = 0;
    this.movement = [this.mag,this.angle];
    this.friction = 0;
    this.maxMag = 0;
    this.health = 100;

    this.left = this.x-this.radius;
    this.right = this.x+this.radius;
    this.top = this.y-this.height/2;
    this.bottom = this.y+this.height/2;

    this.draw = function(){
        switch(this.shape){
            case "circle":
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.translate(this.x,this.y);
                ctx.arc(0,0,this.radius,0,Math.PI/180,true)
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;
            case "rect":
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.translate(this.x,this.y);
                ctx.rotate((this.angle+90)*Math.PI/180);
                ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
                ctx.restore();
                break;
        }
    }

    this.move = function(){
        this.vx += this.ax*this.dir;
        this.vy += this.ay*this.dir;

        if(this.vx>this.maxVx){this.vx=this.maxVx;}
        else if(this.vx<-this.maxVx){this.vx=-this.maxVx;}
        if(this.vy>this.maxVy){this.vy=this.maxVy;}
        else if(this.vy<-this.maxVy){this.vy=-this.maxVy;}

        this.x+=this.vx;
        this.y+=this.vy;

        this.updateColPoints();
        if(this.bounded){this.bounceIn(0,0,canvas.width,canvas.height);}
    }

    this.updateColPoints = function(){
        this.left = this.x-this.radius;
        this.right = this.x+this.radius;
        this.top = this.y-this.height/2;
        this.bottom = this.y+this.height/2;
    }

    this.bounceIn = function(x1,y1,x2,y2){
        if(this.right>x2||this.left<x1){
            if(this.right>x2){this.x=x2-this.radius;}
            else{this.x=x1+this.radius;}
            this.vx*=-this.bouncy;
            this.hitEdge = true;
        }
        else if(this.bottom>y2||this.top<y1){
            if(this.bottom>y2){this.y=y2-this.height/2;}
            else{this.y=y1+this.height/2;}
            this.vy*=-this.bouncy;
            this.hitEdge = true;
        }
        else{this.hitEdge=false;}
    }
    this.collides = function(obj,x1=0,y1=0,x2=1,y2=1){
        if(obj!=-1){x1=obj.left; y1=obj.top; x2=obj.right; y2=obj.bottom;}
        return (((this.right>=x1)
        &&(this.left<=x2))&&
        ((this.bottom>=y1)
        &&(this.top<=y2)));
    }
}

function funnyFunction(){
    while(true){
        console.log("Poptartsus");
    }
}



var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

/*Input*/
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

function keyDown(e){
    //console.log(e.key);
    if(e.key=="a"){a=true;}
    if(e.key=="d"){d=true;}
    if(e.key=="w"){w=true;}
    if(e.key=="s"){s=true;}
    if(e.key=="e"){ek=true;}
    if(e.which==32){space=true;}
}
function keyUp(e){
    if(e.key=="a"){a=false;}
    if(e.key=="d"){d=false;}
    if(e.key=="s"){s=false;}
    if(e.key=="w"){w=false;}
    if(e.key=="e"){ek=false;}
    if(e.which==32){space=false;}
}
//

/*Variable Declarations*/

var a = false;
var d = false;
var w = false;
var s = false;
var space = false;
var ek = false;

function randNum(low, high){return Math.random()*(high-low)+low;}
function randInt(lo, hi){return Math.round(randNum(lo, hi))}

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