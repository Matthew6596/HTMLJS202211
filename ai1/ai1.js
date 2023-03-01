/*---<<<---<<<---<<<---GAME--->>>--->>>--->>>---*///=============================================================

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var interval = 1000/140; //1000/140
var timer = setInterval(main, interval);

document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

var globalTimer = 0;
var worstMutatePercent = 30;
var roundTime = 2000;
var roundCount = 0;
var paused = false;

var a_mathFunctions = ["add","sub","mult","div","root","pow"]; //List of possible math functions/operations without 
var a_invMathFuncs = ["sub","add","div","mult","pow","root"]; //List of possible math functions/operations without 

function keyDown(e){//w:87 a:65 s:83 d:68 space:32}
    if(e.which==65||e.which==37){matt.left = true;}
    if(e.which==68||e.which==39){matt.right = true;}
    if(e.which==87||e.which==38){matt.up = true;}
    if(e.which==83||e.which==40){matt.down = true;}
    if(e.which==32){
        roundTime==1;
        for(var k=0; k<AIs.length; k++){
            console.log(AIs[k].brain);
        }
    }
    if(e.which==80){
        paused=!paused;
        if(!paused){setTimeout(resetRound,roundTime);}
    }
    if(e.which==70){
        if(roundTime==500){
            roundTime=2000;
            for(var rr=0; rr<AIs.length; rr++){
                AIs[rr].spd = 2.5;
            }
        }else{
            roundTime=500;
            for(var rr=0; rr<AIs.length; rr++){
                AIs[rr].spd = 10;
            }
        }
    }
}
function keyUp(e){//w:87 a:65 s:83 d:68 space:32
    if(e.which==65||e.which==37){matt.left = false;}
    if(e.which==68||e.which==39){matt.right = false;}
    if(e.which==87||e.which==38){matt.up = false;}
    if(e.which==83||e.which==40){matt.down = false;}
}

var matt = new Player("lime");
var Bob = new Player("lime");
var goal = new Goal();

var AIs = [
    new Player("red"),
    new Player("orange"),
    new Player("green"),
    new Player("cyan"),
    new Player("blue"),
    new Player("purple"),
    new Player("pink"),
    new Player("black"),
    new Player("grey"),
    new Player("saddlebrown"),
    new Player("magenta"),
    new Player("crimson"),
    new Player("gold"),
    new Player("lightgrey"),
    new Player("aqua"),
    new Player("navy"),
    new Player("beige"),
    new Player("darkseagreen"),
    new Player("deeppink"),
    new Player("tan"),
]

initilizeAIs();

/*---------------------PLAYER-OBJECT---------------------*/

function Player(col){
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.vx=0;
    this.vy=0;

    this.brain;
    this.bestBrain = this.brain;

    this.spd = 2.5;

    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;

    this.radius = 10;
    this.width = this.radius*2;
    this.color = col;

    this.winTime = 0;
    this.dist = canvas.width*canvas.height;
    this.prevDist = this.dist;
    this.won = false;

    this.score = 0;
    this.bestScore = -1000000;

    this.draw = function(){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.radius,-this.radius,this.width,this.width);
        ctx.restore();
    }

    this.move = function(){
        if(this.left){
            this.x -= this.spd;
        }
        if(this.right){
            this.x += this.spd;
        }
        if(this.up){
            this.y -= this.spd;
        }
        if(this.down){
            this.y += this.spd;
        }
        bounds(this);
    }
}

function Goal(){
    this.radius = 15;
    this.width = this.radius*2;

    this.x = randNum(this.radius,canvas.width-this.radius);
    this.y = randNum(this.radius,canvas.height-this.radius);


    this.draw = function(){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.fillStyle = "yellow";
        ctx.fillRect(-this.radius,-this.radius,this.width,this.width);
        ctx.restore();
    }
}

function bounds(obj){
    while(obj.x+obj.radius>canvas.width){obj.x--;}
    while(obj.x-obj.radius<0){obj.x++;}
    while(obj.y+obj.radius>canvas.height){obj.y--;}
    while(obj.y-obj.radius<0){obj.y++;}
}

function collide(obj1,obj2){
    return (((obj1.x+obj1.radius>=obj2.x-obj2.radius&&obj1.x+obj1.radius<=obj2.x+obj2.radius)
    ||(obj1.x-obj1.radius<=obj2.x+obj2.radius&&obj1.x-obj1.radius>=obj2.x-obj2.radius))&&
    ((obj1.y+obj1.radius>=obj2.y-obj2.radius&&obj1.y+obj1.radius<=obj2.y+obj2.radius)
    ||(obj1.y-obj1.radius<=obj2.y+obj2.radius&&obj1.y-obj1.radius>=obj2.y-obj2.radius)));
}

function hitGoal(){
    //if(collide(matt,goal)){resetRound();}
}

function resetRound(){
    for(var rr=0; rr<AIs.length; rr++){
        AIs[rr].dist = getDist(AIs[rr].x,AIs[rr].y,goal.x,goal.y);
    }
    roundCount++;
    globalTimer = 0;
    goal.x = randNum(goal.radius,canvas.width-goal.radius);
    goal.y = randNum(goal.radius,canvas.height-goal.radius);
    sortAI();
    /*if(roundCount%50==0){indvMutate();}
    if(roundCount%500==0){console.log(roundCount);}*/
    for(var rr=0; rr<AIs.length; rr++){
        //AIs[rr].x = canvas.width/2;
        //AIs[rr].y = canvas.height/2;
        AIs[rr].won = false;
        AIs[rr].winTime = 0;
        AIs[rr].dist = canvas.width*canvas.height;
    }
    Bob.x = canvas.width/2;
    Bob.y = canvas.height/2;
    if(!paused){setTimeout(resetRound,roundTime);}
}

function indvMutate(){
    for(var im=0; im<AIs.length; im++){
        AIs[im].brain.mutateChance = AIs[im].dist/350;
        AIs[im].brain.mutate();
    }
}

function sortAI(){
    var temp1 = []; //sort based on winTime
    var temp2 = []; //sort based on distance
    //var rankings = [];

    for(var sa=0; sa<AIs.length; sa++){ //Fills tempv with values
        temp1[sa] = AIs[sa];
        temp2[sa] = AIs[sa];
    }
    temp1.sort(function(a, b){return b.dist - a.dist}); //Sorts Values
    //var sub100 = temp2[AIs.length-1].score > 100;
    /*for(var sa=0; sa<AIs.length; sa++){ //Fills tempv with values
        for(var sa1=0; sa1<AIs.length; sa1++){
            //if(sub100){temp2[sa].score-=100;}
        }
    }*/

    temp2.sort(function(a, b){return b.score - a.score});

    /*
    for(var sa=0; sa<AIs.length; sa++){ //Sorts the temps into 1 ranked list based on priorities
        if(temp1[sa].won){rankings.push(temp1[sa]);}
    }
    for(var sa=0; sa<AIs.length; sa++){
        var notRanked = true;
        for(var sa1=0; sa1<rankings.length; sa1++){
            if(temp2[sa].color!=rankings[sa1].color){
                notRanked = false;
            }
        }
        if(notRanked){
            rankings.push(temp2[sa]);
        }
    }
    */

    console.log("__________________________________");
    console.log("End of Round "+roundCount);
    /*for(var sa=0; sa<AIs.length; sa++){
        
    }*/
    //if(roundCount%5==0){mutateAI(temp2);}
    mutateAI(temp2);
}

function mutateAI(arr){
    //var averageScore;
    for(var m=0; m<AIs.length; m++){
        AIs[m] = arr[m];
        console.log((m+1)+". "+AIs[m].color+" - "+Math.round(AIs[m].score));
        if(AIs[m].bestScore>AIs[m].score){AIs[m].brain = AIs[m].bestBrain;}
        if(AIs[m].score>AIs[m].bestScore){
            AIs[m].bestScore = AIs[m].score;
            AIs[m].bestBrain = AIs[m].brain;
        }
        
        //averageScore += AIs[m].score;
        AIs[m].score = 0;
    }
    //averageScore /= AIs.length;
    /*for(var m=AIs.length/2; m<AIs.length; m++){
        AIs[m].brain = AIs[m-AIs.length/2].brain;
    }*/
    for(var m=0; m<AIs.length; m++){
        AIs[m].brain.mutateChance = randNum(0,10);
        AIs[m].brain.mutate();
    }

    for(var rr=0; rr<AIs.length; rr++){
        AIs[rr].x = canvas.width/2;
        AIs[rr].y = canvas.height/2;
    }
    
}

function manageAIs(){
    for(var ma=0; ma<AIs.length; ma++){
        AIs[ma].draw();
        //input info
        AIs[ma].brain.inp[0] = AIs[ma].x;
        AIs[ma].brain.inp[1] = AIs[ma].y;
        AIs[ma].brain.inp[2] = goal.x;
        AIs[ma].brain.inp[3] = goal.y;

        //think
        AIs[ma].brain.chooseParameters();
        AIs[ma].brain.thinky();

        //get movement
        for(var mv=0; mv<4; mv++){
            if(AIs[ma].brain.out[mv]>0){AIs[ma].brain.out[mv]=true;}
            else{AIs[ma].brain.out[mv]=false;}
        }
        
        //set movement
        AIs[ma].left = AIs[ma].brain.out[0];
        AIs[ma].right = AIs[ma].brain.out[1];
        AIs[ma].up = AIs[ma].brain.out[2];
        AIs[ma].down = AIs[ma].brain.out[3];

        AIs[ma].move();

        //AI hit goal
        /*if(collide(AIs[ma],goal)){
            if(!AIs[ma].won){
                AIs[ma].won=true; AIs[ma].winTime=globalTimer;
                AIs[ma].score += 10/AIs[ma].winTime;
                AIs[ma].score += 50;
            }
            AIs[ma].score+=0.4;
        }else{
            if(AIs[ma].won){
                AIs[ma].score-=0.6;
            }
        }*/

        //AI dist
        AIs[ma].dist = getDist(AIs[ma].x,AIs[ma].y,goal.x,goal.y);
        if(AIs[ma].dist<=AIs[ma].prevDist){
            AIs[ma].brain.aiGetsCookie=true;
        }else{
            AIs[ma].brain.aiGetsCookie=false;
        }
        AIs[ma].score += 10/(AIs[ma].dist+1);
        AIs[ma].prevDist = AIs[ma].dist;
    }
}

function initilizeAIs(){
    for(var ma=0; ma<AIs.length; ma++){
        AIs[ma].brain = new ai(4,4);
        AIs[ma].brain.mutate();
    }
}

function manageBob(){
        Bob.draw();
        //input info
        Bob.brain.inp[0] = Bob.x;
        Bob.brain.inp[1] = Bob.y;
        Bob.brain.inp[2] = goal.x;
        Bob.brain.inp[3] = goal.y;

        //think
        Bob.brain.chooseParameters();
        Bob.brain.thinky();

        //get movement
        for(var mv=0; mv<4; mv++){
            if(Bob.brain.out[mv]>0){Bob.brain.out[mv]=true;}
            else{Bob.brain.out[mv]=false;}
        }
        
        //set movement
        Bob.left = Bob.brain.out[0];
        Bob.right = Bob.brain.out[1];
        Bob.up = Bob.brain.out[2];
        Bob.down = Bob.brain.out[3];

        Bob.move();
}

/*------------------------MAIN--------------------------*/

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    globalTimer++;
    goal.draw();

    manageBob();
    manageAIs();

    matt.move();
    matt.draw();

    hitGoal();
    //
}


/*---<<<---<<<---<<<---AI-OBJECT--->>>--->>>--->>>---*///========================================================

function ai(numInputs,numOutputs){
    this.inp = []; //Inputs in !ARRAY! form
    this.numInp = numInputs;//set
    this.timey;

    this.func = []; //P(); functions (should be 2D array of strings)
    this.invFunc = []; //this.func opposite functions
    this.numFunc = numOutputs; //set
    this.funcLength = []; //Number of Math Functions in P();

    this.paramOrder = []; //Order of param entered into function, length=numFunc
    this.param = []; //NEED at LEAST 2 for each (2D array)

    this.defaultConf = 50;
    this.confidence = []; //Num 0-100, 2D array size of this.func (mutatable)
    this.sendIt = false; //Overrides confidence to 100%
    this.uhoh = false; //Overrides sendIt and reduces confidence, activates invFunc a little
    //Confidence will be randNum roll that determines whether ai actually executes mathematical function

    this.depressed = false; //If set to true, ai will attempt to commit suice :(

    //Additional mutatable attributes
    this.sendTime; //
    this.uhohTolerance; //Error tolerance before this.uhoh=true

    //out
    this.out = []; //Set of outputs
    this.numOut = numOutputs; //set

    this.aiGetsCookie = false; //cookie = good  -  modifies confidence
    this.goalReached = false; //happy

    //Things for mutation / variation
    this.autoMutates = true;
    this.mutateChance = 20;
    this.funcLengthRange = [1,3];
    this.prevFunc;
    this.prevInvFunc;
    this.prevFuncLength;
    this.prevParamOrder;

    //

    this.thinky = function(){
        //this.setup2DArrays();
        this.aiEatsCookie();
        for(var thinkyI=0; thinkyI<this.numFunc; thinkyI++){
            this.confidence[thinkyI] = [];
            for(var sa1=0; sa1<this.funcLength[thinkyI]; sa1++){
                this.confidence[thinkyI][sa1] = this.defaultConf;
            }
            this.readFunc(thinkyI);
        }
    }

    this.readFunc = function(num){

        this.out[num] = this.param[num][0]
        for(var ri=0; ri<this.funcLength[num]; ri++){
            if(percent(this.confidence[num][ri])){
                this.out[num] = mathFunctions(this.out[num],this.param[num][ri+1],this.func[num][ri]);
            }
        }

    }

    this.chooseParameters = function(){
        this.autoMutate();
        for(var cp1=0; cp1<this.numFunc; cp1++){
            for(var cp2=0; cp2<this.funcLength[cp1]+1; cp2++){
                this.param[cp1][cp2] = this.inp[(this.paramOrder[cp1][cp2])];
            }
        }
    }

    this.setup2DArrays = function(){
        for(var sa=0; sa<this.func.length; sa++){
            
        }
    }

    this.consoleOut = function(){
        for(var outI=0; outI<this.numOut; outI++){
            console.log(this.out[outI]);
        }
    }

    this.mutate = function(){

        this.prevFunc = this.func;
        this.prevInvFunc = this.invFunc;
        this.prevFuncLength = this.funcLength;
        this.prevParamOrder = this.paramOrder;

        for(var i=0; i<this.numFunc; i++){

            if(percent(this.mutateChance)||this.prevFuncLength[i]===undefined){ //Mutate funcLength
                this.funcLength[i] = randInt(this.funcLengthRange[0],this.funcLengthRange[1]); //Supposedly Correct
            }else{
                this.funcLength[i] = this.prevFuncLength[i];
            }

            if(this.prevFunc[i]===undefined){this.func[i] = [];}
            if(this.invFunc[i]===undefined){this.invFunc[i] = [];}
            
            for(var z=0; z<this.funcLength[i]; z++){
                var funcChange = randInt(0,a_mathFunctions.length-1);
                if(percent(this.mutateChance)||this.prevFunc[i][z]===undefined){ //Mutate func
                    this.func[i][z] = a_mathFunctions[funcChange];
                    this.invFunc[i][z] = a_invMathFuncs[funcChange];
                }else{
                    this.func[i][z] = this.prevFunc[i][z];
                    this.invFunc[i][z] = this.prevInvFunc[i][z];
                }
            }

            if(this.prevParamOrder[i]===undefined){
                this.paramOrder[i] = [];
            }
            this.param[i] = [];
            for(var z=0; z<this.funcLength[i]+1; z++){
                if(percent(this.mutateChance)||this.prevParamOrder[i][z]===undefined){ //Mutate paramOrder
                    this.paramOrder[i][z] = randInt(0,this.numInp-1);
                }else{
                    this.paramOrder[i][z] = this.prevParamOrder[i][z];
                }
            }
        }
        console.log(this.func);
        console.log(this.invFunc);
    }

    this.aiEatsCookie = function(){
        if(this.aiGetsCookie){
            if(this.defaultConf<100){this.defaultConf+=2;}
        }else{
            if(this.defaultConf>0){this.defaultConf--;}
        }
    }

    this.autoMutate = function(){
        if(this.defaultConf==0&&this.autoMutates){
            this.mutate();
            this.defaultConf=50;
        }
    }
}



var bob = new ai(4,4); //Creating Bob

/*bob.inp[0] = 3; //Giving Bob's Inputs
bob.inp[1] = -2;
bob.inp[2] = 1;
bob.inp[3] = 4;*/

/*bob.mutate();
bob.chooseParameters();*/
bob.func =[
    ["sub"],
    ["sub"],
    ["sub"],
    ["sub"],
]
bob.funcLength[0] = 1;
bob.funcLength[1] = 1;
bob.funcLength[2] = 1;
bob.funcLength[3] = 1;
for(var b=0; b<bob.numFunc+1; b++){
    bob.paramOrder[b] = [];
    bob.param[b] = [];
}
bob.paramOrder[0][0] = 0;
bob.paramOrder[0][1] = 2;
bob.paramOrder[1][0] = 2;
bob.paramOrder[1][1] = 0;
bob.paramOrder[2][0] = 1;
bob.paramOrder[2][1] = 3;
bob.paramOrder[3][0] = 3;
bob.paramOrder[3][1] = 1;
bob.defaultConf = 100;
bob.autoMutates = false;
//bob.thinky();
//bob.consoleOut(); //Testing Bob's Brain

/*bob.mutate();
bob.chooseParameters();
bob.thinky();
bob.consoleOut();*/


/*---<<<---<<<---<<<---MATH-FUNCTIONS-FOR-AI--->>>--->>>--->>>---*///============================================

function mathFunctions(p1,p2,type){
    switch(type){
        case "add":
            return p1+p2;
        case "sub":
            return p1-p2;
        case "mult":
            return p1*p2;
        case "div":
            if(p2==0){return 0;}
            else{return p1/p2;}
        case "root":
            if(p1<0&&p2!=0){return -Math.pow(p1,1/p2);}
            if((p1==0&&p2!=0)||p2==0){return 0;}
            else{return Math.pow(p1,1/p2);}
        case "pow":
            if(p1<0&&Math.abs(p2<1)){return -Math.pow(-p1,p2);}
            if(p1==0&&p2<0){return 0;}
            else{return Math.pow(p1,p2);}
        default: break;
    }
}

/*Utility Functions*/

function randNum(low, high){return Math.random()*(high-low)+low;}

function randInt(lo, hi){return Math.round(randNum(lo, hi))}

function getDist(x1,y1,x2,y2){
    return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
}

function percent(chance){
    return (randNum(0,100)<=chance)
}

Bob.brain = bob;
setTimeout(resetRound,roundTime);