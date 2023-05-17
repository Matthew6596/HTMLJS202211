var timer = setInterval(main,1000/60);

var pInput = [3,0];

var st = 24;
var eTimer = 0;

var holdingObj = false;
var heldObj = undefined;
var ropeObj = undefined;
var ropeCool = true;

/* --------------- OBJECT DECLARATIONS HERE --------------- */
var player = new Obj("joe",600,100,20,40,"rect");
player.maxMag = 24;
player.ax = 1.4;
var canJump = false;

var grav = new Obj("field1",canvas.width/2,canvas.height/2,600,600,"circle");
grav.color = "lightblue";
grav.force = -2;
grav.angle = player.angle+90;
grav.movement = [0,grav.angle];

var ground = new Obj("steve",canvas.width/2,canvas.height/2,240,240,"circle");
ground.color = "grey";

var ball1 = new Obj("baller",300,100,20,20,"circle");
ball1.maxMag = 60;
ball1.color = "purple";

var ball2 = new Obj("lameo",500,100,20,20,"circle");
ball2.maxMag = 60;
ball2.color = "blue";

var box1 = new Obj("Mike",600,400,30,30,"rect");
box1.maxMag = 10;
box1.color = "saddlebrown";

var enemy1 = new Obj(">:(",300,480,30,30,"circle");
enemy1.maxMag = 60;
enemy1.color = "red";
enemy1.ax = 0.1;
enemy1.ay = 0.1;
enemy1.maxVx = 6;
enemy1.maxVy = 6;
enemy1.bouncy = 10; //Enemy Knockback

var rope1 = new Obj("idk",750,300,40,40,"rect");
rope1.color = "grey";
rope1.mag = 80;
rope1.ax = 15;
rope1.dir += 180;

var titleBtn = new Obj("button!",canvas.width/2,canvas.height/2-5,150,50);
titleBtn.color = "lime";
titleBtn.angle = 90;
titleBtn.maxVx = 10000;
titleBtn.maxVy = 10000;

var titleTxt = new Obj("t",canvas.width/2,canvas.height/6);
titleTxt.maxVx = 10000;
titleTxt.maxVy = 10000;
var howToTxt = new Obj("t",-1000,70);
howToTxt.maxVx = 10000;
howToTxt.maxVy = 10000;

var physicsObjs = [player,ball1,ball2,box1,enemy1];
var pickable = [ball1,ball2];
var particles = [];
var boxes = [box1];
var enemies = [enemy1];
var currentState = "default";
var currentScreen = "title";

//tutorial triggers
var triggers = [];

//

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    screens[currentScreen](); //Game state

    clicked = false; //reset if-clicked variable manually
}

/* --------------- FUNCTIONS --------------- */

function getAngle(a,b){
    /*if(b==0){return (a>0) ? 0:180;}
    return toDegrees((Math.acos(a/getMag(a,b))*(b/(Math.abs(b)))));*/
    return toDegrees(Math.atan2(b,a));
}
function getMag(a,b){
    return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}

function getPoint(vect,XorY){
    if(XorY=="x"){return Math.cos(toRadians(vect[1]))*vect[0];}
    else if(XorY=="y"){return Math.sin(toRadians(vect[1]))*vect[0];}
}

function toRadians(deg){return deg*(Math.PI/180);}
function toDegrees(rad){return rad*(180/Math.PI);}

function objGrav(obj){
    var gravForce = grav.force;
    if(getMag(obj.x-grav.x,obj.y-grav.y)<=grav.radius){//If inside field

        obj.angle = getAngle((obj.x-grav.x),(obj.y-grav.y));
        if(obj.angle<0){obj.angle+=360;}

        if(!enemies.includes(obj)){
            obj.vx += getPoint([gravForce,obj.angle],"x");
            obj.vy += getPoint([gravForce,obj.angle],"y");
        }
    }
}

function objMovement(obj){
    var dec = 0.8; //friction
    if(obj!=player){dec=0.87;}

    //Max Magnitude/Velocity
    var pmag = getMag(obj.vx,obj.vy);
    var pang = getAngle(obj.vx,obj.vy);
    if(pang<0){pang+=360;}
    if(pmag>obj.maxMag){
        obj.vx = getPoint([obj.maxMag,pang],"x");
        obj.vy = getPoint([obj.maxMag,pang],"y");
    }
    //New Magnitude Deceleration
    pmag = getMag(obj.vx,obj.vy);
    pang = getAngle(obj.vx,obj.vy);
    if(pang<0){pang+=360;}
    pmag *= dec;

    if(pmag<0.5){pmag=0;}
    
    obj.vx = getPoint([pmag,pang],"x");
    obj.vy = getPoint([pmag,pang],"y");

    //If really slow, just stop (probably better done with mag) << Created Anti-Tendencies
    /*if(Math.abs(obj.vx)<dec){
        obj.vx = 0;
    }
    if(Math.abs(obj.vy)<dec){
        obj.vy = 0;
    }*/
    
    obj.x += obj.vx;
    obj.y += obj.vy;

    groundCollision(obj,ground);
}
    

function groundCollision(obj,grd){
    if(getMag(obj.x-grd.x,obj.y-grd.y)<grd.radius+obj.height/2){

        var oang = getAngle(obj.x-grd.x,obj.y-grd.y);
        if(oang<0){oang+=360;}

        obj.x = getPoint([grd.radius+obj.height/2,oang],"x")+grd.x;
        obj.y = getPoint([grd.radius+obj.height/2,oang],"y")+grd.y;

        /*getDir(obj);   Gotta learn physics then fix this

        if(obj!=player&&getMag(obj.vx,obj.vy)>6){
            addForce(obj,-2,0);
        }else if(obj!=player){
            obj.vx = 0;
            obj.vy = 0;
        }*/

        /*if(obj!=player){
            obj.vx = 0;
            obj.vy = 0;
        }*/
    }
}

function playerCollision(obj){

    var tempPx1 = getPoint([player.height/4,player.angle],"x")+player.x;
    var tempPy1 = getPoint([player.height/4,player.angle],"y")+player.y;
    var tempPx2 = getPoint([player.height/4,player.angle+180],"x")+player.x;
    var tempPy2 = getPoint([player.height/4,player.angle+180],"y")+player.y;

    if(getMag(obj.x-tempPx1,obj.y-tempPy1)<player.radius+obj.height/2
    ||getMag(obj.x-tempPx2,obj.y-tempPy2)<player.radius+obj.height/2){

        var oang;

        if(getMag(obj.x-tempPx1,obj.y-tempPy1)<player.radius+obj.height/2){
            oang = getAngle(obj.x-tempPx1,obj.y-tempPy1);
            obj.x = getPoint([player.radius+obj.height/2+1,oang],"x")+tempPx1;
            obj.y = getPoint([player.radius+obj.height/2+1,oang],"y")+tempPy1;
            obj.vx = getPoint([10,oang],"x");
            obj.vy = getPoint([10,oang],"y");
        }else{
            oang = getAngle(obj.x-tempPx2,obj.y-tempPy2);
            obj.x = getPoint([player.radius+obj.height/2+1,oang],"x")+tempPx2;
            obj.y = getPoint([player.radius+obj.height/2+1,oang],"y")+tempPy2;
            obj.vx *= -0.01;
            obj.vy *= -0.01;
            if(boxes.includes(obj)){
                obj.vx = player.vx*2;
                obj.vy = player.vy*2;
            }
        }
        
    }
}

function objCollision(obj1,obj2){
    var oang = getAngle(obj1.x-obj2.x,obj1.y-obj2.y);
    if(getMag(obj1.x-obj2.x,obj1.y-obj2.y)<obj1.radius+obj2.radius){
        var tempMag = (obj1.radius+obj2.radius)/4;
        obj1.x += getPoint([tempMag,oang],"x");
        obj1.y += getPoint([tempMag,oang],"y");
        obj2.x += getPoint([tempMag,oang+180],"x");
        obj2.y += getPoint([tempMag,oang+180],"y");

        obj1.vx *= -0.01;
        obj1.vy *= -0.01;
        obj2.vx *= -0.01;
        obj2.vy *= -0.01;
    }
}

function addForce(obj, magDif, angDif, angStart=getAngle(obj.vx,obj.vy)){
    var fmag = getMag(obj.vx,obj.vy);
    if(angStart<0){angStart+=360;}
    obj.vx = getPoint([fmag+magDif,angStart+angDif],"x");
    obj.vy = getPoint([fmag+magDif,angStart+angDif],"y");
}

function getDir(obj){ //More like setObjDir()
    var mang = getAngle(obj.vx,obj.vy);
    if(mang<0){mang+=360;}
    if(obj.angle<0){obj.angle+=360;}
    var dirAngle = obj.angle-mang
    if(dirAngle<0){dirAngle+=360;}
        
    //getting dir
    if(dirAngle>180){
        obj.dir = 1;
        mang = obj.angle+90;
    }else if(dirAngle<180){
        obj.dir = -1;
        mang = obj.angle+270;
    }
}

function breakBox(box){
    for(var bb=0; bb<20; bb++){
        particles.push(new Obj("p",box.x,box.y,5,5,"rect"))
        particles[bb].color = box.color;
        particles[bb].vx = randNum(-10,10);
        particles[bb].vy = randNum(-10,10);
        particles[bb].maxVx = 100;
        particles[bb].maxVy = 100;
        particles[bb].bounded = false;
    }
    box.x = 10000;
}

function moveEnemy(enm){
    var friction = 0.1;

    if(getMag(enm.x-grav.x,enm.y-grav.y)<=grav.radius){
        enm.angle = getAngle((enm.x-grav.x),(enm.y-grav.y))+90;
    }

    enm.vx += enm.ax;
    enm.vy += enm.ay*enm.dir;

    if(enm.vx>enm.maxVx){
        enm.vx = enm.maxVx;
    }
    if(Math.abs(enm.vy)>enm.maxVy){
        //enm.vy = enm.maxVy*enm.dir;
        enm.dir*=-1;
    }

    var vx = getPoint([enm.vx,enm.angle],"x")+getPoint([enm.vy,enm.angle+(90)],"x");
    var vy = getPoint([enm.vx,enm.angle],"y")+getPoint([enm.vy,enm.angle+(90)],"y");

    enm.x += vx*friction;
    enm.y += vy*friction;

}

function playerEnemyHit(enm){
    player.health -= 10;

    //Player die :skull:
    if(player.health<=0){
        player.vy = 0;
        player.y = -10000;
    }

    //Reverse enemy vx
    enm.vx*=-1

    //Give player knockback ~~~
    var dist1 = getMag((player.x-(enm.x+getPoint([1,enm.angle],"x"))),(player.y-(enm.y+getPoint([1,enm.angle],"y"))));
    var dist2 = getMag((player.x-(enm.x+getPoint([-1,enm.angle],"x"))),(player.y-(enm.y+getPoint([-1,enm.angle],"y"))));

    if(dist1<dist2){ //Player on right side, knockback in enmAngle direction
        player.vx = getPoint([enm.bouncy,enm.angle],"x");
        player.vy = getPoint([enm.bouncy,enm.angle],"y");
    }else{ //Player on left side, knockback in enmAngle+180 direction
        player.vx = getPoint([-enm.bouncy,enm.angle],"x");
        player.vy = getPoint([-enm.bouncy,enm.angle],"y");
    }

    if(currentState=="onRope"){
        ropeObj = undefined;
        currentState = "default";
        ropeCool = false;
        setTimeout(ropeCoolDown,1000);
    }
}

function drawRope(rope){
    //drawBase (rect)
    rope.draw();
    //drawRope (line)
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(rope.x,rope.y);
    ctx.lineTo(rope.x+getPoint([rope.mag,rope.dir],"x"),rope.y+getPoint([rope.mag,rope.dir],"y"));
    ctx.stroke();
    ctx.restore();
}

function doRopeThings(rope){
    //Get rope angle
    if(getMag(rope.x-grav.x,rope.y-grav.y)<=grav.radius){
        rope.angle = getAngle((rope.x-grav.x),(rope.y-grav.y))+90; //resting angle
    }

    //Get player angle compare to rope.dir
    var collisionSize = 25;
    var ropeX = rope.x+getPoint([rope.mag,rope.dir],"x");
    var ropeY = rope.y+getPoint([rope.mag,rope.dir],"y");
    if(getMag(player.x-ropeX,player.y-ropeY)<collisionSize&&currentState!="onRope"&&ropeCool){
        console.log("collided with rope");
        ropeObj = rope;
        currentState = "onRope";
        ropeCool = false;
        setTimeout(ropeCoolDown,1000);
    }

    if(currentState!="onRope"){
        var restingAngle = rope.angle + 90;
        var friction = 0.98;
        rope.vx *= friction;
        var gravForce = 10;
        if(rope.dir-restingAngle>0){
            rope.vx += -gravForce;
        }else if(rope.dir-restingAngle<0){
            rope.vx += gravForce;
        }
        if(Math.abs(rope.vx)<2){rope.vx=0;}
        rope.dir += getRotatePercent(rope.vx,rope.mag);
    }

}

//Player States <<< -----------------------------------------------------------------
var states = { 
    "default": function(){
        //Move left right
        if(a){
            player.vx += getPoint([player.ax,player.angle+270],"x");
            player.vy += getPoint([player.ax,player.angle+270],"y");
        }
        if(d){
            player.vx += getPoint([player.ax,player.angle+90],"x");
            player.vy += getPoint([player.ax,player.angle+90],"y");
        }

        //Jump
        if(space&&canJump){
            player.vx += getPoint([100,player.angle],"x");
            player.vy += getPoint([100,player.angle],"y");
            canJump=false;
            player.maxMag = 42;
        }else if(player.maxMag>24){
            player.maxMag-=0.25;
        }
    },
    "onRope": function(){
        player.x = ropeObj.x+getPoint([ropeObj.mag,ropeObj.dir],"x");
        player.y = ropeObj.y+getPoint([ropeObj.mag,ropeObj.dir],"y");
        player.angle = ropeObj.dir;

        var restingAngle = ropeObj.angle + 90;

        /*Outside Function*///movement stuff i guess (if ropes.include(onRope))
            //If player press 'd', rope.vx += ax;
            //If player press 'a', rope.vx += -ax;
            //resting angle <-- angle, rope.vx += [some grav force?]*friction (towards angle)
            //maxVx :skull:
            //Use ax,vx --> dir change determined by circum, <!rope dir!> (determines pos basically)

        if(a){
            ropeObj.vx += ropeObj.ax;
        }
        if(d){
            ropeObj.vx += -ropeObj.ax;
        }

        if(ropeObj.dir<0){ropeObj.dir+=360;}
        if(ropeObj.dir>=360){ropeObj.dir-=360;}

        var friction = 0.98;
        ropeObj.vx *= friction;
        var gravForce = 10;
        if(ropeObj.dir-restingAngle>0){
            ropeObj.vx += -gravForce;
        }else if(ropeObj.dir-restingAngle<0){
            ropeObj.vx += gravForce;
        }
        
        if(Math.abs(ropeObj.vx)<2){ropeObj.vx=0;}

        ropeObj.dir += getRotatePercent(ropeObj.vx,ropeObj.mag);

        /*Outside Function*///if player jump
            //onRope = undefined, player.v <-- calculate from rope vx/vy or smth, rope.v go towards angle

        if(space&&ropeCool){
            var newAngle = getAngle((player.x-grav.x),(player.y-grav.y));

            player.angle = newAngle;
            player.vx = getPoint([ropeObj.dir,ropeObj.vx*0.1],"x");
            player.vy = getPoint([ropeObj.dir,ropeObj.vx*0.1],"y");

            //Last step
            ropeObj = undefined;
            currentState = "default";
            ropeCool = false;
            setTimeout(ropeCoolDown,1000);
        }
    }
};

//Game States <<< -----------------------------------------------------------------
var screens = {
    "title": function(){
        //If press start button
        if(mouseInsideObj(titleBtn)&&clicked){
            //titleBtn.y += 230;
            currentScreen = "instructions";
        }

        //Draw Start Button
        titleBtn.draw();

        //Title Screen Text
        ctx.save();
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "28px Arial black";
        ctx.fillText("Start",canvas.width/2,titleBtn.y+7);
        ctx.font = "48px Calibri black";
        ctx.fillText("Title Screen!",canvas.width/2,canvas.height/6);
        ctx.restore();
    },
    "playing": function(){
        //Do Gravity
        for(var i=0; i<physicsObjs.length; i++){
            if(heldObj!=physicsObjs[i]){
                objGrav(physicsObjs[i]);
            }
        }

        //If player can jump
        if(getMag(player.x-ground.x,player.y-ground.y)<ground.radius+player.width+2){
            canJump = true;
        }else{
            canJump = false;
        }

        //Enemy Movement
        for(var i=0; i<enemies.length; i++){
            if(enemies[i].health>0){
                moveEnemy(enemies[i]);
            }
        }

        // ~~~ INPUTS ~~~
        if(player.health>0){

            states[currentState]();

            // ~~~ Pickup/throw/drop Object ~~~
            pickUpObjectCode();

        }
        
        //Physics Objects Movement/Collision
        for(var j=0; j<physicsObjs.length; j++){
            if(heldObj!=physicsObjs[j]&&!enemies.includes(physicsObjs[j])){
                objMovement(physicsObjs[j]);
            }

            //Box collision
            //(for boxes)
            if(getMag(physicsObjs[j].y-box1.y,physicsObjs[j].x-box1.x)<physicsObjs[j].radius+box1.radius){
                if(getMag(physicsObjs[j].vx,physicsObjs[j].vy)>20){
                    breakBox(box1);
                }
            }
        }

        //if(getMag(ball1.vx,ball1.vy)>0){addForce(ball1,-0.4,0);}

        //Enemy Collisions
        for(var i=0; i<enemies.length; i++){
            if(enemies[i].health>0){
                for(var j=0; j<pickable.length; j++){
                    if(getMag(enemies[i].y-pickable[j].y,enemies[i].x-pickable[j].x)<enemies[i].radius+pickable[j].radius){ //Enemy gets hit by ball
                        enemies[i].health = 0;
                        breakBox(enemies[i]);
                        console.log("enemy hit");
                        break;
                    }
                }
                if(getMag(enemies[i].y-player.y,enemies[i].x-player.x)<enemies[i].radius+player.radius){ //Player gets hit by enemy
                    playerEnemyHit(enemies[i]);
                    console.log("player hit");
                }
            }
        }

        //Ball collisions
        for(var j=0; j<pickable.length; j++){
            if(heldObj!=pickable[j]){
                //do collision
                playerCollision(pickable[j]);
            }
        }
        playerCollision(box1);
        objCollision(ball1,ball2);
        objCollision(ball1,box1);
        objCollision(ball2,box1);

        //Rope collisions
        doRopeThings(rope1);

        //Drawing Objects
        grav.draw();
        ground.draw();
        drawRope(rope1); //for loop bruh
        player.draw();
        enemy1.draw();
        ball1.draw();
        ball2.draw();
        box1.draw();

        //Particles
        for(var j=0; j<particles.length; j++){
            var pa = particles[j];
            if(pa.x<0||pa.x>canvas.width||pa.y>canvas.height||pa.y<0||pa.health<=0){
                particles.splice(j,1);
            }else{
                particles[j].move();
                particles[j].draw();
                particles[j].health-=0.6;
            }
        }

        drawDebug();

        ctx.save();
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText("Space to jump, E to pickup when near a ball",30,30);
        ctx.fillText("W+E to throw up, S+E to drop",30,50);
        ctx.font = "20px Arial black";
        ctx.fillText("Health: "+player.health,30,80);
        ctx.restore();
    },
    "instructions": function(){
        //If press continue button
        if(mouseInsideObj(titleBtn)&&clicked){
            titleTxt.x = -1100
            titleTxt.y = 80
            resetTriggers();
            currentScreen = "tutorial";
            player.x = canvas.width/2;
            player.y = -100;
            player.angle = -90;
            ground.x-=2000;
            grav.x-=2000;
            ball1.x = -100;
            instructionsText[20] = "Use A/D or < > to move left and right, and [spacebar] to jump";
            instructionsText[21] = "Use E to pick up and throw the ball";
        }

        //Tweening stuff
        follow(titleBtn,{x:canvas.width/2,y:canvas.height-40},0.1);
        follow(titleTxt,{x:canvas.width/2,y:-40},0.1);
        follow(howToTxt,{x:canvas.width/2,y:70},0.1);

        //Move continue Button and stuff
        titleBtn.move();
        titleTxt.move();
        howToTxt.move();
        //Draw continue Button
        titleBtn.draw();

        //UI-TEXT
        ctx.save();
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "28px Arial black";
        ctx.fillText("Start",canvas.width/2,titleBtn.y+7);
        ctx.font = "48px Calibri black";
        ctx.fillText("Title Screen!",titleTxt.x,titleTxt.y);
        ctx.font = "40px Calibri black";
        for(var i=0; i<instructionsText.length; i++){
            if(i==1){ctx.font="28px Calibri black";}
            ctx.fillText(instructionsText[i],howToTxt.x,howToTxt.y+(i*40));
        }
        ctx.restore();
    },
    "tutorial": function(){

        var localGrav = 2;
        //When stuff done, continue
        tutorialStages[currentStage]();

        //Player Stuff
        if(player.y+player.height/2>canvas.height/2+100){
            canJump = true;
            while(player.y+player.height/2>canvas.height/2+100){
                player.y--;
            }
        }else{
            canJump = false;
        }

        states[currentState]();

        player.vy += localGrav;

        pickUpObjectCode();

        //Ball Stuff
        while(ball1.y+ball1.height/2>canvas.height/2+94){
            ball1.y--;
        }

        ball1.vy += localGrav;

        //Physics objects movement
        objMovement(player);
        objMovement(ball1);

        //Collision stuff
        if(heldObj!=ball1){playerCollision(ball1);}
        
        //Tweening Stuff
        follow(titleBtn,{x:canvas.width/2,y:canvas.height+100},0.05);
        follow(howToTxt,{x:canvas.width+300,y:70},0.1);
        follow(titleTxt,{x:40,y:70},0.1);

        //Move stuff
        titleBtn.move();
        howToTxt.move();
        titleTxt.move();

        //Draw Stuff
        titleBtn.draw();
        player.draw();
        ball1.draw();

        //UI-TEXT
        ctx.save();
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "28px Arial black";
        ctx.fillText("Start",canvas.width/2,titleBtn.y+7);

        ctx.textAlign = "left";
        ctx.font="28px Calibri black";
        ctx.fillText(instructionsText[currentStage+20],titleTxt.x,titleTxt.y);

        ctx.textAlign = "center";
        ctx.font = "40px Calibri black";
        for(var i=0; i<instructionsText.length; i++){
            if(i==1){ctx.font="28px Calibri black";}
            ctx.fillText(instructionsText[i],howToTxt.x,howToTxt.y+(i*40));
        }
        ctx.restore();
    },
    "pause": function(){

    }
};

var currentStage = 0;
var tutorialStages = [
    function(){
        checkTutorialTrigs(3,function(){ //if all triggers true
            ball1.x = canvas.width/3; //set up stuff for next stage
            ball1.y = 300;
        });
        if(a){triggers[0]=true;} //main triggers
        if(d){triggers[1]=true;}
        if(space&&canJump){triggers[2]=true;}
    },
    function(){
        checkTutorialTrigs(1,function(){
            //SETUP FOR NEXT STAGE
        });
        if(ek&&physicsObjs.includes(heldObj)){triggers[0]=true;} //main triggers
    },
    function(){

    }
];

function checkTutorialTrigs(numTrigs, setup){
    if(checkAllTriggers(numTrigs)){ //check triggers
        setTimeout(function(){triggers[numTrigs]=true;},2000); //time trigger
        if(checkAllTriggers(numTrigs+1)){
            resetTriggers(); //reset triggers
            setup();
            currentStage++; //go to next stage
        }
    }
}

function follow(obj,target,rate){
    var dx = target.x-obj.x;
    var dy = target.y-obj.y;
    obj.vx = dx*rate;
    obj.vy = dy*rate;
}

function ropeCoolDown(){
    ropeCool = true;
}

function drawDebug(){
    /*ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(enemy1.x,enemy1.y);
    ctx.lineTo(enemy1.x+getPoint([40,enemy1.angle],"x"),enemy1.y+getPoint([40,enemy1.angle],"y"));
    ctx.stroke();
    ctx.restore();
<<<<<<< HEAD << ok this is funny
    */
}

function pickUpObjectCode(){
    if(ek){
        if(eTimer>0){
            
        }else{
            if(holdingObj){
                heldObj.vx = player.vx;
                heldObj.vy = player.vy;

                if(w||space){
                    addForce(heldObj,40,0,player.angle);
                }else if(!s){
                    if(getMag(player.x-grav.x,player.y-grav.y)<=grav.radius){
                        addForce(heldObj,40,(-60*player.dir));
                    }else{
                        addForce(heldObj,40,(90*player.dir),player.angle);
                    }
                }

                heldObj = undefined;
                holdingObj = false;
            }else{
                pickable.sort(function(a, b){return (getMag(player.x-a.x,player.y-a.y) - getMag(player.x-b.x,player.y-b.y))});
                if(getMag(player.x-pickable[0].x,player.y-pickable[0].y)<50){
                    heldObj = pickable[0];
                    holdingObj = true;
                }
            }
            
            eTimer = st;
        }
        eTimer--;
    }else{
        eTimer = 0;
    }
    //If the player is holding an object
    if(holdingObj){
        //getting movement angle
        var mang = getAngle(player.vx,player.vy);
        if(mang<0){mang+=360;}
        if(player.angle<0){player.angle+=360;}
        var dirAngle = player.angle-mang
        if(dirAngle<0){dirAngle+=360;}

        //getting player dir
        mang = player.angle+90;
        if(dirAngle>180){
            player.dir = 1;
            mang = player.angle+90;
        }else if(dirAngle<180){
            player.dir = -1;
            mang = player.angle+270;
        }

        //holding object on left or right side
        heldObj.x = player.x + getPoint([player.width,mang],"x");
        heldObj.y = player.y + getPoint([player.width,mang],"y");
    }
}

function resetTriggers(){
    for(var rt=0; rt<20; rt++){
        triggers[rt] = false;
    }
}
function checkAllTriggers(upTil){
    var returnBool = true;
    for(var ct=0; ct<upTil; ct++){
        if(!triggers[ct]){returnBool=false; break;}
    }
    return returnBool;
}

var instructionsText = [
    "How To Play",
    "___________",
    "\n",
    "Use A/D or < > to move left and right",
    "Use [spacebar] to jump",
    "\n",
    "You can use E to pick up objects",
    "and throw them too",
    "\n",
    "Let's try mechanics out through a tutorial"
];
for(var i=10; i<20; i++){
    instructionsText[i] = "\n";
}