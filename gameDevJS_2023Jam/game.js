/*-Matthew-Satterfield-*/
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var timer = setInterval(main,1000/60);

document.addEventListener("mousemove",function(e){updateMousePos(e);});

function updateMousePos(e){
    var rect = canvas.getBoundingClientRect();
    mousex = Math.round(e.clientX - rect.left);
    mousey = Math.round(e.clientY - rect.top);
}

document.addEventListener("input",checkTimeReducer)

function checkTimeReducer(){
    timeReducer = document.getElementById("tReduce").value;
    document.getElementById("rtime").innerHTML=timeReducer;
}

/*-----------------------------------INPUT-----------------------------------*/
var mousex = 0;
var mousey = 0;
function mouseInside(l,r,t,b){
    return ((mousex>l)&&(mousex<r))&&((mousey>t)&&(mousey<b));
}
function mouseInsideObj(obj){
    return mouseInside(obj.left,obj.right,obj.top,obj.bottom);
}

document.addEventListener("keydown",documentKeyDown);
document.addEventListener("keyup",documentKeyUp);
document.addEventListener("click",onUserClick);
document.addEventListener("keypress",onKeyPress);

var a_KeysPressed = [];
var onClick = function(){}
var sPress = false;

function onKeyPress(e){
    if(e.which==32){sPress=true;}
}

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
function randInt(lo, hi){return Math.round(randNum(lo, hi));}
function getDist(x1,y1,x2,y2){return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));}
function percent(chance){ return (randNum(0,100)<=chance);}

function getCollisionBorder(other){
    return {left:other.left-1,right:other.right+1,top:other.top-1,bottom:other.bottom+1};
}

/*-----------------------------------OBJECTS-----------------------------------*/
function Obj(x=0,y=0,w=100,h=100,col="red",bor=0){
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.force = 1;
    this.friction = 0.95;
    this.dir = 1;
    this.width = w;
    this.height = h;
    this.color = col;
    this.controls = false;
    this.border = bor;

    this.left = this.x-this.width/2;
    this.right = this.x+this.width/2;
    this.top = this.y-this.height/2;
    this.bottom = this.y+this.height/2;

    this.draw = function(shape="rect"){
        var halfW = this.width/2;
        var halfH = this.height/2;
        if(shape=="rect"){
            ctx.save();
            ctx.translate(this.x,this.y);
            ctx.fillStyle = this.color;
            ctx.lineWidth = this.border;
            ctx.fillRect(-halfW,-halfH,this.width,this.height);
            if(this.border!=0){ctx.strokeRect(-halfW,-halfH,this.width,this.height);}
            ctx.restore();
        }else if(shape=="circle"){
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.translate(this.x,this.y);
            ctx.arc(0,0,halfW,0,Math.PI/180,true);
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
    }

    this.refreshColPoints = function(){
        this.left = this.x-this.width/2;
        this.right = this.x+this.width/2;
        this.top = this.y-this.height/2;
        this.bottom = this.y+this.height/2;
    }

    this.collides = function(other){
        return ((this.right>=other.left)
        &&(this.left<=other.right)
        &&(this.bottom>=other.top)
        &&(this.top<=other.bottom));
    }

    this.collision = function(other){
        if(this.collides(other)){
            var a_temp = [
                Math.abs(this.right-other.left),
                Math.abs(this.left-other.right),
                Math.abs(this.bottom-other.top),
                Math.abs(this.top-other.bottom),
            ];
            a_temp.sort(function(a, b){return b-a});

            switch(a_temp[3]){
                case(Math.abs(this.right-other.left)):
                while(this.right>other.left){
                    this.x--;
                    this.right = this.x+this.width/2;
                }
                this.vx=0;
                break;
                case(Math.abs(this.left-other.right)):
                while(this.left<other.right){
                    this.x++;
                    this.left = this.x-this.width/2;
                }
                this.vx=0;
                break;
                case(Math.abs(this.bottom-other.top)):
                while(this.bottom>other.top){
                    this.y--;
                    this.bottom = this.y+this.height/2;
                }
                this.vy=0;
                break;
                case(Math.abs(this.top-other.bottom)):
                while(this.top<other.bottom){
                    this.y++;
                    this.top = this.y-this.height/2;
                }
                this.vy=0;
                break;
            }

            this.refreshColPoints();
                
        }
    }
}
/*-----------------------------------VARIABLES-----------------------------------*/
var gameTimer = 300;

var player = new Obj(100,100,20,20,"rgb(50,210,50)");
player.force = 0.2;
player.friction = 0.95;
player.controls = true;

//Border Walls -NO-TOUCH-
var wall1 = new Obj(canvas.width/2,20,canvas.width,40,"dimgrey");
var wall2 = new Obj(canvas.width/2,canvas.height-20,canvas.width,40,"dimgrey");
var wall3 = new Obj(20,canvas.height/2,40,canvas.height,"dimgrey");
var wall4 = new Obj(canvas.width-20,canvas.height/2,40,canvas.height,"dimgrey");
//
//Obstacle Walls to move around - setWall(wall,x,y,w,h);
var wall5 = new Obj(-100,-100,10,10,"dimgrey");
var wall6 = new Obj(-100,-100,10,10,"dimgrey");
var wall7 = new Obj(-100,-100,10,10,"dimgrey");
var wall8 = new Obj(-100,-100,10,10,"dimgrey");
var wall9 = new Obj(-100,-100,10,10,"dimgrey");
var wall10 = new Obj(-100,-100,10,10,"dimgrey");
var wall11 = new Obj(-100,-100,10,10,"dimgrey");
var wall12 = new Obj(-100,-100,10,10,"dimgrey");


var goal = new Obj(canvas.width-100,canvas.height-100,40,40,"yellow",2);

var a_objects = [goal,player,wall1,wall2,wall3,wall4]; //Main Objects
var a_collides = [wall1,wall2,wall3,wall4];

var currentLevel = 0; //Level
var currentState = "alive"; //Player State
var nextLevel = 1;
var menuText = "Press Space to Start";

var timeReducer = 0; //Highest Val: 100

/*-----------------------------------MAIN-----------------------------------*/
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //

    //Moving
    player.move();

    //Do level stuff or Menu stuff?
    var doStartLater = false;
    if(currentLevel!=0){doLevel();}
    else{doStartLater = true;}

    //If the player is hitting any wall
    var temp_hit = false;
    for(var i=0; i<a_collides.length; i++){
        if(player.collides(getCollisionBorder(a_collides[i]))){
            temp_hit = true;
        }
    }
    hitWall(temp_hit);

    //Player Collision
    for(var i=0; i<a_collides.length; i++){
        player.collision(a_collides[i]);
    }

    //Restart or Start Level
    if(sPress){
        changeLevel(nextLevel);
        sPress = false;
    }

    //Drawing Objects
    for(var i=0; i<a_objects.length; i++){
        a_objects[i].draw();
    }

    //Drawing UI and stuff ---
    ctx.save();
    ctx.textAlign = "center";

    //Game Timer Text
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Courier New";
    ctx.fillText(gameTimer,player.x-1,player.top);
    ctx.fillStyle = "black";
    ctx.font = "bold 18px Courier New";
    ctx.fillText(gameTimer,player.x,player.top-1);
    
    //Level Count Text
    ctx.font = "bold 24px Courier New";
    ctx.fillText(nextLevel,18,22);
    ctx.fillStyle = "white";
    ctx.font = "bold 22px Courier New";
    ctx.fillText(nextLevel,20,20);
    ctx.restore();

    //Menu Text & Special Win State
    if(currentState=="won"){theEnd();}
    if(doStartLater){doStart();}

}

function hitWall(hit){
    if(hit){
        player.color = "red";
        player.friction = 0.89;
    }else{
        player.color = "rgb(50,210,50)";
        player.friction = 0.95;
    }
}

//Level Managers ~~~~~~~~~~~~~~~~~~~~ <<<>>>

function changeLevel(level){
    if(level-1==levels.length&&currentState!="won"){ //Player Wins!!!
        currentLevel = 0;
        currentState = "won";
        gameTimer = 1000;
        menuText = "Congratulations, You've Won!";
        a_objects = [player,wall1,wall2,wall3,wall4];
        a_collides = [wall1,wall2,wall3,wall4];
        player.x = canvas.width/2;
        player.y = canvas.height*3/4;
    }
    if(level!=0&&currentState!="won"){ //Player Continues/Restarts to next level
        levels[level-1]();
        gameTimer -= timeReducer;
        player.vx = 0;
        player.vy = 0;
        player.controls = true;
        currentState = "alive";
    }
    if(currentState!="won"){currentLevel = level;}
}

//Level Set-Ups ~~~~~~~~~~~~~~~~~~~~

var levels = [
function level1(){
    gameTimer = 300;
    goal = new Obj(canvas.width-100,canvas.height-100,40,40,"yellow",2);
    player.x = 100;
    player.y = 100;
    a_objects = [goal,player,wall1,wall2,wall3,wall4];
    a_collides = [wall1,wall2,wall3,wall4];
},

function level2(){
    gameTimer = 350;
    goal = new Obj(canvas.width-100,100,40,40,"yellow",2);
    player.x = 100;
    player.y = 100;
    wall5 = new Obj(canvas.width/2,200,40,400,"dimgrey");
    a_objects = [goal,player,wall1,wall2,wall3,wall4,wall5];
    a_collides = [wall1,wall2,wall3,wall4,wall5];
},

function level3(){
    gameTimer = 460;
    goal = new Obj(100,100,40,40,"yellow",2);
    player.x = 100;
    player.y = canvas.height-100;
    wall5 = new Obj(canvas.width/3,canvas.height/2,600,180,"dimgrey");
    a_objects = [goal,player,wall1,wall2,wall3,wall4,wall5];
    a_collides = [wall1,wall2,wall3,wall4,wall5];
},

function level4(){
    gameTimer = 440;
    goal = new Obj(canvas.width-100,canvas.height-100,40,40,"yellow",2);
    player.x = 100;
    player.y = 100;
    wall5 = new Obj(canvas.width/3,canvas.height/4,100,400,"dimgrey");
    wall6 = new Obj(canvas.width*2/3,canvas.height*3/4,100,400,"dimgrey");
    a_objects = [goal,player,wall1,wall2,wall3,wall4,wall5,wall6];
    a_collides = [wall1,wall2,wall3,wall4,wall5,wall6];
},

function level5(){
    gameTimer = 525;
    goal = new Obj(canvas.width-100,canvas.height-100,40,40,"yellow",2);
    player.x = 100;
    player.y = 100;
    wall5 = new Obj(canvas.width/3,canvas.height/4,200,500,"dimgrey");
    wall6 = new Obj(canvas.width*2/3,canvas.height*3/4,200,500,"dimgrey");
    a_objects = [goal,player,wall1,wall2,wall3,wall4,wall5,wall6];
    a_collides = [wall1,wall2,wall3,wall4,wall5,wall6];
},

function level6(){
    gameTimer = 300;
    goal = new Obj(canvas.width-100,canvas.height-100,40,40,"yellow",2);
    player.x = 100;
    player.y = 100;
    a_objects = [goal,player,wall1,wall2,wall3,wall4];
    a_collides = [wall1,wall2,wall3,wall4];
}
];

//Level Mains ~~~~~~~~~~~~~~~~~~~~
function doStart(){
    //Drawing
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "bold 32px Courier New";
    ctx.fillText(menuText,canvas.width/2,canvas.height/2);
    ctx.restore();
}

function doLevel(){
    //Moving
    gameTimer--;

    //Doing Stuff
    if(gameTimer<=0){
        currentState = "lost";
        menuText = "Press Space to Restart";
        player.controls = false;
        gameTimer=0;
        changeLevel(0);
    }

    if(player.collides(goal)){
        nextLevel++;
        menuText = "Press Space to Continue";
        changeLevel(0);
    }
}

function theEnd(){
    gameTimer--;
    if(gameTimer<0){gameTimer=0;}
}

changeLevel(0);


/*



a




i was gona draw ascii among us but i think 'a' is close enough

*/