/*Matthew Satterfield - Entry for Mini-Jam: Fusion*/

//Camera object (replacement for what usually would be the player)
var cam = new Obj({x:canvas.width/2,y:canvas.height/2,ax:1.2,ay:1.2,friction:0.8,color:"red",width:10,height:10});

//Camera states
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

//Background
var ocean = new Obj({x:canvas.width/2,y:canvas.height/2,color:"rgba(10,90,140,0.9)",width:1000+canvas.width,height:1000+canvas.height});
ocean.img.src = "images/ocean.png";
var world = new Obj({x:canvas.width/2,y:canvas.height/2,color:"rgba(120,120,60,0.8)",width:1000,height:1000});
world.img.src = "images/dirt.png";

//Adding the singular objects to levelObjs
levelObjs = [cam,world,ocean];

//World borders
var b1 = new Obj({x:world.left()-1000,y:canvas.height/2,width:2000,height:world.height+2000,color:"lightgrey"});
var b2 = new Obj({x:world.right()+1000,y:canvas.height/2,width:2000,height:world.height+2000,color:"lightgrey"});
var b3 = new Obj({x:canvas.width/2,y:world.top()-1000,width:world.width+2000,height:2000,color:"lightgrey"});
var b4 = new Obj({x:canvas.width/2,y:world.bottom()+1000,width:world.width+2000,height:2000,color:"lightgrey"});

var borders = [b1,b2,b3,b4];
pushArray(borders,levelObjs);

//fuse objs
var numPlants = 12;
var fuseTypes = ["Blue Bulb","Red Fern","White Spike","Green Droop"];
var fusables = [];

//creatures
var numCreatures = 3;
var targetType = fuseTypes[0];
var typeTimer = 0;
var creatures = [];
var typeHint = new Text({x:canvas.width/2,y:40,align:"center",font:"28px Arial Black",text:"hi im text",stroke:"white"});

//Environment Bar & Population Bar
var envBar = new Bar({x:60,y:20,width:100,height:20,backColor:"grey",color:"lime",maxVal:20,stroke:"black",lineWidth:2});
var popBar = new Bar({x:60,y:40,width:100,height:20,backColor:"grey",color:"blue",maxVal:20,stroke:"black",lineWidth:2});
var bars = [envBar,popBar];

//Title stuff
var titleBtn = new Obj({x:canvas.width/2,y:canvas.height-60,width:160,height:60,color:"lime",stroke:"black",lineWidth:2});
var titleTxt = new Text({x:titleBtn.x,y:titleBtn.y+10,font:"40px times-new roman",text:"Start"});
var howToTxt1 = new Text({x:40,y:50,align:"left",font:"32px times-new roman",text:"Plant Fusers - How To Play",stroke:"black"});
var howToTxt2 = new Text({x:40,y:100,align:"left",font:"28px times-new roman",text:"Move around the Camera with WASD or Arrow Keys"});
var howToTxt3 = new Text({x:40,y:150,align:"left",font:"28px times-new roman",text:"Click and Drag plants to move them"});
var howToTxt4 = new Text({x:40,y:200,align:"left",font:"28px times-new roman",text:"Release a plant ontop of another to fuse them"});
var howToTxt5 = new Text({x:40,y:250,align:"left",font:"28px times-new roman",text:"---------------------------"});
var howToTxt6 = new Text({x:40,y:300,align:"left",font:"28px times-new roman",text:"The creatures will search for a specific plant"});
var howToTxt7 = new Text({x:40,y:350,align:"left",font:"28px times-new roman",text:"Manage the plants to ensure an even population..."});
var howToTxt8 = new Text({x:40,y:400,align:"left",font:"28px times-new roman",text:"...between both plants and creatures"});
var howToTxt9 = new Text({x:40,y:450,align:"left",font:"28px times-new roman",text:"Good Luck!"});
var howTo = [howToTxt1,howToTxt2,howToTxt3,howToTxt4,howToTxt5,howToTxt6,howToTxt7,howToTxt8,howToTxt9];

var settingsBtn = new Obj({x:canvas.width-80,y:60,width:100,height:50,color:"rgb(220,220,220)",stroke:"black",lineWidth:1});
var settingsTxt = new Text({x:settingsBtn.x,y:settingsBtn.y+10,font:"28px times-new roman",text:"Settings"});
var checkBox1 = new Obj({x:canvas.width/2-80,y:howToTxt2.y-8,width:40,height:40,color:"rgb(222,10,10)",stroke:"grey",lineWidth:2});

//Other vars
var totalTime = 0;
var highscore = 0;
var showPlantHitboxes = false;
var musicReady = false;
var musicPlaying = false;

gamestateInits = {
    "title":function(){
        titleTxt.text = "Start";
        howToTxt1.text = "Plant Fusers - How To Play";
        howToTxt2.text = "Move around the Camera with WASD or Arrow Keys";
        howToTxt3.text = "Click and Drag plants to move them";
        howToTxt4.text = "Release a plant ontop of another to fuse them";
        howToTxt5.text = "---------------------------";
        howToTxt6.text = "The creatures will search for a specific plant";
        howToTxt7.text = "Manage the plants to ensure an even population...";
        howToTxt8.text = "...between both plants and creatures";
        howToTxt9.text = "Good Luck!";
        howToTxt4.align = "left";
        howToTxt4.x = 40;
        howToTxt5.align = "left";
        howToTxt5.x = 40;
    },
    "playing":function(){
        //Setting Camera
        for(var mc=0; mc<levelObjs.length; mc++){
            levelObjs[mc].x += offset.x;
            levelObjs[mc].y += offset.y;
        }
        cam.x = canvas.width/2;
        cam.y = canvas.height/2;
        setCameraTarget(cam);
        //Clearing onClick
        onClick = function(){};
        //Clearing vars and arrays
        totalTime = 0;
        levelObjs = [cam,world,ocean];
        creatures = [];
        fusables = [];
        pushArray(borders,levelObjs);
        //Setting up environment
        for(var gi=0; gi<numPlants; gi++){
            var len = fusables.length;
            fusables.push(new Obj({
                x:randNum(world.left()+25,world.right()-25),
                y:randNum(world.top()+25,world.bottom()-25),
                width:50,height:50,stroke:"blue",lineWidth:1,
                p:{
                    type:[fuseTypes[3]],
                    timer:randInt(500,2000)
                }
            }));

            if(gi%4==0){fusables[len].p.type=[fuseTypes[0]];}
            else if(gi%4==1){fusables[len].p.type=[fuseTypes[1]];}
            else if(gi%4==2){fusables[len].p.type=[fuseTypes[2]];}
            plantImgSourcing(fusables[len]);
        }
        pushArray(fusables,levelObjs);
        //Setting up creatures
        for(var gi=0; gi<numCreatures; gi++){
            var len = creatures.length;
            creatures.push(new Obj({
                x:randNum(canvas.width/2-100,canvas.width/2+100),
                y:randNum(canvas.height/2-100,canvas.height/2+100),
                width:30,height:30,color:"yellow",shape:"circle",
                stroke:"black",lineWidth:1,
                friction:0.8,
                angle:randNum(0,360),
                p:{health:randInt(500,1000)}
            }));
            creatures[len].img.src = "images/creature.png";
        }
        pushArray(creatures,levelObjs);
    },
    "gameover":function(){
        onClick = function(){
            if(mouseInsideObj(titleBtn)){
                changeState("playing");
            }
            else if(mouseInsideObj(settingsBtn)){
                changeState("settings");
            }
        };
        settingsTxt.text = "Settings";
        howToTxt4.align = "center";
        howToTxt4.x = canvas.width/2;
        howToTxt5.align = "center";
        howToTxt5.x = canvas.width/2;
        howToTxt5.text = "Game ended due to ";
        if(popBar.value<=0){
            howToTxt5.text += "Creature Extinction";
        }else if(popBar.value>=popBar.maxVal){
            howToTxt5.text += "Creature Overpopulation";
        }else if(envBar.value<=0){
            howToTxt5.text += "Plant Extinction";
        }else{
            howToTxt5.text += "Plant Overpopulation";
        }
        if(totalTime>highscore){highscore=totalTime;}
        howToTxt4.text = "You lasted for "+Math.round(totalTime/60)+" seconds! | Highscore: "+Math.round(highscore/60);
        titleTxt.text = "Restart";
        for(var d=0; d<creatures.length; d++){
            creatures[d].angle = 0;
        }
    },
    "settings":function(){
        onClick = function(){
            if(mouseInsideObj(titleBtn)){
                changeState("playing");
            }
            else if(mouseInsideObj(settingsBtn)){
                changeState("title");
            }
            else if(mouseInsideObj(checkBox1)){
                showPlantHitboxes = !showPlantHitboxes;
                checkBox1.color = (showPlantHitboxes) ? ("rgb(10,222,10)"):("rgb(222,10,10)");
            }
        };
        settingsTxt.text = "How To";
        titleTxt.text = "Start";
        howToTxt1.text = "~~~ Settings! ~~~";
        howToTxt2.text = "Show Plant Hitboxes - ";
        howToTxt3.text = "";
        howToTxt4.text = "";
        howToTxt5.text = "";
        howToTxt6.text = "";
        howToTxt7.text = "";
        howToTxt8.text = "";
        howToTxt9.text = "";
        howToTxt4.align = "left";
        howToTxt4.x = 40;
        howToTxt5.align = "left";
        howToTxt5.x = 40;
    }
};

changeState("title");

gamestates = {
    "title":function(){
        //Button Clicked
        if(mouseDown&&mouseInsideObj(titleBtn)){
            changeState("playing");
        }

        //Drawing
        titleBtn.draw();
        titleTxt.draw();
        for(var d=0; d<howTo.length; d++){
            howTo[d].draw();
        }
    },
    "playing":function(){
        //Music
        if(musicReady&&!musicPlaying){
            musicPlaying = true;
            console.log("playing music");
            document.getElementById("game-music").currentTime = 0;
            document.getElementById("game-music").volume = 0.2;
            document.getElementById("game-music").play();
        }

        //Do
        totalTime++;
        cam.doState();
        pickObjs();
        creaturesMove();
        //Timed stuff
        plantReplication();
        creatureAging();
        targetTypeChanging();
        //Bar stuff
        envBar.value = fusables.length;
        popBar.value = creatures.length;
        if(popBar.value<=0||popBar.value>=popBar.maxVal||envBar.value<=0||envBar.value>=envBar.maxVal){
            //Game over
            changeState("gameover");
        }

        //Move
        cam.move();
        if(pickedObj!==undefined){
            movePicked();
            collPicked();
        }

        //Creatures collision
        creaturesColl();

        //Move camera
        moveCamera();

        //Draw
        ocean.drawImage();
        world.drawImage();
        for(var d=0; d<fusables.length; d++){
            if(showPlantHitboxes){fusables[d].draw();}
            fusables[d].drawImage();
        }
        
        for(var d=0; d<creatures.length; d++){
            var _tempAng = creatures[d].angle;
            creatures[d].angle = 0;
            creatures[d].drawImage();
            creatures[d].angle = _tempAng;
        }
        for(var d=0; d<bars.length; d++){bars[d].draw();}

        typeHint.draw();

    },
    "gameover":function(){
        //Do
        cam.doState();

        //Move
        cam.move();

        //Move camera
        moveCamera();

        //Draw
        ocean.drawImage();
        world.drawImage();
        for(var d=0; d<fusables.length; d++){fusables[d].drawImage();}
        for(var d=0; d<creatures.length; d++){creatures[d].drawImage();}
        for(var d=0; d<bars.length; d++){bars[d].draw();}

        //Game Over Text & Btn
        howToTxt4.draw();
        howToTxt5.draw();
        titleBtn.draw();
        titleTxt.draw();
        settingsBtn.draw();
        settingsTxt.draw();
    },
    "settings":function(){
        //Button Clicked
        if(mouseDown&&mouseInsideObj(titleBtn)){
            changeState("playing");
        }

        //Drawing
        titleBtn.draw();
        titleTxt.draw();
        for(var d=0; d<howTo.length; d++){
            howTo[d].draw();
        }
        settingsBtn.draw();
        settingsTxt.draw();
        checkBox1.draw();
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
            if(pickedObj.stroke="red"){
                for(var mp=0; mp<fusables.length; mp++){
                    if(pickedObj.hits(fusables[mp])&&pickedObj!=fusables[mp]&&pickedObj.img.src!=fusables[mp].img.src){
                        fuse(mp);
                    }
                }
            }
            pickedObj.vx = 0;
            pickedObj.vy = 0;
            pickedObj.stroke = "blue";
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
        if(pickedObj.hits(fusables[mp])&&pickedObj!=fusables[mp]&&pickedObj.img.src!=fusables[mp].img.src){
            pickedObj.stroke = "red";
            break;
        }else{
            pickedObj.stroke = "blue";
        }
    }
    for(var ps=0; ps<borders.length; ps++){
        pickedObj.collides(borders[ps]);
    }
}

function fuse(i2){
    for(var fs=0; fs<pickedObj.p.type.length; fs++){
        if(!fusables[i2].p.type.includes(pickedObj.p.type[fs])){
            fusables[i2].p.type.push(pickedObj.p.type[fs]);
            plantImgSourcing(fusables[i2]);
        }
    }
    fusables.splice(fusables.indexOf(pickedObj),1);
}

function creaturesMove(){
    var range = 150;
    for(var cm=0; cm<creatures.length; cm++){
        var _inRange = [];
        for(var m=0; m<fusables.length; m++){
            if(getMag(creatures[cm].x-fusables[m].x,creatures[cm].y-fusables[m].y)<range&&fusables[m].p.type.includes(targetType)){
                _inRange.push(fusables[m]);
            }
        }
        if(_inRange.length>0){
            //_inRange.sort(function(a, b){return b-a}); //<<< find smallest distance (right now does not)
            var _sel = randInt(0,_inRange.length-1);
            var _ang = getAngle(creatures[cm].x-_inRange[_sel].x,creatures[cm].y-_inRange[_sel].y)+180;
            creatures[cm].vx = getPoint([2,_ang],"x");
            creatures[cm].vy = getPoint([2,_ang],"y");
            creatures[cm].angle = _ang;
            creatures[cm].img.src = "images/creatureEat.png";
        }else{
            //randomly wander
            creatures[cm].img.src = "images/creature.png";
            creatures[cm].angle += randNum(-15,15);
            creatures[cm].vx = getPoint([1,creatures[cm].angle],"x");
            creatures[cm].vy = getPoint([1,creatures[cm].angle],"y");
        }
        creatures[cm].move();
    }
}

function creaturesColl(){
    for(var cm=0; cm<creatures.length; cm++){
        //World border collision
        for(var ps=0; ps<borders.length; ps++){
            creatures[cm].collides(borders[ps]);
        }

        //Plant collision
        for(var m=0; m<fusables.length; m++){
            if(creatures[cm].hits(fusables[m])){
                //creature eats plant (or maybe ignores if not the right type?)
                if(fusables[m].p.type.includes(targetType)){
                    replicate(creatures[cm],creatures);
                    fusables.splice(m,1);
                }
            }
        }
    }
}

function replicate(obj,arr){
    var _len = arr.length;
    var _dirX = 1;
    var _dirY = 1;
    if(percent(50)){_dirX = -1;}
    if(percent(50)){_dirY = -1;}
    var _x = obj.x+((obj.width+randNum(5,20))*_dirX);
    var _y = obj.y+((obj.height+randNum(5,20))*_dirY);

    //Replicating Object
    if(obj.shape=="circle"){
        arr.push(new Obj({
            x:_x,
            y:_y,
            width:30,height:30,color:"yellow",shape:"circle",
            stroke:"black",lineWidth:1,
            friction:0.8,
            angle:randNum(0,360),
            p:{health:randInt(500,1000)}
        }));
        arr[_len].img.src = "images/creature.png";
    }else{
        var _type = [];
        for(var rr=0; rr<obj.p.type.length; rr++){
            _type.push(obj.p.type[rr]);
        }
        arr.push(new Obj({
            x:_x,
            y:_y,
            width:50,height:50,stroke:"blue",lineWidth:1,
            p:{
                type:_type,
                timer:randInt(500,2000)
            }
        }));
        plantImgSourcing(arr[_len]);
    }

    //Making sure that things aren't overlapping or out of bounds
    for(var ps=0; ps<borders.length; ps++){
        arr[_len].collides(borders[ps]);
    }
    for(var ps=0; ps<_len; ps++){
        arr[_len].collides(arr[ps]);
    }

    levelObjs.push(arr[_len]);
}

function plantReplication(){
    for(var mp=0; mp<fusables.length; mp++){
        fusables[mp].p.timer--;
        if(fusables[mp].p.timer<=0){
            fusables[mp].p.timer = randInt(500,2000);
            replicate(fusables[mp],fusables);
            fusables[mp].p.timer = randInt(500,2000);
        }
    }
}

function creatureAging(){
    for(var cm=0; cm<creatures.length; cm++){
        creatures[cm].p.health-=0.5;
        if(creatures[cm].p.health<=0){
            creatures.splice(cm,1);
        }
    }
}

function targetTypeChanging(){
    typeTimer--;
    if(typeTimer<=0){
        targetType = fuseTypes[randInt(0,3)];
        typeHint.text = "The Creatures want : "+targetType+"!";
        typeTimer = 500;
    }
}

function plantImgSourcing(obj){ //Use when creating, replicating, or initilizing plants
    var typeLen = obj.p.type.length;
    switch(typeLen){
        case(1): //ONLY 1 TYPE
            switch(obj.p.type[0]){
                case(fuseTypes[0]):
                obj.img.src = "images/bulb.png";
                break;
                case(fuseTypes[1]):
                obj.img.src = "images/fern.png";
                break;
                case(fuseTypes[2]):
                obj.img.src = "images/spike.png";
                break;
                case(fuseTypes[3]):
                obj.img.src = "images/droop.png";
                break;
            }
        break;
        case(2): //2 TYPES
            if(obj.p.type.includes(fuseTypes[0])&&obj.p.type.includes(fuseTypes[1])){
                obj.img.src = "images/bulbFern.png";
            }else if(obj.p.type.includes(fuseTypes[0])&&obj.p.type.includes(fuseTypes[2])){
                obj.img.src = "images/bulbSpike.png";
            }else if(obj.p.type.includes(fuseTypes[0])&&obj.p.type.includes(fuseTypes[3])){
                obj.img.src = "images/bulbDroop.png";
            }else if(obj.p.type.includes(fuseTypes[1])&&obj.p.type.includes(fuseTypes[2])){
                obj.img.src = "images/spikeFern.png";
            }else if(obj.p.type.includes(fuseTypes[1])&&obj.p.type.includes(fuseTypes[3])){
                obj.img.src = "images/droopFern.png";
            }else{ // fuseTypes[2] && fuseTypes[3]
                obj.img.src = "images/droopSpike.png";
            }
        break;
        case(3): //3 TYPES
            if(!obj.p.type.includes(fuseTypes[0])){
                obj.img.src = "images/butBulb.png";
            }else if(!obj.p.type.includes(fuseTypes[1])){
                obj.img.src = "images/butFern.png";
            }else if(!obj.p.type.includes(fuseTypes[2])){
                obj.img.src = "images/butSpike.png";
            }else{
                obj.img.src = "images/butDroop.png";
            }
        break;
        case(4): //ALL 4 TYPES
        obj.img.src = "images/all4.png";
        break;
    }
}