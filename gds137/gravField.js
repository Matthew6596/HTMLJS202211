var timer = setInterval(main,1000/60);

var pInput = [3,0];

var player = new Obj("joe",700,40,20,40,"rect");
player.maxVx = 4;
player.maxVy = 10;
player.movement = [0,0];
player.maxMag = 20;

var grav = new Obj("field1",canvas.width/2,canvas.height+10,600,600,"circle");
grav.color = "lightblue";
grav.force = 0.1;
grav.angle = player.angle+90;
grav.movement = [0,grav.angle];

var ground = new Obj("steve",canvas.width/2,canvas.height-40,canvas.width,80,"rect");
ground.color = "grey";

var canJump = false;

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //

    if(getMag(player.x-grav.x,player.y-grav.y)<=grav.radius){
        grav.force=-1;
        player.angle = getAngle(player.x-grav.x,player.y-grav.y)+90;
    }else{
        //player.angle = 0;
        grav.force = 0;
    }
    canJump = false;
    while(player.collides(ground)){
        player.y--;
        player.vy=0;
        player.updateColPoints();
        canJump = true;
        player.movement[0] = 0;
    }

    //Get Input
    getInput();
    getGrav();
    //Get Vector Components

    //Add Grav and Input
    var tempVect = addVects(pInput,grav.movement);

    //Reused com vars for next calc

    //Add to prev Movement
    console.log(player.movement[0]);
    player.movement = addVects(tempVect,player.movement);
    /*if(pInput[0]>0){
        player.movement = tempVect;
    }else{
        
    }*/

    if(player.movement[0]>player.maxMag){player.movement[0]=player.maxMag;}

    player.vx = getPoint(player.movement,"x");
    player.vy = getPoint(player.movement,"y");

    player.move();

    grav.draw();
    ground.draw();
    player.draw();
}

function getInput(){
    pInput[0] = 0; //3 = player VX
    if(d){pInput[1]=player.angle; pInput[0] = 1;}
    if(a){pInput[1]=player.angle+180; pInput[0] = 1;}
    if(s){pInput[1]=player.angle+90; pInput[0] = 1;}
    if(w&&canJump){pInput[1]=player.angle+270; pInput[0] = 40;}
}

function getGrav(){
    grav.movement[0] = grav.force;
    grav.movement[1] = player.angle+270;
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
    if(b==0){return (a>0) ? 0:180;}
    return toDegrees((Math.acos(a/Math.sqrt(Math.pow(a,2)+Math.pow(b,2)))*(b/(Math.abs(b)))));
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