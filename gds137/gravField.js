var x = 0;
var y = 0;
var pMovement = [0,0];
var pInput = [3,0];
var grav = [10,0];
var pAngle = 0;

var inputCom = [0,0];
var gravCom = [0,0];

function main(){
    //Get Input
    getInput();
    getGrav();
    //Get Vector Components
    inputCom[0] = getPoint(pInput,"x");
    inputCom[1] = getPoint(pInput,"y");
    gravCom[0] = getPoint(grav,"x");
    gravCom[1] = getPoint(grav,"y");
    //Add Grav and Input
    var tempVect = addComs(inputCom,gravCom);
    //Add to prev Movement
    pMovement = addComs(pMovement,tempVect);
    x = getPoint(pMovement,"x");
    y = getPoint(pMovement,"y");
    
    console.log(x);
    console.log(y);
}

function getInput(){
    pInput[0] = 3; //3 = player VX
    if("right"){pInput[1]=pAngle+0;}
    if("left"){pInput[1]=pAngle+180;}
    else{pInput[0]=0;}
}

function getGrav(){
    grav[1] = pAngle+270;
}

function addComs(c1,c2){
    var newX, newY, newAng, newMag;
    newX = c1[0] + c2[0];
    newY = c1[1] + c2[1];

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