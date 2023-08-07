/*Matthew Satterfield - Entry for Boss Bash Jam*/

//Misc vars
var musicReady = false;
var musicPlaying = false;
var spinLength = 16;
var spinCool = 12;
var gemsCollected = 0;
var prevGemAmount = 0;
var maxHp = 100;
var onTitle = true;
var phase = 0;
var bossTimer = 0;
var soundTimer = 0;
var soundTimer2 = 0;

//Player
var player = new Obj({x:canvas.width/2,y:canvas.height/2,ax:1,ay:1,friction:0.8,color:"red",width:30,height:30,p:{
    health:maxHp,
    spinTime:spinLength,
    cooldown:spinCool
}});
player.setImgData({x:840,y:200,width:30,height:30});

var cam = new Obj({x:canvas.width/2,y:canvas.height/2});

cam.states = {
    "default":function(){
        follow(cam,player,1);
        cam.move();
    }
}

//Player states
player.states = {
    "default":function(){
        //Basic WASD movement
        if(getAnyKey(["keyW","arrowup"])){player.vy -= player.ay;}
        if(getAnyKey(["keyA","arrowleft"])){player.vx -= player.ax;}
        if(getAnyKey(["keyS","arrowdown"])){player.vy += player.ay;}
        if(getAnyKey(["keyD","arrowright"])){player.vx += player.ax;}
        if(getKey("space")&&player.p.cooldown<=0){player.p.spinTime=spinLength; player.currentState = "spin";}
        else if(player.p.cooldown>0){player.p.cooldown--;}
        //Health Stuff
        playerHealthStuff();
        //Regen
        if(player.p.health<maxHp){player.p.health+=0.4;}
        //Uhhhh
        soundTimer--;
        soundTimer2--;
    },
    "spin":function(){
        //Basic WASD movement sped up
        var spdMult = 2.6;
        if(getAnyKey(["keyW","arrowup"])){player.vy -= player.ay*spdMult;}
        if(getAnyKey(["keyA","arrowleft"])){player.vx -= player.ax*spdMult;}
        if(getAnyKey(["keyS","arrowdown"])){player.vy += player.ay*spdMult;}
        if(getAnyKey(["keyD","arrowright"])){player.vx += player.ax*spdMult;}
        //End Spin
        player.angle+=20;
        player.p.spinTime--;
        if(player.p.spinTime<=0){player.currentState="default"; player.angle=0; player.p.cooldown=spinCool;}
        //Health Stuff
        playerHealthStuff();
        //Regen
        if(player.p.health<maxHp){player.p.health+=0.2;}
        //Uhhhh
        soundTimer--;
        soundTimer2--;
    }
}
function playerHealthStuff(){
    //Hp bar stuff
    hpBar.value = player.p.health;
    helpText.x = player.x;
    helpText.y = player.y-player.height-10;
}

//Background and foreground
var world = new Obj({x:canvas.width*2,y:canvas.height/2,width:3240,height:640});
world.setImgData({y:600,width:world.width,height:world.height});

//World objects and stuff
var lever1 = new Obj({x:-1000,width:40,height:40,color:"orange"});
var lever2 = new Obj({x:-1000,width:40,height:40,color:"orange"});
var door1 = new Obj({x:-1000,width:75,height:200,color:"purple",friction:0.9,ay:0.5});
var door2 = new Obj({x:-1000,width:75,height:200,color:"purple",friction:0.9,ay:0.5});
var boss = new Obj({x:-1000,width:280,height:280,friction:0.9,p:{health:maxHp*10},color:"blue"});
boss.setImgData({width:280,height:280});
var hitzone = new Obj({x:-1000,color:"rgba(255,0,0,0.4)"});

var levers = [lever1,lever2];
var doors = [door1,door2];
var rocks = [];
var gems = [];
var goop = [];
var particles = [];

setImgData(levers,{x:1865,width:40,height:40});
setImgData(doors,{x:840,width:75,height:200});

//Borders for player collision
var borders = [];

var gui = [];

//Gameplay UI Stuff
var hpBar = new Bar({x:95,y:canvas.height-30,width:100,height:20,backColor:"grey",color:"green",maxVal:maxHp,stroke:"black",lineWidth:2});
var hpIcon = new Obj({x:30,y:canvas.height-30,width:40,height:40,color:"red"});
hpIcon.setImgData({x:1805,width:40,height:40});
var gemIcon = new Obj({x:canvas.width-40,y:canvas.height-30,width:40,height:40,color:"red"});
gemIcon.setImgData({x:1415,width:40,height:40});
var score = new Text({x:canvas.width-40,y:canvas.height-24,font:"28px Calibri black",text:"0",stroke:"white"});
var helpText = new Text({x:canvas.width-40,y:canvas.height-20,font:"18px Calibri black",text:"",color:"white"});
var bossBar = new Bar({x:canvas.width/2,y:-40,width:400,height:30,backColor:"grey",color:"red",maxVal:maxHp*10,stroke:"black",lineWidth:2})
var bossIcon = new Obj({x:180,y:-40,width:50,height:50,color:"red"});
bossIcon.setImgData({width:280,height:280});
var hurtOverlay = new Obj({x:-10000,y:canvas.height/2,width:canvas.width,height:canvas.height,color:"rgba(255,0,0,0.1)"});

//Title stuff
var titleScrn = new Obj({x:canvas.width/2,y:canvas.height/2,width:canvas.width,height:canvas.height});
titleScrn.img.src = "images/spritesheet.png"; //change to separate img
titleScrn.setImgData({width:2,height:2});
var titleBtn = new Obj({x:100,y:canvas.height-60,width:110,height:50,color:"lightgrey",stroke:"black",lineWidth:2});
var titleTxt = new Text({x:titleBtn.x,y:titleBtn.y+10,font:"32px Calibri black",text:"Start"});

//Transition Stuff
var curtain = new Obj({x:-canvas.width*2,y:canvas.height/2,width:canvas.width+200,height:canvas.height*2,angle:20,color:"rgb(44,44,44)"});

//Gamestate Initilizers - runs on changeScreen()
gamestateInits = {
    "title":function(){
        onClick = function(){
            if(mouseInsideObj(titleBtn)){
                setTimeout(function(){changeState("tutorial")},1000);
                changeState("transition1");
            }
        };
    },
    "tutorial":function(){
        onClick = function(){};
        onTitle = false;
        //Centering on map (resetting player/cam)
            for(var mc=0; mc<levelObjs.length; mc++){
                levelObjs[mc].x += offset.x;
                levelObjs[mc].y += offset.y;
            }
            offset = {x:0,y:0};
            //Centering on screen
            player.x = canvas.width/2;
            player.y = canvas.height/2;
            setCameraTarget(cam);
            camAim.x = canvas.width/2;
            camAim.y = canvas.height/2;
        //Setting up level objs
        levelObjs = [world,cam];
        player.p.health = maxHp;
        gemsCollected = 0;
        score.text = "0";
        //Setting Camera Borders
        camBorders = [
            new Obj({x:-20,y:canvas.height/2,height:10000,width:canvas.width}),
            new Obj({x:canvas.width/2,y:-20,height:canvas.height,width:10000}),
            new Obj({x:canvas.width/2,y:canvas.height+20,height:canvas.height,width:10000}),
            new Obj({x:20+canvas.width*4,y:canvas.height/2,height:10000,width:canvas.width}),
        ];
        pushArray(camBorders,levelObjs);
        //Setting Player Borders
        borders = [
            new Obj({x:canvas.width/2,height:100,width:10000,color:"grey"}), //remove these eventually!!!!! (no grey)
            new Obj({x:canvas.width/2,y:canvas.height,height:100,width:10000,color:"grey"}),
            new Obj({y:canvas.height/2,height:10000,width:100,color:"grey"}),
        ];
        for(var t=1; t<5; t++){ //Door-way Walls
            var _x = canvas.width*t;
            borders.push(new Obj({x:_x,y:123,height:154,width:100,color:"grey"}));
            borders[borders.length-1].setImgData({y:280,width:100,height:150});
            borders.push(new Obj({x:_x,y:canvas.height-123,height:154,width:100,color:"grey",angle:180}));
            borders[borders.length-1].setImgData({y:280,width:100,height:150});
        }
        pushArray(borders,levelObjs);
        gui = [hpIcon,bossIcon,gemIcon];
        //Levers
        lever1.set({x:canvas.width+640,y:canvas.height-150});
        lever2.set({x:canvas.width*3+630,y:canvas.height/2});
        //Doors
        door1.set({x:canvas.width*2,y:canvas.height/2});
        door2.set({x:canvas.width*4,y:canvas.height/2});
        //Gems
        gems = [
            new Obj({x:canvas.width-10,y:canvas.height/2,width:30,height:30,color:"red"}),
            new Obj({x:100,y:canvas.height-100,width:30,height:30,color:"red"}),
            new Obj({x:canvas.width*2-200,y:100,width:30,height:30,color:"red"}),
        ];
        setImgData(gems,{x:1415,width:40,height:40});
        //Rocks
        rocks = [
            new Obj({x:canvas.width+635,y:canvas.height-167,width:20,height:20,friction:0.95,color:"darkGrey"}),
            new Obj({x:canvas.width*3+200,y:167,width:20,height:20,friction:0.95,color:"darkGrey"}),
        ];
        setImgData(rocks,{x:1845,width:20,height:20});
        //Goops
        goop = [
            new Obj({x:canvas.width*2.5,y:canvas.height/2,width:200,height:canvas.height,color:"cyan"}),
            new Obj({x:canvas.width*3+630,y:canvas.height/2,width:150,height:150,color:"cyan"}),
        ];
        goop[0].setImgData({x:1455,width:goop[0].width,height:goop[0].height});
        goop[1].setImgData({x:1655,width:goop[1].width,height:goop[1].height});
        pushArray(doors,levelObjs);
        pushArray(gems,levelObjs);
        pushArray(levers,levelObjs);
        pushArray(rocks,levelObjs);
        levelObjs.push(player);
        pushArray(goop,levelObjs);
    },
    "transition1":function(){
        curtain.x = -canvas.width*2;
        gui = [hpIcon,bossIcon,gemIcon];
        prevGemAmount = gemsCollected;
    },
    "boss":function(){
        //Centering on map (resetting player/cam)
            for(var mc=0; mc<levelObjs.length; mc++){
                levelObjs[mc].x += offset.x;
                levelObjs[mc].y += offset.y;
            }
            offset = {x:0,y:0};
            //Centering on screen
            player.x = 0;
            player.y = canvas.height/2;
            setCameraTarget(cam);
            camAim.x = canvas.width/2;
            camAim.y = canvas.height/2;
        //Setting up level objs
        world.set({x:canvas.width/2,y:-canvas.height*3/2-150,width:canvas.height*5.5+40,height:canvas.width+40,angle:-90});
        door1.set({x:canvas.width/2,y:-canvas.height-220,width:canvas.width-100,height:100});
        door2.set({x:canvas.width/2,y:-2200,width:canvas.width-100,height:100});
        world.setImgData({y:1240,width:3640,height:840});
        setImgData(doors,{x:915,width:500,height:100});
        boss.set({x:canvas.width/2,y:-canvas.height,p:{health:maxHp*10}});
        bossBar.value = maxHp*10;
        bossBar.y = -40;
        bossIcon.y = -40;
        phase = 0;
        player.p.health = maxHp;
        if(musicPlaying&&document.getElementById("game-music").currentTime<156){
            document.getElementById("game-music").currentTime = 180;
        }
        //set world img!!!!!!
        levelObjs = [world,hitzone,boss,player,cam];
        pushArray(doors,levelObjs);
        //Setting Camera Borders
        camBorders = [
            new Obj({x:-20,y:canvas.height,height:10000,width:canvas.width}),
            new Obj({x:canvas.width+20,y:canvas.height,height:10000,width:canvas.width}),
            new Obj({x:canvas.width/2,y:-canvas.height*4.5-20,height:canvas.height,width:10000}),
            new Obj({x:canvas.width/2,y:canvas.height+20,height:canvas.height,width:10000}),
        ];
        pushArray(camBorders,levelObjs);
        //Setting Player Borders
        borders = [
            new Obj({x:canvas.width,y:-canvas.height,height:10000,width:100,color:"grey"}),
            new Obj({x:canvas.width/2,y:canvas.height,height:100,width:10000,color:"grey"}),
            new Obj({x:canvas.width/2,y:-canvas.height*4.5,height:100,width:10000,color:"grey"}),
            new Obj({y:125,height:150,width:100,color:"grey"}),
            new Obj({y:canvas.height-125,height:150,width:100,color:"grey"}),
            new Obj({y:-canvas.height*4,height:canvas.height*8.2,width:100,color:"grey"}),
            new Obj({x:-70,y:canvas.height/2,height:500,width:100,color:"grey"})
        ];
        pushArray(borders,levelObjs);
        //Gems
        gems = [];
        for(var gm=0; gm<6; gm++){
            if(gm!=5){
                gems.push(new Obj({x:gm*100+200,y:-2350,width:30,height:30,color:"red"}));
                gems.push(new Obj({x:gm*100+200,y:-2550,width:30,height:30,color:"red"}));
            }
            gems.push(new Obj({x:gm*100+150,y:-2450,width:30,height:30,color:"red"}));
        }
        setImgData(gems,{x:1415,width:40,height:40});
        pushArray(gems,levelObjs);
        //Rocks
        rocks = [
            new Obj({x:495,y:94,width:20,height:20,friction:0.95,color:"darkGrey"}),
            new Obj({x:105,y:-canvas.height-360,width:20,height:20,friction:0.95,color:"darkGrey"}),
        ];
        setImgData(rocks,{x:1845,width:20,height:20});
        pushArray(rocks,levelObjs);
        gui = [hpIcon,bossIcon,gemIcon];
        goop = [];
    }
};

changeState("title");

gamestates = {
    "title":function(){
        //Doing stuff

        //Drawing
        titleScrn.drawImage();
        titleBtn.draw();
        titleTxt.draw();

    },
    "tutorial":function(){
        //Music Starting
        if(musicReady&&!musicPlaying){
            musicPlaying = true;
            console.log("playing music");
            document.getElementById("game-music").currentTime = 0;
            document.getElementById("game-music").volume = 0.4;
            document.getElementById("game-music").play();
        }
        //Music Looping
        if(musicPlaying){
            if(document.getElementById("game-music").currentTime>156){
                document.getElementById("game-music").currentTime = 37;
                console.log("loop");
            }
        }

        //Curtain
        follow(curtain,{x:canvas.width*2,y:curtain.y},0.1);
        curtain.move();

        //Doing stuff
        player.doState();
        cam.doState();
        hurtOverlay.x = -10000;
        if(player.x>canvas.width){setTimeout(function(){changeState("boss")},1000); changeState("transition1");}
            //Player hits lever
            for(var ps=0; ps<2; ps++){
                if(player.currentState=="spin"&&player.hits(levers[ps])){
                    doors[ps].vy -= doors[ps].ay; 
                    levers[ps].angle+=10;
                    if(soundTimer2<=0){
                        document.getElementById("click").volume = 0.1;
                        document.getElementById("click").play();
                        document.getElementById("click").currentTime = 0;
                        soundTimer2 = 10;
                    }
                    soundTimer2++;
                }
            }
            //Player hits a gem
        for(var ps=0; ps<gems.length; ps++){
            if(player.hits(gems[ps])){gems[ps].y=-1000; gemsCollected++; score.text=gemsCollected;}
        }
            //Player hits a rock
        for(var ps=0; ps<rocks.length; ps++){
            if(player.currentState=="spin"&&player.hits(rocks[ps])){
                var _ang = getAngle(player.x-rocks[ps].x,player.y-rocks[ps].y);
                rocks[ps].set({vx:getPoint([-10,_ang],"x"),vy:getPoint([-10,_ang],"y")});
            }
            rocks[ps].move();
            for(var pk=0; pk<borders.length; pk++){rocks[ps].collides(borders[pk]);}
            for(var pk=0; pk<doors.length; pk++){rocks[ps].collides(doors[pk]);}
        }
            //Player hits a goop
        if(player.hits(goop[0])||getMag(player.x-goop[1].x,player.y-goop[1].y)<=goop[1].width/2+player.width/2){playerHurt();}
            //Player die!
        playerDie();

        //Secret rocks
        for(var ph=0; ph<2; ph++){
            if(rocks[ph].hits(goop[ph])){
                for(var ps=0; ps<5; ps++){
                    gems.push(new Obj({x:rocks[ph].x,y:ps*60+170,width:30,height:30,color:"red"}));
                    levelObjs.push(gems[gems.length-1]);
                    gems[gems.length-1].setImgData({x:1415,width:40,height:40});
                }
                rocks[ph].x = -10000;
            }
        }

        //Help Text
        if(getMag(player.x-lever1.x,player.y-lever1.y)<200){
            helpText.text = "Press [Space] to spin attack";
        }else if(offset.x<200){
            helpText.text = "Use WASD / Arrow Keys to Move";
        }else if(goop[0].x-player.x<300&&player.x<goop[0].x+50){
            helpText.text = "Be quick! It'll drain your health!";
        }else{
            helpText.text = "";
        }

        //Moving
        door1.move();
        door2.move();
        player.move();
        moveCamera();
        
        //Player Wall Collision
        for(var ps=0; ps<borders.length; ps++){player.collides(borders[ps]);}
        for(var ps=0; ps<doors.length; ps++){player.collides(doors[ps]);}
        
        //Drawing
        levelDraw();
        
    },
    "transition1":function(){
        //Curtain
        follow(curtain,{x:canvas.width/2,y:curtain.y},0.1);
        curtain.move();

        //Title Drawing
        if(onTitle){
            titleScrn.drawImage();
            titleBtn.draw();
            titleTxt.draw();
        }
        //Level Drawing
        draw(levelObjs);
        drawImg(levelObjs);
        //Ui drawing
        if(!onTitle){
            hpBar.draw();
            bossBar.draw();
            drawImg(gui);
            score.draw();
            curtain.draw();
        }else{curtain.draw();}
    },
    "boss":function(){
        //Music Looping
        if(musicPlaying){
            if(document.getElementById("game-music").currentTime>216){
                document.getElementById("game-music").currentTime = 189;
                console.log("loop");
            }
        }

        //Curtain
        follow(curtain,{x:canvas.width*2,y:curtain.y},0.1);
        curtain.move();

        //Doing Stuff
        player.doState();
        cam.doState();
        hurtOverlay.x = -10000;
        if(offset.y<-500){ //Changing to boss cam
            if(phase==0){
                bossBar.y = 40;
                bossIcon.y = 40;
                helpText.text = "Attack inside the Boss!";
            }
            if(phase!=3){
                if(borders[1].y>canvas.height+50){
                    borders[1].y-=5;
                }
                setCameraTarget({x:boss.x,y:boss.y+150});
            }
            bossBar.value = boss.p.health;
            bossTimer--;
        }

            //Player hits a gem
        for(var ps=0; ps<gems.length; ps++){
            if(player.hits(gems[ps])){gems[ps].x=-1000; gemsCollected++; score.text=gemsCollected;}
        }
            //Player hits a rock
        for(var ps=0; ps<rocks.length; ps++){
            if(player.currentState=="spin"&&player.hits(rocks[ps])){
                var _ang = getAngle(player.x-rocks[ps].x,player.y-rocks[ps].y);
                rocks[ps].set({vx:getPoint([-10,_ang],"x"),vy:getPoint([-10,_ang],"y")});
            }
            rocks[ps].move();
            for(var pk=0; pk<borders.length; pk++){rocks[ps].collides(borders[pk]);}
            for(var pk=0; pk<doors.length; pk++){rocks[ps].collides(doors[pk]);}
            //Rock hits boss
            if(Math.abs(getMag(rocks[ps].x-boss.x,rocks[ps].y-boss.y))<boss.height/2){
                boss.p.health-=250;
                rocks[ps].x=-1000;
            }
        }
        

        //boss stuff
        phases[phase]();
        boss.imgData.x=0;

        //Touching and Hitting Boss
        if(Math.abs(getMag(player.x-boss.x,player.y-boss.y))<boss.height/2){
            playerHurt();
            if(player.currentState=="spin"){
                boss.p.health--;
                if(player.p.health<maxHp/2){boss.p.health--;}
                helpText.text="";
                if(phase==0){phase = 1;}
                boss.setImgData({x:560});
            }
        }
        //Player hit goop
        for(var ps=0; ps<goop.length; ps++){if(player.hits(goop[ps])){playerHurt();}}

        //Player die!
        playerDie();

        //Moving
        player.move();
        moveCamera();
        //Moving da goops
        for(var ps=0; ps<goop.length; ps++){
            goop[ps].move();
            if(goop[ps].y>=canvas.height+goop[ps].height/2){
                levelObjs.splice(levelObjs.indexOf(goop[ps]),1);
                goop.splice(ps,1);
            }
        }

        //Player Wall Collision
        for(var ps=0; ps<borders.length; ps++){player.collides(borders[ps]);}
        for(var ps=0; ps<doors.length; ps++){player.collides(doors[ps]);}

        //Drawing
        levelDraw();
    }
}

//FUNCTIONS
function levelDraw(){
    drawImg(levelObjs);
    hitzone.draw();
    draw(particles);
    helpText.draw();
    hpBar.draw();
    bossBar.draw();
    drawImg(gui);
    score.draw();
    hurtOverlay.draw();
    curtain.draw();
}

function playerHurt(){
    player.p.health--;
    player.vx*=0.9;
    player.vy*=0.9;
    hurtOverlay.x = canvas.width/2;
    if(soundTimer<=0){
        document.getElementById("splash").volume = 0.1;
        document.getElementById("splash").play();
        document.getElementById("splash").currentTime = 0;
        soundTimer = 10;
    }
    soundTimer++;
}

function playerDie(){
    var _scrn = currentState;
    if(player.p.health<=0){
        setTimeout(function(){changeState(_scrn)},1000);
        gemsCollected = prevGemAmount;
        changeState("transition1");
    }
}

function confetti(){
    for(var cf=0; cf<100; cf++){
        var _col = "rgb("+randInt(0,255)+","+randInt(0,255)+","+randInt(0,255)+")";
        var _shape = (randNum(0,100)<50)?("rect"):("circle");
        particles.push(new Obj({x:boss.x,y:boss.y,width:7,height:7,color:_col,vx:randNum(-5,5),vy:randNum(-5,5),shape:_shape}));
    }
    pushArray(particles,levelObjs);
}

//BOSS PHASES
var phases = [
    function(){},
    function(){
        //phase 1
        var _dir = (percent(50))?(1):(-1)
        var _rand = randNum(0,100);
        if(bossTimer<=0){
            //Spawning goop attacks!
            if(_rand<33){
                var _hole = randInt(0,2);
                for(var ph=0; ph<3; ph++){
                    if(ph!=_hole){
                        goop.push(new Obj({x:ph*canvas.width/3+canvas.width/6,y:-canvas.height/3,width:canvas.width/3+50,height:canvas.height*(2/3),color:"cyan",vy:3}));
                        goop[goop.length-1].setImgData({x:1455,width:200,height:600});
                        levelObjs.push(goop[goop.length-1]);
                    }
                }
            }else if(_rand<67){
                var _hole = randInt(0,13);
                for(var ph=0; ph<14; ph++){
                    if(ph!=_hole&&ph!=_hole+1){
                        var _add = (_dir==-1)?(canvas.width-75):(75);
                        goop.push(new Obj({x:(ph*50*_dir+_add),y:(-ph*40)-40,width:50,height:200,color:"cyan",vy:4}));
                        goop[goop.length-1].setImgData({x:1455,width:200,height:600});
                        levelObjs.push(goop[goop.length-1]);
                    }
                }
            }else{
                for(var ph=0; ph<6; ph++){
                    _dir = (ph<3)?(ph):(ph-3);
                    var _y = (_dir==1)?(-200):(0);
                    if(ph<3){_y-=400;}
                    goop.push(new Obj({x:_dir*canvas.width/3+(canvas.width/6),y:_y-50,width:canvas.width/3,height:100,color:"cyan",vy:3}));
                    goop[goop.length-1].setImgData({x:100,y:280,width:600,height:200});
                    levelObjs.push(goop[goop.length-1]);
                }
            }
            bossTimer = 300;
        }
        if(boss.p.health<=maxHp*5){phase=2; bossTimer=360;}
    },
    function(){
        if(offset.y>-2100){
            boss.y--;
            hitzone.y--;
            for(var ph=0; ph<goop.length; ph++){
                goop[ph].y--;
            }
            door1.x-=3;
        }
        //phase 2
        var _dir = (percent(50))?(1):(-1)
        var _rand = randNum(0,100);
        if(bossTimer<=0){
            //Spawning goop attacks!
            if(_rand<33){
                //Vertical half scrn
                goop.push(new Obj({x:_dir*canvas.width/4+canvas.width/2,y:-canvas.height*5,width:canvas.width/2,height:canvas.height*2,color:"cyan",vy:12}));
                goop[goop.length-1].setImgData({x:1455,width:200,height:600});
                levelObjs.push(goop[goop.length-1]);
                hitzone.set({x:_dir*canvas.width/4+canvas.width/2,y:canvas.height/2,width:canvas.width/2,height:canvas.height,ax:_dir*canvas.width/4+canvas.width/2});
            }else if(_rand<67){
                //horizontal half scrn
                goop.push(new Obj({x:-canvas.width*5,y:_dir*canvas.height/4+canvas.height/2,width:canvas.width*2,height:canvas.height/2,color:"cyan",vx:12}));
                goop[goop.length-1].setImgData({x:100,y:280,width:600,height:200});
                levelObjs.push(goop[goop.length-1]);
                hitzone.set({x:canvas.width/2,y:_dir*canvas.height/4+canvas.height/2,width:canvas.width,height:canvas.height/2,ax:canvas.width/2});
            }else{
                //big center blast!
                goop.push(new Obj({x:canvas.width/2,y:-canvas.height*6.5,width:canvas.width*(2/3),height:canvas.height*3,color:"cyan",vy:14}));
                goop[goop.length-1].setImgData({x:1455,width:200,height:600});
                levelObjs.push(goop[goop.length-1]);
                hitzone.set({x:canvas.width/2,y:canvas.height/2,width:canvas.width*(2/3),height:canvas.height,ax:canvas.width/2});
            }
            bossTimer = 360;
        }
        //Flashing Attack Indication
        if(bossTimer%20==0){
            hitzone.x = hitzone.ax;
            if(bossTimer%60==0){
                hitzone.x = -1000;
            }
        }
        //Mini goops
        if(bossTimer%90==0){
            goop.push(new Obj({x:randNum(40,canvas.width-40),y:-100,width:80,height:100,color:"cyan",vy:4}));
            levelObjs.push(goop[goop.length-1]);
            goop[goop.length-1].setImgData({x:1455,width:200,height:600});
        }
        //When boss die
        if(boss.p.health<=0){
            confetti();
            phase=3;
            setCameraTarget(cam);
            boss.x=-1000;
            borders[1].y=canvas.height-offset.y;
            bossBar.y = -1000;
            bossIcon.y = -1000;
            hitzone.x = -1000;
            for(var ph=0; ph<goop.length; ph++){
                levelObjs.splice(levelObjs.indexOf(goop[ph]),1);
            }
            goop = [];
            helpText.text = "You Win!!!";
            document.getElementById("win").volume = 0.6;
            document.getElementById("win").play();
            if(musicPlaying){document.getElementById("game-music").pause();}
        }
    },
    function(){
        //Player wins!
        door2.x-=3;
        move(particles);
    }
];