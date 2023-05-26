//Matthew Satterfield

//Initilizing Objects
var player = new Obj({x:canvas.width/2,y:canvas.height/2,width:30,height:30,shape:"rect",lineWidth:1,stroke:"black",color:"blue",ax:0.8,ay:0.8,friction:0.8});

var titleBtn = new Obj({x:canvas.width/2,y:canvas.height/2,width:100,height:60,shape:"rect",lineWidth:1,stroke:"green",color:"lime"});
var titleTxt = new Text({x:titleBtn.x,y:titleBtn.y+8,text:"Start"});

//Setting camera to player
setCameraTarget(player);
camTarget.y = canvas.height/2;
camera.x = player.x;
camera.y = player.y;
//Making player a moving level object
levelObjs = [player];

//Makin walls
var wall1 = new Obj({y:canvas.height/2,width:100,height:canvas.height+100,shape:"rect",color:"grey"});
var wall2 = new Obj({x:canvas.width,width:canvas.width*2,height:100,shape:"rect",color:"grey"});
var wall3 = new Obj({x:canvas.width,y:canvas.height,width:canvas.width*2,height:100,shape:"rect",color:"grey"});

//Making camera borders
var b1 = new Obj({x:245,y:canvas.height/2,width:300,height:500,color:"lightgrey"});
var b2 = new Obj({x:canvas.width,y:canvas.height/2-260,width:1800,height:500,color:"lightgrey"});
var b3 = new Obj({x:canvas.width,y:canvas.height/2+260,width:900,height:500,color:"lightgrey"});
var b4 = new Obj({x:-4600,y:canvas.height/2,width:100,height:100,color:"lightgrey"});

//Arrays for walls & borders
var walls = [wall1,wall2,wall3];
camBorders = [b1,b2,b3];

//Pushing walls to the moving level objects array (basically everything but UI)
for(var i=0; i<walls.length; i++){levelObjs.push(walls[i]);}
for(var i=0; i<camBorders.length; i++){levelObjs.push(camBorders[i]);}

//Gamestate Initilizers
gamestateInits = {
    "title": function(){
        onClick = function(){
            //If click btn, change state to overworld1
            if(mouseInsideObj(titleBtn)){
                changeState("overworld1");
            }
        }
    },
    "overworld1":function(){
        onClick = function(){};
    }
};

//Changing screen to title screen
changeState("title");

//Gamestate "main" code
gamestates = {
    "title":function(){
        //drawing title btn
        titleBtn.draw();
        titleTxt.draw();
    },
    "overworld1":function(){
        //Do the player game state
        player.doState();

        //Move player
        player.move();

        //Move camera
        moveCamera();

        //Draw player and walls
        player.draw();
        for(var o=0; o<walls.length; o++){walls[o].draw();}
    }
};

//Player states
player.states = {
    "default":function(){
        //Basic movement
        if(getAnyKey(["keyW","arrowup"])){player.vy -= player.ay;}
        if(getAnyKey(["keyA","arrowleft"])){player.vx -= player.ax;}
        if(getAnyKey(["keyS","arrowdown"])){player.vy += player.ay;}
        if(getAnyKey(["keyD","arrowright"])){player.vx += player.ax;}
        //Player collides with walls
        for(var ps=0; ps<walls.length; ps++){
            player.collides(walls[ps]);
        }
    },
};