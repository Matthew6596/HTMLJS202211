/*-------PREMADE THINGS FOR USE IN WEBGAME MAKER-------*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

document.addEventListener("mousemove",function(e){updateMousePos(e);});

function updateMousePos(e){
    var rect = canvas.getBoundingClientRect();
    mousex = Math.round(e.clientX - rect.left);
    mousey = Math.round(e.clientY - rect.top);
}

var interval = 1000/140; //1000/140
var timer = setInterval(pageMain, interval);

function drawObjs(arr,context){
    var ind = -1;
    if(arr.includes(pickedObj)){ind = pickedObjInd;}
    for(var dlo=0; dlo<arr.length; dlo++){
        if(dlo==ind){
            arr[dlo].draw(context);
        }else{
            arr[dlo].draw(arr[dlo].ctx);
        }
    }
}

/*Additional Code to be added by String:

function pageMain(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //cut and place mainCode here
    drawObjs(a_Objects,ctx);
}

//cut mainCode, and place remaining code here

*/

/*------------------------------------VARIABLES----------------------------------*/
var a_variables = [];
function makeVar(name,val){
    a_variables.push(new variable(name,val));
}
function setVar(name,val){
    for(var sv=0; sv<a_variables.length; sv++){
        if(a_variables[sv].name==name){
            a_variables[sv].value = val;
            break;
        }
    }
}
function getVar(name){
    for(var gv=0; gv<a_variables.length; gv++){
        if(a_variables[gv].name==name){
            return a_variables[gv].value;
        }
    }
}
function variable(name,value){
    this.name = name;
    this.value = value;
}

/*------------------------------------ARRAYS----------------------------------*/
var a_arrays = [];
function makeArr(name,val){
    a_arrays.push(new array(name,val));
}
function setArr(name,ind,val){
    for(var sv=0; sv<a_arrays.length; sv++){
        if(a_arrays[sv].name==name){
            a_arrays[sv].value[ind] = val;
            break;
        }
    }
}
function getArr(name){
    for(var gv=0; gv<a_arrays.length; gv++){
        if(a_arrays[gv].name==name){
            return a_arrays[gv].value;
        }
    }
}
function array(name,value){
    this.name = name;
    this.value = value;
    this.len = this.value.length;
}

/*------------------------------------UTILITY-FUNCTIONS----------------------------------*/
var mousex = 0;
var mousey = 0;
var mous2x = 0;
var mous2y = 0;
function mouseInside(l,r,t,b,context){
    if(context=="ctx"){
        return ((mousex>l)&&(mousex<r))&&((mousey>t)&&(mousey<b));
    }else{
        return ((mous2x>l)&&(mous2x<r))&&((mous2y>t)&&(mous2y<b));
    }
}
function mouseInsideObj(obj,context="ctx"){
    return mouseInside(obj.left,obj.right,obj.top,obj.bottom,context);
}
function randNum(low, high){return Math.random()*(high-low)+low;}
function randInt(lo, hi){return Math.round(randNum(lo, hi))}
function getDist(x1,y1,x2,y2){
    return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
}
function percent(chance){
    return (randNum(0,100)<=chance)
}

/*------------------------------------OBJECTS----------------------------------*/
var a_Objects = [];

function makeObj(name,type){
    switch (type){
        case "rect": a_Objects.push(new Rectangle(0,0,name)); break; 
    }
    
}
function getObj(name){
    for(var go=0; go<a_Objects.length; go++){
        if(a_Objects[go].name==name){
            return a_Objects[go];
        }
    }
}

/*------------------------------------LIBRARY-OBJECTS----------------------------------*/
function Rectangle(x,y,name,contx){
    this.name = name;

    //Init Attributes
    this.sX = x;
    this.sY = y;
    this.sSize = 1;
    this.sWidth = 50;
    this.sHeight = 50;
    this.sFill = "#000000";
    this.sStroke = "#00B600";
    this.sLineWidth = 4;

    //Active Attributes
    this.x = x;
    this.y = y;
    this.size = 1; //Multiplier for width/height
    this.width = 50;
    this.height = 50;
    this.fill = "#000000";
    this.stroke = "#00B600";
    this.lineWidth = 4;

    this.w = this.width*this.size;
    this.h = this.height*this.size;

    //collision points / Modifer or Adjuster for left,right,etc.
    this.collL = 0; //Init
    this.collR = 0;
    this.collT = 0;
    this.collB = 0;

    this.left = this.x+this.collL; //Active
    this.right = this.x+this.collR+this.w;
    this.top = this.y+this.collT;
    this.bottom = this.y+this.collB+this.h;

    this.bounded = false; //Must Stay Inside of Canvas (Init)
    this.bound = this.bounded; //Active

    this.ctx = contx;

    this.draw = function(contx){
        if(this.bound){
            while(this.left<0){this.x++; this.updateHitBox();}
            while(this.right>canvas.width){this.x--; this.updateHitBox();}
            while(this.top<0){this.y++; this.updateHitBox();}
            while(this.bottom>canvas.height){this.y--; this.updateHitBox();}
        }

        contx.save();
        contx.translate(this.x,this.y);
        contx.fillStyle = this.fill;
        contx.strokeStyle = this.stroke;
        contx.lineWidth = this.lineWidth;
        contx.fillRect(0,0,this.w,this.h);
        contx.strokeRect(0,0,this.w,this.h);
        contx.restore();

        this.updateHitBox();
    }

    this.moveTo = function(x,y){
        this.x = x;
        this.y = y;
    }

    this.changeSize = function(newSize=this.size){
        this.size = newSize;
        this.w = this.width*this.size;
        this.h = this.height*this.size;
    }

    this.updateHitBox = function(){
        this.left = Number(this.x)+this.collL;
        this.right = Number(this.x)+this.collR+Number(this.w);
        this.top = Number(this.y)+this.collT;
        this.bottom = Number(this.y)+this.collB+Number(this.h);
    }
}

/*------------------------------------USER-INPUT----------------------------------*/

document.addEventListener("keydown",documentKeyDown);
document.addEventListener("keyup",documentKeyUp);
document.addEventListener("click",onUserClick);

var a_KeysPressed = [];
var onClick = function(){console.log("User has clicked.\nSet onClick = function [name](){//Your Code} to replace this message.");}

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
    if(mouseInside(0,canvas.width,0,canvas.height,"ctx")){
        onClick();
    }
}