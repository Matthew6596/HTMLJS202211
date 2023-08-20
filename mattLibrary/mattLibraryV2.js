/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
mattLibrary.js by Matthew A. Satterfield - (begun 05/21/2023)
Version 2 (08/18/2023)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*--------------------------CANVAS/BASIC-STUFF--------------------------*/
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var timer = setInterval(main,1000/60); //fps = bottom number

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
    for(const element of arr){element.draw();}
}
function setImgData(arr,data){
    for(const element of arr){element.setImgData(data);}
}
function move(arr){
    for(const element of arr){element.move();}
}

function pointIn(x,y,obj){
    return ((x>=obj.left())&&(x<=obj.right()))&&((y>=obj.top())&&(y<=obj.bottom()));
}

function pushArray(arr1,arr2){
    for(const element of arr1){arr2.push(element);}
}

function getFontSize(_font){
    return (_font.substring(_font.lastIndexOf(" ",_font.indexOf("px")),_font.indexOf("px")));
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
document.addEventListener("mousedown",function(){mouseDown=true;audioReady=true;});
document.addEventListener("mouseup",function(){mouseDown=false;});

var a_KeysDown = [];
var a_KeysPressed = [];
var mouseDown = false;
var clicked = false;

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

function getKey(key){ //returns if key down
    return a_KeysDown.includes(key.toLowerCase());
}

function getKeyPress(key){ //return if key pressed
    return a_KeysPressed.includes(key.toLowerCase());
}

function getAllKeys(arr){ //return if all of the given keys are down
    for(const element of arr){
        if(!a_KeysDown.includes(element.toLowerCase())){return false;}
    }
    return true;
}

function getAnyKey(arr){ //return if any of the given keys are down
    for(const element of arr){
        if(a_KeysDown.includes(element.toLowerCase())){return true;}
    }
    return false;
}

function onUserClick(){
    if(mouseInside(0,canvas.width,0,canvas.height)){
        clicked = true;
    }
}
/*--------------------------OBJECTS-COMPONENTS--------------------------*/
const components = {
    "default":function(_obj,_comps,_objs){
        _obj.x = 0;
        _obj.y = 0;
        _obj.width = 1;
        _obj.height = 1;
        _obj.angle = 0;
        
        if(_comps!== undefined)
        {
            _comps.forEach(element => {
                components[element](_obj);
            });
        }
        if(_objs!== undefined)
        {
            for(value in _objs)
            {
                if(_obj[value]!== undefined)
                _obj[value] = _objs[value];
            }
        }
        _obj.addComponents = function(comps){
            comps.forEach(element => {
                components[element](_obj);
            });
        }
        _obj.set = function(prop){
            if(prop!== undefined)
            {
                for(value in prop)
                {
                    if(_obj[value]!== undefined)
                    _obj[value] = prop[value];
                }
            }
        }
    },
    "movement":function(_obj){
        _obj.vx = 0;
        _obj.vy = 0;
        _obj.friction = 1;
        _obj.move = function(){
            _obj.vx*=_obj.friction;
            _obj.vy*=_obj.friction;
            _obj.x += _obj.vx;
            _obj.y += _obj.vy;
        }
    },
    "shape-render":function(_obj){
        _obj.color = "black";
        _obj.stroke = "rgba(0,0,0,0)";
        _obj.lineWidth = 1;
        _obj.shape = "rect";
        _obj.draw = function(){
            ctx.save();
            shapeDraws[_obj.shape](_obj);
            ctx.restore();
        }
    },
    "image-render":function(_obj){
        _obj.img = new Image(); //img object, .src
        _obj.img.src = "images/spritesheet.png";
        _obj.imgData = {
            x:0, //Starting position, relative to img
            y:0,
            width:1, //Size of chunk being taken from img
            height:1,
            flipX:1, //dir
            flipY:1
        };
        _obj.setImgData = function(data){
            if(data!== undefined)
            {
                for(value in data)
                {
                    if(_obj.imgData[value]!== undefined)
                    _obj.imgData[value] = data[value];
                }
            }
        }
        _obj.draw = function(){
            ctx.save();
            ctx.translate(_obj.x,_obj.y);
            ctx.scale(_obj.imgData.flipX,_obj.imgData.flipY);
            ctx.rotate(toRadians(_obj.angle));
            ctx.drawImage(_obj.img, _obj.imgData.x, _obj.imgData.y, _obj.imgData.width, _obj.imgData.height, -_obj.width/2, -_obj.height/2, _obj.width, _obj.height);
            ctx.restore();
        }
    },
    "collision":function(_obj){
        _obj.left = function(){return _obj.x-_obj.width/2;}
        _obj.right = function(){return _obj.x+_obj.width/2;}
        _obj.top = function(){return _obj.y-_obj.height/2;}
        _obj.bottom = function(){return _obj.y+_obj.height/2;}

        _obj.hits = function(obj){
            return (((_obj.right()>=obj.left())
            &&(_obj.left()<=obj.right()))&&
            ((_obj.bottom()>=obj.top())
            &&(_obj.top()<=obj.bottom())));
        }
    },
    "state-manager":function(_obj){
        _obj.currentState = "default";
        _obj.states = {"default":function(){}};
        _obj.doState = function(){
            if(_obj.states["all"]!==undefined){_obj.states["all"]();}
            _obj.states[_obj.currentState]();
        }
    },
    "old-collider":function(_obj){
        _obj.collides = function(obj){ //goofy collision bruh
            if(_obj.hits(obj)){
                var a_temp = [
                    Math.abs(_obj.right()-obj.left()),
                    Math.abs(_obj.left()-obj.right()),
                    Math.abs(_obj.bottom()-obj.top()),
                    Math.abs(_obj.top()-obj.bottom()),
                ];
                a_temp.sort(function(a, b){return b-a});
                switch(a_temp[3]){
                    case(Math.abs(_obj.right()-obj.left())):
                    while(_obj.right()>obj.left()){
                        _obj.x--;
                    }
                    _obj.vx=0;
                    break;
                    case(Math.abs(_obj.left()-obj.right())):
                    while(_obj.left()<obj.right()){
                        _obj.x++;
                    }
                    _obj.vx=0;
                    break;
                    case(Math.abs(_obj.bottom()-obj.top())):
                    while(_obj.bottom()>obj.top()){
                        _obj.y--;
                    }
                    _obj.vy=0;
                    break;
                    case(Math.abs(_obj.top()-obj.bottom())):
                    while(_obj.top()<obj.bottom()){
                        _obj.y++;
                    }
                    _obj.vy=0;
                    break;
                }
            }
        }
    },
    "text":function(_obj){
        _obj.text = "Text";
        _obj.align = "center";
        _obj.font = "24px Arial";
        _obj.shape = "text";
    },
    "bar":function(_obj){
        _obj.value = 1;
        _obj.maxVal = 1;   
        _obj.backColor = "rbga(0,0,0,0)";
        _obj.shape = "bar";
    },
    "toggle":function(_obj){
        _obj.offCol = "red";
        _obj.onCol = "lime";
        _obj.on = false;
        _obj.toggle = function(){
            _obj.on = !_obj.on;
        }
    },
    "button":function(_obj){
        _obj.textObj = new Text([],{});
        _obj.shape = "button";
        _obj.colors = {default:"lightgrey",hover:"darkgrey",down:"grey",pressed:"white"};
        _obj.textXOffset = 0;
        _obj.textYOffset = 0;
        _obj.selected = false;
        _obj.down = false;
        _obj.condition = function(){return (clicked&&mouseInsideObj(_obj));}
        _obj.pressed = function(){console.log(_obj);}
        _obj.updateTextPos = function(){
            _obj.textObj.set({x:_obj.x+_obj.textXOffset,y:_obj.y+_obj.textYOffset+getFontSize(_obj.textObj.font)*(.35)});
        }
        _obj.states = {
            "all":function(){
                _obj.updateTextPos();
                _obj.color = _obj.colors[_obj.currentState];
                if(_obj.condition()){_obj.pressed(); _obj.currentState="pressed";}
                else if((mouseInsideObj(_obj)&&mouseDown)||_obj.down){_obj.currentState="down";}
                else if(mouseInsideObj(_obj)||_obj.selected){_obj.currentState="hover";}
                else{_obj.currentState="default";}
            },
            "default":function(){},
            "hover":function(){},
            "down":function(){},
            "pressed":function(){}
        };
        _obj.setColors = function(data){
            if(data!== undefined)
            {
                for(value in data)
                {
                    if(_obj.colors[value]!== undefined)
                    _obj.colors[value] = data[value];
                }
            }
        }
    },
};
const shapeDraws = {
    "rect":function(_obj){
        ctx.fillStyle = _obj.color;
        ctx.strokeStyle = _obj.stroke;
        ctx.lineWidth = _obj.lineWidth;
        ctx.translate(_obj.x,_obj.y);
        ctx.rotate(toRadians(_obj.angle));
        ctx.fillRect(-_obj.width/2,-_obj.height/2,_obj.width,_obj.height);
        ctx.strokeRect(-_obj.width/2,-_obj.height/2,_obj.width,_obj.height);
    },
    "circle":function(_obj){
        ctx.fillStyle = _obj.color;
        ctx.strokeStyle = _obj.stroke;
        ctx.lineWidth = _obj.lineWidth;
        ctx.beginPath();
        ctx.translate(_obj.x,_obj.y);
        ctx.arc(0,0,_obj.width/2,0,Math.PI/180,true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },
    "text":function(_obj){    
        ctx.fillStyle = _obj.color;
        ctx.strokeStyle = _obj.stroke;
        ctx.lineWidth = _obj.lineWidth;
        ctx.textAlign = _obj.align;
        ctx.font = _obj.font;
        ctx.translate(_obj.x,_obj.y);
        ctx.rotate(toRadians(_obj.angle));
        ctx.fillText(_obj.text,0,0);
        ctx.strokeText(_obj.text,0,0);
    },
    "bar":function(_obj){
        ctx.fillStyle = _obj.backColor;
        ctx.strokeStyle = _obj.stroke;
        ctx.lineWidth = _obj.lineWidth;
        ctx.translate(_obj.x,_obj.y);
        ctx.rotate(toRadians(_obj.angle));
        ctx.fillRect(-_obj.width/2,-_obj.height/2,_obj.width,_obj.height);
        ctx.fillStyle = _obj.color;
        ctx.fillRect((-_obj.width+_obj.lineWidth)/2,(-_obj.height+_obj.lineWidth)/2,_obj.width*(_obj.value/_obj.maxVal),_obj.height-_obj.lineWidth);
        ctx.strokeRect(-_obj.width/2,-_obj.height/2,_obj.width,_obj.height);
    },
    "toggle":function(_obj){
        ctx.fillStyle = (_obj.on)?(_obj.onCol):(_obj.offCol);
        ctx.strokeStyle = _obj.color;
        ctx.lineWidth = _obj.lineWidth;
        ctx.translate(_obj.x,_obj.y);
        ctx.rotate(toRadians(_obj.angle));
        ctx.fillRect(-_obj.width/2,-_obj.height/2,_obj.width,_obj.height);
        ctx.strokeRect(-_obj.width/2,-_obj.height/2,_obj.width,_obj.height);
    },
    "button":function(_obj){
        shapeDraws["rect"](_obj);
        ctx.restore();
        ctx.save();
        shapeDraws["text"](_obj.textObj);
    },
};
/*--------------------------OBJECTS--------------------------*/
function Obj(comps,obj){
    components["default"](this,comps,obj);
}

function Text(comps,obj){
    let _tempComp = ["shape-render","text"];
    pushArray(comps,_tempComp);
    components["default"](this,_tempComp,obj);
}

function Bar(comps,obj){
    let _tempComp = ["shape-render","bar"];
    pushArray(comps,_tempComp);
    components["default"](this,_tempComp,obj);
}

function Toggle(comps,obj){
    let _tempComp = ["shape-render","toggle","collision"];
    pushArray(comps,_tempComp);
    components["default"](this,_tempComp,obj);
}

function Btn(comps,obj){
    let _tempComp = ["shape-render","collision","state-manager","button"];
    pushArray(comps,_tempComp);
    components["default"](this,_tempComp,obj);
}

/*--------------------------GAMESTATES/MAIN--------------------------*/
var currentState = "default";
var gamestates = {
    "default":function(){
        // "main" code
    }
}
var gamestateInits = {
    "default":function(){
        // init code
    }
}

function changeState(state){
    currentState = state;
    gamestateInits[state]();
}

//ADD transitioner - gamestate that goes inbetween transitions <<<<<<<<<<<<<<< ADDD THINGY THINGY ADDD

var drawObjs = [];
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    gamestates[currentState]();
    draw(drawObjs);
    a_KeysPressed = [];
    clicked = false;
}

/*--------------------------SCREEN-MOVEMENT--------------------------*/

var offset = {x:0,y:0}; //Level position
var worldObjs = []; //Objects that move due to camera (basically not UI)
var camTarget = {x:0,y:0}; //could set = to player, camera follows this
var camera = {x:0,y:0}; //Stays in center of screen, is the camera aim
var camBorders = []; //Objects that camera collides with
var camFriction = 0.4;
var camFollowRate = 0.2;

function moveCamera(){
    //Camera target moves
    follow(camera,camTarget,camFollowRate);
    camera.move();

    //Move the level
    offset.x += camera.vx;
    offset.y += camera.vy;
    for(const element of worldObjs){
        element.x -= camera.vx;
        element.y -= camera.vy;
    }
}
function setCameraTarget(obj){
    if(worldObjs.includes(camera)){
        worldObjs.splice(worldObjs.indexOf(camera),1);
    }
    camTarget = obj;
    camera = new Obj(["movement"],{x:canvas.width/2,y:canvas.height/2,width:1,height:1,friction:camFriction});
    worldObjs.push(camera);
}

/*--------------------------AUDIO-SYSTEM--------------------------*/
var audioReady = false;
var sounds = {};

function createSound(_id,_name){
    if(_name===undefined){_name = _id;}
    sounds[_name] = document.getElementById(_id);
}

function playSound(_name){
    if(sounds[_name]!==undefined&&audioReady){
        sounds[_name].play();
    }
}

/*--------------------------LOCAL-STORAGE--------------------------*/
//I stole this code teehee
function getLocalStorageMaxSize(error) {
    if (localStorage) {
      var max = 10 * 1024 * 1024,
          i = 64,
          string1024 = '',
          string = '',
          // generate a random key
          testKey = 'size-test-' + Math.random().toString(),
          minimalFound = 0,
          error = error || 25e4;
  
      // fill a string with 1024 symbols / bytes    
      while (i--) string1024 += 1e16;
  
      i = max / 1024;
  
      // fill a string with 'max' amount of symbols / bytes    
      while (i--) string += string1024;
  
      i = max;
  
      // binary search implementation
      while (i > 1) {
        try {
          localStorage.setItem(testKey, string.substr(0, i));
          localStorage.removeItem(testKey);
  
          if (minimalFound < i - error) {
            minimalFound = i;
            i = i * 1.5;
          }
          else break;
        } catch (e) {
          localStorage.removeItem(testKey);
          i = minimalFound + (i - minimalFound) / 2;
        }
      }
  
      return minimalFound;
    }
  }
  
  //Testing
  console.log(getLocalStorageMaxSize()); // takes .3s
  console.log(getLocalStorageMaxSize(.1)); // takes 2s, but way more exact