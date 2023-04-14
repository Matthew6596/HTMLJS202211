var timer = setInterval(main,1000/60);

var pInput = [3,0];

var st = 24;
var eTimer = 0;

var holdingObj = false;
var heldObj = undefined;

/* --------------- OBJECT DECLARATIONS HERE --------------- */
var player = new Obj("joe",600,100,20,40,"rect");
player.maxMag = 24;
player.bounded = false;
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
ball1.bounded = false;
ball1.color = "purple";

var ball2 = new Obj("lameo",500,100,20,20,"circle");
ball2.maxMag = 60;
ball2.bounded = false;
ball2.color = "blue";

var box1 = new Obj("Mike",600,400,30,30,"rect");
box1.maxMag = 10;
box1.bounded = false;
box1.color = "saddlebrown";

var physicsObjs = [player,ball1,ball2,box1];
var pickable = [ball1,ball2];
var particles = [];
var boxes = [box1];

//

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //

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

    // ~~~ INPUTS ~~~
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

    // ~~~ Pickup/throw/drop Object ~~~
    if(ek){
        if(eTimer>0){
            
        }else{
            if(holdingObj){
                heldObj.vx = player.vx;
                heldObj.vy = player.vy;

                if(w||space){
                    addForce(heldObj,40,0,player.angle);
                }else if(!s){
                    addForce(heldObj,40,(-60*player.dir));
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
    
    //Physics Objects Movement/Collision
    for(var j=0; j<physicsObjs.length; j++){
        if(heldObj!=physicsObjs[j]){
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

    //Drawing Objects
    grav.draw();
    ground.draw();
    player.draw();
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

    /*ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(player.x,player.y);
    ctx.lineTo(grav.x,grav.y);
    ctx.stroke();
    ctx.restore();*/

    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Space to jump, E to pickup when near a ball",30,30);
    ctx.fillText("W+E to throw up, S+E to drop",30,50);
    ctx.restore();

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

        obj.vx += getPoint([gravForce,obj.angle],"x");
        obj.vy += getPoint([gravForce,obj.angle],"y");
    }
}

function objMovement(obj){
    var dec = 0.8; //friction
    if(obj!=player){dec=0.9;}

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

function getDir(obj){
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
        particles[bb].color = "saddlebrown";
        particles[bb].vx = randNum(-10,10);
        particles[bb].vy = randNum(-10,10);
        particles[bb].maxVx = 100;
        particles[bb].maxVy = 100;
        particles[bb].bounded = false;
    }
    box.x = 10000;
}
