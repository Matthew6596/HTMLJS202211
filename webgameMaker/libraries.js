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

function makeObj(name,type,scrn=currentScrn){
    switch (type){
        case "rect": a_scrnObjList[scrn].push(new Rectangle(0,0,name)); break; 
    }
    
}
function obj(name,scrn=currentScrn){
    var arr = a_scrnObjList[scrn];
    for(var go=0; go<arr.length; go++){
        if(arr[go].name==name){
            return arr[go];
        }
    }
}

/*-----Collision-----*/

//Obj-Obj Collision +
//Obj-Tag Collision |- return bool
//Tag-Tag Collision +

function tagTrig(t1,t2){
    var arr = a_scrnObjList[currentScrn];
    var returnBool = false;
    for(var tt=0; tt<arr.length; tt++){
        if(t1==arr[tt].tag){
            for(var tt2=0; tt2<arr.length; tt2++){
                if(t2==arr[tt2].tag&&arr[tt].overlaps(arr[tt2])){returnBool=true;}
            }
        }
        
    }
    return returnBool;
}

function objTrig(o1,o2){
    return o1.overlaps(o2);
}

function otTrig(ob,tr){
    var arr = a_scrnObjList[currentScrn];
    var returnBool = false;
    for(var tc=0; tc<arr.length; tc++){
        if(tr==arr[tc].tag&&ob.overlaps(arr[tc])){returnBool=true;}
    }
    return returnBool;
}



/*------------------------------------LIBRARY-OBJECTS----------------------------------*/
function Rectangle(x,y,name,contx=ctx){
    this.name = name;
    this.tag = "none";
    this.collTags = ["none"];

    //Init Attributes
    this.sX = x;
    this.sY = y;
    this.sSize = 1;
    this.sWidth = 50;
    this.sHeight = 50;
    this.sFill = "#222222";
    this.sStroke = "#00B600";
    this.sLineWidth = 4;

    //Active Attributes
    this.x = this.sX;
    this.y = this.sY;
    this.size = this.sSize; //Multiplier for width/height
    this.width = this.sWidth;
    this.height = this.sHeight;
    this.fill = this.sFill;
    this.stroke = this.sStroke;
    this.lineWidth = this.sLineWidth;

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

    this.type = "rect";

    this.draw = function(contx){
        if(this.bound){
            while(this.left<0){this.x++; this.updateHitBox();}
            while(this.right>canvas.width){this.x--; this.updateHitBox();}
            while(this.top<0){this.y++; this.updateHitBox();}
            while(this.bottom>canvas.height){this.y--; this.updateHitBox();}
        }
        if(!this.collTags.includes("none")){this.tagCollision();}

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
        this.left = Number(this.x)+Number(this.collL);
        this.right = Number(this.x)+Number(this.collR)+Number(this.w);
        this.top = Number(this.y)+Number(this.collT);
        this.bottom = Number(this.y)+Number(this.collB)+Number(this.h);
    }

    this.reset = function(){
        this.x = this.sX;
        this.y = this.sY;
        this.size = this.sSize;
        this.width = this.sWidth;
        this.height = this.sHeight;
        this.fill = this.sFill;
        this.stroke = this.sStroke;
        this.lineWidth = this.sLineWidth;

        this.w = this.width*this.size;
        this.h = this.height*this.size;

        this.bound = this.bounded;
        this.updateHitBox();
    }

    this.tagCollision = function(){
        var arr = a_scrnObjList[currentScrn];
        for(var tc=0; tc<arr.length; tc++){
            if(this.collTags.includes(arr[tc].tag)){
                this.doCollision(arr[tc]);
            }
        }
    }

    this.doCollision = function(otherObj){
        var lDist = Math.abs(otherObj.left-this.right); //distance from left side to other obj
        var rDist = Math.abs(this.left-otherObj.right);
        var tDist = Math.abs(otherObj.top-this.bottom);
        var bDist = Math.abs(this.top-otherObj.bottom);
        var dists = [lDist,rDist,tDist,bDist];
        var insideHorizontal = ((this.right>otherObj.left&&this.right<otherObj.right)||(this.left<otherObj.right&&this.left>otherObj.left));
        if(insideHorizontal&&((this.bottom>otherObj.top&&this.bottom<otherObj.bottom)||(this.top<otherObj.bottom&&this.top>otherObj.top))){
            //find shortest dist out, push out
            dists.sort((a, b) => a - b);
            switch(dists[0]){
                case lDist: this.x-=lDist; break;
                case rDist: this.x+=rDist; break;
                case tDist: this.y-=tDist; break;
                case bDist: this.y+=bDist; break;
            }
            this.updateHitBox();
        }
    }

    this.overlaps = function(othObj){
        return (((this.right>othObj.left&&this.right<othObj.right)||(this.left<othObj.right&&this.left>othObj.left))&&
                ((this.bottom>othObj.top&&this.bottom<othObj.bottom)||(this.top<othObj.bottom&&this.top>othObj.top)));
    }

}

/*------------------------------------USER-INPUT----------------------------------*/

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
    if(mouseInside(0,canvas.width,0,canvas.height,"ctx")){
        onClick();
    }
}

/*------------------------------------GAME-STATES/SCREENS----------------------------------*/

var a_Screens = ["start"];
var a_scrnObjList = [[]]; //2d array of each screens set of Objs Indexs
var currentScrn = 0;

//a_Screens[currentScreen]
//changeScrn("name");
//a_Objects.push(newObj), a_scrnObjList[currentScrn].push(sameObj);
//for(a_scrnObjList[currentScrn].draw)

function addScreen(scrnName){
    if(!a_Screens.includes(scrnName)){
        var d_scrn = document.createElement("option");
        d_scrn.innerHTML = scrnName;
        d_scrn.value = scrnName;
        d_screens.appendChild(d_scrn);
        a_Screens.push(scrnName);
        document.getElementById('scrnNameInp').value = "";

        a_scrnObjList[a_scrnObjList.length] = [];
    }
}

function refreshCurrentScrn(){
    currentScrn = a_Screens.indexOf(d_screens.value);
}

function changeScrn(scrnName){
    currentScrn = a_Screens.indexOf(scrnName);
}

function getScrn(){
    return a_Screens[currentScrn];
}