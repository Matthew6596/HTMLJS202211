/*Matthew Satterfield - Entry for Mini-Jam: Fusion*/

var cam = new Obj({x:canvas.width/2,y:canvas.height/2,ax:0.8,ay:0.8,friction:0.8,color:"red",width:10,height:10});

//Ground
var world = new Obj({x:canvas.width/2,y:canvas.height/2,color:"rgba(60,200,0,0.2)",width:1000,height:1000});

//Setting up camera
levelObjs = [cam,world];
setCameraTarget(cam);
camera.x = cam.x;
camera.y = cam.y;

//World borders
var b1 = new Obj({x:world.left(),y:canvas.height/2,width:200,height:world.height+1000,color:"lightgrey"});
var b2 = new Obj({x:world.right(),y:canvas.height/2,width:200,height:world.height+1000,color:"lightgrey"});
var b3 = new Obj({x:canvas.width/2,y:world.top(),width:world.width+1000,height:200,color:"lightgrey"});
var b4 = new Obj({x:canvas.width/2,y:world.bottom(),width:world.width+1000,height:200,color:"lightgrey"});

var borders = [b1,b2,b3,b4];
pushArray(borders,levelObjs);

//fuse objs
var fuseTypes = ["type1","type2","type3"];
var fusables = [];

//creatures
var creatures = [];

gamestateInits = {
    "title":function(){

    },
    "playing":function(){
        levelObjs = [cam,world];
        fusables = [];
        pushArray(borders,levelObjs);
        //Setting up environment
        for(var gi=0; gi<10; gi++){
            var len = fusables.length;
            fusables.push(new Obj({
                x:randNum(world.left()+100,world.right()-100),
                y:randNum(world.top()+100,world.bottom()-100),
                width:50,height:50,color:"blue",
                p:{type:[fuseTypes[randInt(0,2)]]}
            }));

            if(fusables[len].p.type=="type1"){fusables[len].width+=20;}
            if(fusables[len].p.type=="type2"){fusables[len].height+=20;}
            if(fusables[len].p.type=="type3"){fusables[len].width-=20; fusables[len].height-=20;}
        }
        pushArray(fusables,levelObjs);
        //Setting up creatures
        for(var gi=0; gi<5; gi++){
            var len = creatures.length;
            creatures.push(new Obj({
                x:randNum(canvas.width/2-100,canvas.width/2+100),
                y:randNum(canvas.height/2-100,canvas.height/2+100),
                width:30,height:30,color:"green",shape:"circle",
                friction:0.8,
                angle:randNum(0,360)
            }));
        }
        pushArray(creatures,levelObjs);
    }
};

changeState("playing");

gamestates = {
    "title":function(){

    },
    "playing":function(){
        //Do
        cam.doState();
        pickObjs();
        creaturesMove();

        //Move
        cam.move();
        if(pickedObj!==undefined){
            movePicked();
            collPicked();
        }

        //Move camera
        moveCamera();

        //Draw
        world.draw();
        for(var d=0; d<fusables.length; d++){fusables[d].draw();}
        for(var d=0; d<creatures.length; d++){creatures[d].draw();}
    }
}

cam.states = {
    "default":function(){
        if(getAnyKey(["keyW","arrowup"])){cam.vy -= cam.ay;}
        if(getAnyKey(["keyA","arrowleft"])){cam.vx -= cam.ax;}
        if(getAnyKey(["keyS","arrowdown"])){cam.vy += cam.ay;}
        if(getAnyKey(["keyD","arrowright"])){cam.vx += cam.ax;}
        for(var ps=0; ps<borders.length; ps++){
            cam.collides(borders[ps]);
        }
    }
}

var pickedObj = undefined;

function pickObjs(){
    if(pickedObj===undefined){ //No obj picked
        if(mouseDown){ //Mouse down
            for(var po=0; po<fusables.length; po++){
                if(mouseInsideObj(fusables[po])){
                    pickedObj = fusables[po];
                }
            }
        }
    }else{ //Obj picked
        if(!mouseDown){ //Mouse up
            if(pickedObj.color="red"){
                for(var mp=0; mp<fusables.length; mp++){
                    if(pickedObj.hits(fusables[mp])&&pickedObj!=fusables[mp]){
                        fuse(mp);
                    }
                }
            }
            pickedObj.vx = 0;
            pickedObj.vy = 0;
            pickedObj.color = "blue";
            pickedObj = undefined;
        }
    }
}

function movePicked(){
    //Move picked obj
    follow(pickedObj,{x:mousex,y:mousey},0.5);
    pickedObj.move();
}

function collPicked(){
 //If picked obj hitting other obj
    for(var mp=0; mp<fusables.length; mp++){
        if(pickedObj.hits(fusables[mp])&&pickedObj!=fusables[mp]){
            pickedObj.color = "red";
            break;
        }else{
            pickedObj.color = "blue";
        }
    }
}

function fuse(i2){
    for(var fs=0; fs<pickedObj.p.type.length; fs++){
        if(!fusables[i2].p.type.includes(pickedObj.p.type[fs])){
            fusables[i2].p.type.push(pickedObj.p.type[fs]);
        }
    }
    fusables.splice(fusables.indexOf(pickedObj),1);
}

function creaturesMove(){
    var range = 00;
    for(var cm=0; cm<creatures.length; cm++){
        var _inRange = [];
        for(var m=0; m<fusables.length; m++){
            if(getMag(creatures[cm].x-fusables[m].x,creatures[cm].y-fusables[m].y)<range){
                _inRange.push(fusables[m]);
            }
        }
        if(_inRange.length>0){
            _inRange.sort(function(a, b){return b-a}); //<<< find smallest distance (right now does not)
            var _ang = getAngle(creatures[cm].x-_inRange[0].x,creatures[cm].y-_inRange[0].y)+180;
            creatures[cm].vx = getPoint([3,_ang],"x");
            creatures[cm].vy = getPoint([3,_ang],"y");
        }else{
            //randomly wander
            creatures[cm].angle += randNum(-15,15);
            creatures[cm].vx = getPoint([2,creatures[cm].angle],"x");
            creatures[cm].vy = getPoint([2,creatures[cm].angle],"y");
        }
        creatures[cm].move();
        for(var ps=0; ps<borders.length; ps++){
            creatures[cm].collides(borders[ps]);
        }
    }
}