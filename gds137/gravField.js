var timer = setInterval(main,1000/60);

var pInput = [3,0];

var player = new Obj("joe",600,100,20,40,"rect");
player.maxMag = 20;
player.maxVx = getPoint([player.maxMag,player.angle],"x");
player.maxVy = getPoint([player.maxMag,player.angle],"y");
player.movement = [0,0];
player.bounded = false;

var grav = new Obj("field1",canvas.width/2,canvas.height/2,600,600,"circle");
grav.color = "lightblue";
grav.force = -1;
grav.angle = player.angle+90;
grav.movement = [0,grav.angle];

var ground = new Obj("steve",canvas.width/2,canvas.height/2,200,200,"circle");
ground.color = "grey";

var canJump = false;

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //

    if(getMag(player.x-grav.x,player.y-grav.y)<=grav.radius){//If inside field
        grav.force = -1;

        player.angle = getAngle((player.x-grav.x),(player.y-grav.y));

        player.vx += getPoint([grav.force,player.angle],"x");
        player.vy += getPoint([grav.force,player.angle],"y");
    }else{grav.force=0;}

    if(a){
        player.vx += getPoint([1,player.angle-90],"x");
        player.vy += getPoint([1,player.angle-90],"y");
    }
    if(d){
        player.vx += getPoint([1,player.angle+90],"x");
        player.vy += getPoint([1,player.angle+90],"y");
    }

    if(getMag(player.x-ground.x,player.y-ground.y)<ground.radius){
        /*player.x = ground.x+getPoint([ground.radius,player.angle],"x");
        player.y = ground.y+getPoint([ground.radius,player.angle],"y");*/

        /*player.vx -= getPoint([grav.force,player.angle],"x");
        player.vy -= getPoint([grav.force,player.angle],"y");*/

        player.x = getPoint([ground.radius,player.angle],"x")+ground.x;
        player.y = getPoint([ground.radius,player.angle],"y")+ground.y;
    }

    //check max velocity
    player.maxVx = getPoint([player.maxMag,player.angle],"x");
    player.maxVy = getPoint([player.maxMag,player.angle],"y");

    /*if(player.vx>player.maxVx){player.vx=player.maxVx;}
    else if(player.vx<-player.maxVx){player.vx=-player.maxVx;}
    if(player.vy>player.maxVy){player.vy=player.maxVy;}
    else if(player.vy<-player.maxVy){player.vy=-player.maxVy;}*/

    player.x += player.vx;
    player.y += player.vy;

    /*THE MEGA COMMENT OUT ~ ~ ~

    if(getMag(player.x-grav.x,player.y-grav.y)<=grav.radius){
        grav.force=-1;
        player.angle = Math.round(getAngle((player.x-grav.x),(player.y-grav.y))+90);
        //console.log(player.angle-90);
    }else{
        //player.angle = 0;
        grav.force = 0;
    }
    canJump = false;
    if(getMag(player.x-ground.x,player.y-ground.y)<=ground.radius){
        var tempVect2 = [ground.radius,player.angle+270];

        player.x = ground.x+getPoint(tempVect2,"x");
        player.y = ground.y+getPoint(tempVect2,"y");
        player.vy=0;
        player.vx=0;
        //player.updateColPoints();
        canJump = true;
        //player.movement[0] = 0;
        //player.movement[1] = player.angle;
    }

    //Get Input
    getInput();
    getGrav();
    //Get Vector Components

    //Add Grav and Input
    //var tempVect = addVects(pInput,grav.movement);

    //If player grounded
    if(canJump&&!w){
        var inpDir = 0;
        var inpMag = 5;
        if((!a&&!d)||(a&&d)){inpMag=0;}
        else if(a){inpDir = 180;}
        else if(d){inpDir = 0;}
        pInput = [inpMag,player.angle-inpDir];

    }else{
        
        //Add to prev Movement
        //player.movement = addVects(pInput,player.movement);
        //player.movement = addVects(grav.movement,player.movement);

        //if(player.movement[0]>player.maxMag){player.movement[0]=player.maxMag;}

    }

    player.vx += getPoint(grav.movement,"x");
    player.vy += getPoint(grav.movement,"y");
    player.vx += getPoint(pInput,"x");
    player.vy += getPoint(pInput,"y");

    //player.vx = getPoint(player.movement,"x");
    //player.vy = getPoint(player.movement,"y");
    

    player.move();
    */ //End Of Mega Comment Out ~ ~ ~

    grav.draw();
    ground.draw();
    player.draw();

    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.translate(player.x,player.y)
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(getPoint(player.movement,"x"),getPoint(player.movement,"y"));
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(player.x,player.y);
    ctx.lineTo(grav.x,grav.y);
    ctx.stroke();
    ctx.restore();
}

function getInput(){
    pInput[0] = 0; //3 = player VX
    if(d){pInput[1]=player.angle; pInput[0] = 1;}
    if(a){pInput[1]=player.angle+180; pInput[0] = 1;}
    if(s){pInput[1]=player.angle+90; pInput[0] = 1;}
    if(w&&canJump){pInput[1]=player.angle+270; pInput[0] = 40;}
    //console.log("m:"+pInput[0]+", a:"+pInput[1]);
}

function getGrav(){
    grav.movement[0] = grav.force;
    grav.movement[1] = player.angle+270;
    //console.log("m:"+grav.movement[0]+", a:"+grav.movement[1]);
}

function addVects(c1,c2){
    var tempC1 = [0,0]
    var tempC2 = [0,0]
    tempC1[0] = getPoint(c1,"x");
    tempC1[1] = getPoint(c1,"y");
    tempC2[0] = getPoint(c2,"x");
    tempC2[1] = getPoint(c2,"y");

    var newX, newY, newAng, newMag;
    newX = tempC1[0] + tempC2[0];
    newY = tempC1[1] + tempC2[1];

    newMag = getMag(newX,newY);
    newAng = getAngle(newX,newY);

    return [newMag,newAng];
}

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