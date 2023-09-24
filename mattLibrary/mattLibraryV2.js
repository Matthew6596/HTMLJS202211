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
function randInt(lo, hi){
    let _tempNum = Math.round(randNum(lo-1, hi+1));
    while(_tempNum==lo-1||_tempNum==hi+1){
        _tempNum = Math.round(randNum(lo-1, hi+1));
    }
    return _tempNum;
}
function percent(chance){return (randNum(0,100)<=chance);}

function toRadians(deg){return deg*(Math.PI/180);}
function toDegrees(rad){return rad*(180/Math.PI);}

function getAngle(a,b){return toDegrees(Math.atan2(b,a));}
function getMag(a,b){return Math.hypot(a,b);}
function getPoint(vect,XorY){
    return (XorY.toLowerCase()=="x")?(Math.cos(toRadians(vect.angle))*vect.mag):(Math.sin(toRadians(vect.angle))*vect.mag);
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
function animate(arr){
    for(const element of arr){element.animate();}
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

function findTag(arr,tag){
    return arr.filter(function(a){return a.tag==tag;})[0];
}
function findTags(arr,tag){
    return arr.filter(function(a){return a.tag==tag;});
}
function pushTagtoArray(arr1,arr2,tag){
    pushArray(findTags(arr1,tag),arr2);
}
function findProp(arr,prop,val){
    return arr.filter(function(a){return a[prop]==val;})[0];
}
function findProps(arr,prop,val){
    return arr.filter(function(a){return a[prop]==val;});
}

function getRandElement(arr){
    return arr[randInt(0,arr.length-1)];
}

function rgbToHex(col){
    let _comma1 = col.indexOf(",");
    let _comma2 = col.indexOf(",",_comma1+1);
    let _end = (col.indexOf(",",_comma2+1)!=-1)?(col.indexOf(",",_comma2+1)):(col.indexOf(")"));
    let _cols = [encode(Number(col.substring(col.indexOf("(")+1,_comma1)),16),
                encode(Number(col.substring(_comma1+1,_comma2)),16),
                encode(Number(col.substring(_comma2+1,_end)),16)];
    for(let i=0; i<3; i++){
        if(_cols[i]<10){_cols[i]="0"+_cols[i];}
        if(_cols[i]<1){_cols[i]="0"+_cols[i];}
    }
    return "#"+_cols[0]+_cols[1]+_cols[2];
}

function hexToRgb(col){
    col = col.toLowerCase();
    let _cols = [
        decode(col.substring(1,3),16),
        decode(col.substring(3,5),16),
        decode(col.substring(5),16)
    ];
    return "rgb("+_cols[0]+","+_cols[1]+","+_cols[2]+")";
}

function rgbToRgba(col,opacity){
    return col.substring(0,col.indexOf("("))+"a"+col.substring(col.indexOf("("),col.indexOf(")"))+","+opacity+")";
}

function getColType(col){
    if(col.includes("#")){return "hex";}
    else if(col.includes("rgba(")){return "rgba";}
    else if(col.includes("rgb(")){return "rgb";}
    return "other";
}

function spliceFrom(obj,arrs){
    arrs.forEach(element => {
        element.splice(element.indexOf(obj),1);
    });
}

function pushTo(obj,arrs){
    arrs.forEach(element => {
        element.push(obj);
    });
}

function duplicateObj(obj){
    let dupe = new Obj([],{});
    let _props = Object.entries(obj);
    for (const element of _props) {
        dupe[element[0]] = element[1];
    }
    return dupe;
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
        _obj.tag = "";
        
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
        _obj.ax = 1;
        _obj.ay = 1;
        _obj.friction = 1;
        _obj.move = function(){
            _obj.vx*=_obj.friction;
            _obj.vy*=_obj.friction;
            _obj.x += _obj.vx;
            _obj.y += _obj.vy;
        }
    },
    "top-down-controller":function(_obj){
        _obj.controls = function(){};
        _obj.control = function(){
            if(getAnyKey(["keyW","arrowup"])){_obj.vy -= _obj.ay;}
            if(getAnyKey(["keyA","arrowleft"])){_obj.vx -= _obj.ax;}
            if(getAnyKey(["keyS","arrowdown"])){_obj.vy += _obj.ay;}
            if(getAnyKey(["keyD","arrowright"])){_obj.vx += _obj.ax;}
            _obj.controls();
            _obj.move();
        }
    },
    "render":function(_obj){
        _obj.priority = 0;
        _obj.show = true;
        _obj.draw = function(){
            ctx.save();
            shapeDraws[_obj.shape](_obj);
            ctx.restore();
        }
    },
    "shape-render":function(_obj){
        components["render"](_obj);
        _obj.color = "rgb(0,0,0)";
        _obj.stroke = "rgba(0,0,0,0)";
        _obj.lineWidth = 1;
        _obj.shape = "rect";
    },
    "image-render":function(_obj){
        components["render"](_obj);
        _obj.shape = "image";
        _obj.img = new Image(); //img object
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
    },
    "collision":function(_obj){
        _obj.hitbox = new Obj([],{});
        setTimeout(function(){_obj.hitbox.set({width:_obj.width,height:_obj.height});},0);

        _obj.left = function(){return _obj.x+_obj.hitbox.x-_obj.hitbox.width/2;}
        _obj.right = function(){return _obj.x+_obj.hitbox.x+_obj.hitbox.width/2;}
        _obj.top = function(){return _obj.y+_obj.hitbox.y-_obj.hitbox.height/2;}
        _obj.bottom = function(){return _obj.y+_obj.hitbox.y+_obj.hitbox.height/2;}

        _obj.hits = function(obj){
            return ((_obj.right()>=obj.left()&&_obj.left()<=obj.right())
                    &&(_obj.bottom()>=obj.top()&&_obj.top()<=obj.bottom()));
        }
    },
    "collision-points":function(_obj){
        components["collision"](_obj);
        _obj.leftPoint = function(){return {x:_obj.left(),y:_obj.hitbox.y+_obj.y};}
        _obj.rightPoint = function(){return {x:_obj.right(),y:_obj.hitbox.y+_obj.y};}
        _obj.topPoint = function(){return {x:_obj.hitbox.x+_obj.x,y:_obj.top()};}
        _obj.bottomPoint = function(){return {x:_obj.hitbox.x+_obj.x,y:_obj.bottom()};}

        _obj.topLeftPoint = function(){return {x:_obj.left(),y:_obj.top()};}
        _obj.topRightPoint = function(){return {x:_obj.right(),y:_obj.top()};}
        _obj.bottomLeftPoint = function(){return {x:_obj.left(),y:_obj.bottom()};}
        _obj.bottomRightPoint = function(){return {x:_obj.right(),y:_obj.bottom()};}

        _obj.pointHits = function(_point,obj){
            return ((_point.x>obj.left()&&_point.x<obj.right())
                    &&(_point.y>obj.top()&&_point.y<obj.bottom()));
        }
    },
    "collider":function(_obj){
        components["collision-points"](_obj);
        _obj.colliding = false;
        _obj.collides = function(obj){
            _obj.colliding = false;
            let _l = [_obj.leftPoint(),_obj.topLeftPoint(),_obj.bottomLeftPoint()];
            let _r = [_obj.rightPoint(),_obj.topRightPoint(),_obj.bottomRightPoint()];
            let _t = [_obj.topPoint(),_obj.topLeftPoint(),_obj.topRightPoint()];
            let _b = [_obj.bottomPoint(),_obj.bottomLeftPoint(),_obj.bottomRightPoint()];
            if(_obj.pointHits(_l[0],obj)||(_obj.pointHits(_l[1],obj)&&(obj.right()-_l[1].x<=obj.bottom()-_l[1].y))||(_obj.pointHits(_l[2],obj)&&(obj.right()-_l[2].x<=_l[2].y-obj.top()))){
                _obj.x=_obj.hitbox.width/2+obj.right(); _obj.colliding = true;
            }else if(_obj.pointHits(_r[0],obj)||(_obj.pointHits(_r[1],obj)&&(_r[1].x-obj.left()<=obj.bottom()-_r[1].y))||(_obj.pointHits(_r[2],obj)&&(_r[2].x-obj.left()<=_r[2].y-obj.top()))){
                _obj.x=-_obj.hitbox.width/2+obj.left(); _obj.colliding = true;
            }else if(_obj.pointHits(_t[0],obj)||_obj.pointHits(_t[1],obj)||_obj.pointHits(_t[2],obj)){
                _obj.y=_obj.hitbox.height/2+obj.bottom(); _obj.colliding = true;
            }else if(_obj.pointHits(_b[0],obj)||_obj.pointHits(_b[1],obj)||_obj.pointHits(_b[2],obj)){
                _obj.y=-_obj.hitbox.height/2+obj.top(); _obj.colliding = true;
            }
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
        _obj.offCol = "rgb(255,0,0)";
        _obj.onCol = "rgb(50,255,50)";
        _obj.on = false;
        _obj.shape = "toggle";
        _obj.toggle = function(){
            _obj.on = !_obj.on;
        }
        //NEEDS ADDITIONS, and draw differently
    },
    "button":function(_obj){
        _obj.shape = "button";
        _obj.textXOffset = 0;
        _obj.textYOffset = 0;
        _obj.colors = {default:"rgb(211,211,211)",hover:"rgb(169,169,169)",down:"rgb(128,128,128)",pressed:"rgb(255,255,255)"};
        _obj.textObj = new Text([],{});
        _obj.btnSelected = false;
        _obj.btnDown = false;
        _obj.condition = function(){return (clicked&&mouseInsideObj(_obj));}
        _obj.pressed = function(){console.log(_obj);}
        _obj.updateText = function(){
            _obj.textObj.set({text:_obj.text,align:_obj.align,font:_obj.font,x:_obj.x+_obj.textXOffset,y:_obj.y+_obj.textYOffset+getFontSize(_obj.textObj.font)*(.35),angle:_obj.angle});
        }
        _obj.states = {
            "all":function(){
                _obj.updateText();
                _obj.color = _obj.colors[_obj.currentState];
                if(_obj.condition()){_obj.pressed(); _obj.currentState="pressed";}
                else if((mouseInsideObj(_obj)&&mouseDown)||_obj.btnDown){_obj.currentState="down";}
                else if(mouseInsideObj(_obj)||_obj.btnSelected){_obj.currentState="hover";}
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
    "paragraph":function(_obj){
        _obj.shape = "paragraph";
        _obj.lines = [];
        _obj.spacing = 24;
        _obj.maxCharPerLine = 20;
        _obj.updateLines = function(){
            _obj.lines = [];
            let _tempTxt = _obj.text+" ";
            while(_tempTxt.length>0){
                let _textSlice = _tempTxt.substring(0,_tempTxt.lastIndexOf(" ",_obj.maxCharPerLine));
                _obj.lines.push(new Text([],{x:_obj.x,y:_obj.y+(_obj.spacing*_obj.lines.length),text:_textSlice.trim(),align:_obj.align,font:_obj.font,color:_obj.color,stroke:_obj.stroke,lineWidth:_obj.lineWidth}));
                _tempTxt = _tempTxt.substring(_tempTxt.indexOf(_textSlice)+_textSlice.length+1);
            }
        }
    },
    "animation":function(_obj){
        _obj.animData = {"default":{delay:100,loops:true,frames:[{x:0,y:0,width:1,height:1,flipX:1,flipY:1}]}};
        _obj.animState = "default";
        _obj.animCount = 0;
        _obj.animFrame = 0;
        _obj.animPlaying = true;
        _obj.animate = function(){
            if(_obj.animPlaying){
                _obj.setImgData(_obj.animData[_obj.animState].frames[_obj.animFrame]);
                if(_obj.animCount>=_obj.animData[_obj.animState].delay){
                    _obj.animCount=0;
                    _obj.animFrame++;
                    if(_obj.animFrame>=_obj.animData[_obj.animState].frames.length){
                        _obj.animFrame = (_obj.animData[_obj.animState].loops)?(0):(_obj.animData[_obj.animState].frames.length-1);
                    }
                }
                _obj.animCount++;
            }
        }
        _obj.setAnimState = function(_state){
            _obj.animCount = 0;
            _obj.animFrame = 0;
            _obj.animState = _state;
        }
    },
    "custom-properties":function(_obj){
        _obj.p = {};
        _obj.setP = function(data){
            if(data!== undefined)
            {
                for(value in data)
                {
                    _obj.p[value] = data[value];
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
    "paragraph":function(_obj){
        ctx.restore();
        _obj.lines.forEach(element => {
            ctx.save();
            shapeDraws["text"](element);
            ctx.restore();
        });
    },
    "image":function(_obj){
        ctx.translate(_obj.x,_obj.y);
        ctx.scale(_obj.imgData.flipX,_obj.imgData.flipY);
        ctx.rotate(toRadians(_obj.angle));
        ctx.drawImage(_obj.img, _obj.imgData.x, _obj.imgData.y, _obj.imgData.width, _obj.imgData.height, -_obj.width/2, -_obj.height/2, _obj.width, _obj.height);
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

function Paragraph(comps,obj){
    let _tempComp = ["shape-render","text","paragraph"];
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
    let _tempComp = ["shape-render","text","collision","state-manager","button"];
    pushArray(comps,_tempComp);
    components["default"](this,_tempComp,obj);
}

/*--------------------------GAMESTATES/MAIN--------------------------*/
var currentState = "default";
var gamestates = {
    "default":[
        function(){
            //init
        },
        function(){
            //main code
        }
    ]
};

function changeState(state,_delays=[0,0],_transition="default"){
    currentState = "transition";
    transition = _transition;
    transitions[transition][0]();
    transitionState = 1;
    setTimeout(function(){
        setTimeout(function(){transitions[transition][3](); transitionState=-1;},_delays[1]);
        transitionState = 2;
        currentState = state;
        gamestates[state][0]();
    },_delays[0]);
}

var transition = "default";
var transitionState = -1;
var transitions = {
    "default":[
        function(){
            //transition init
        },
        function(){
            //transition enter
        },
        function(){
            //transition exit  
        },
        function(){
            //transition end
        }
    ]
}

var drawObjs = [];
var animObjs = [];
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    gamestateManagement();
    drawingManagement();
    inputManagement();
}

function gamestateManagement(){
    if(transitionState==-1){
        for(let i=1; i<gamestates[currentState].length; i++){
            gamestates[currentState][i]();
            if(currentState=="transition"){break;}
        }
    }else{
        transitions[transition][transitionState]();
    }
}

function drawingManagement(){
    animate(animObjs);
    let _drawObjs = drawObjs.filter(function(a){return a.show;});
    _drawObjs.sort(function(a, b){return a.priority - b.priority});
    draw(_drawObjs);
}

function inputManagement(){
    a_KeysPressed = [];
    clicked = false;
}

/*--------------------------SCREEN-MOVEMENT--------------------------*/

var offset = {x:0,y:0}; //Level position
var worldObjs = []; //Objects that move due to camera (basically not UI) ONLY PUSH TO THIS ARRAY and do so during instantiation
var camTarget = {x:0,y:0}; //could set = to player, camera follows this
var camera = {x:0,y:0}; //Stays in center of screen, is the camera aim
var borders = []; //Objects that camera collides with
var camFriction = 0.4; //Friction value of camera
var camFollowRate = 0.2; //Rate at which camera follows target
var camPrecision = 0; //Minimum camera speed before getting set to 0

function moveCamera(){
    let tempPos = {x:camera.x,y:camera.y};
    //Camera target moves
    follow(camera,camTarget,camFollowRate);
    if(camera.vx<camPrecision&&camera.vx>-camPrecision){camera.vx=0;}
    if(camera.vy>-camPrecision&&camera.vy<camPrecision){camera.vy=0;}
    camera.move();

    borders.forEach(element => {
        camera.collides(element);
    });

    camera.vx = camera.x-tempPos.x;
    camera.vy = camera.y-tempPos.y;

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
    camera = new Obj(["movement","collider"],{x:canvas.width/2,y:canvas.height/2,width:canvas.width,height:canvas.height,friction:camFriction});
    worldObjs.push(camera);
}
function setCameraPosition(target){
    let _pos = {x:target.x-camera.x,y:target.y-camera.y};
    for(const element of worldObjs){
        element.x -= _pos.x;
        element.y -= _pos.y;
    }
    camera.x += _pos.x;
    camera.y += _pos.y;
}
function setCamera(obj){
    setCameraPosition(obj);
    setCameraTarget(obj);
}
function setCameraZoom(_zoom){
    for(const element of worldObjs){
        if(element!=camera){
            element.width *= _zoom;
            element.height *= _zoom;
            element.x *= _zoom;
            element.y *= _zoom;
        }
    }
    setCameraPosition(camTarget);
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
function encode(_num,_base=88){
    let charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()-=_+[]{}|;<>.?/".substring(0,_base);
    let output = "";
    let _tempArr = [];
    while(_num>=1){
        _tempArr.push(Math.floor(_num%charset.length));
        _num /= charset.length;
    }
    for(let i=_tempArr.length-1; i>=0; i--){
        output += charset.charAt(_tempArr[i]);
    }
    return output;
}
function decode(_str,_base=88){
    let charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()-=_+[]{}|;<>.?/".substring(0,_base);
    let output = 0;
    let _count = 1;
    while(_str.length>0){
        output += charset.indexOf(_str.charAt(_str.length-1))*_count;
        _count *= charset.length;
        _str = _str.substring(0,_str.length-1);
    }
    return output;
}