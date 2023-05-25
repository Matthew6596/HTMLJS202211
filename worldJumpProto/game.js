var player = new Obj({x:canvas.width/2,y:canvas.height/2,width:30,height:30,shape:"rect",lineWidth:1,stroke:"black",color:"blue",ax:0.8,ay:0.8,friction:0.8});

var titleBtn = new Obj({x:canvas.width/2,y:canvas.height/2,width:100,height:60,shape:"rect",lineWidth:1,stroke:"green",color:"lime"});
var titleTxt = new Text({x:titleBtn.x,y:titleBtn.y+8,text:"Start"});

currentState = "title";

camTarget = player;
camTarget.y = canvas.height/2;
camera.x = player.x;
camera.y = player.y;
levelObjs = [player];
camBorders = {l:0,r:900,t:0,b:0};

var wall1 = new Obj({y:canvas.height/2,width:100,height:canvas.height,shape:"rect",color:"grey"});
var wall2 = new Obj({x:canvas.width,width:canvas.width*2,height:100,shape:"rect",color:"grey"});
var wall3 = new Obj({x:canvas.width,y:canvas.height,width:canvas.width*2,height:100,shape:"rect",color:"grey"});

var walls = [wall1,wall2,wall3];

for(var i=0; i<walls.length; i++){levelObjs.push(walls[i]);}

onClick = function(){
    if(mouseInsideObj(titleBtn)){
        currentState = "overworld1";
        onClick = function(){};
    }
}

gamestates = {
    "title":function(){
        titleBtn.draw();
        titleTxt.draw();
    },
    "overworld1":function(){
        player.doState();
        player.move();
        moveCamera(0.4);
        player.draw();
        for(var o=0; o<walls.length; o++){walls[o].draw();}
        console.log("offset: "+offset.x+", player: "+camTarget.x);
    }
};

player.states = {
    "default":function(){
        if(getAnyKey(["keyW","arrowup"])){player.vy -= player.ay;}
        if(getAnyKey(["keyA","arrowleft"])){player.vx -= player.ax;}
        if(getAnyKey(["keyS","arrowdown"])){player.vy += player.ay;}
        if(getAnyKey(["keyD","arrowright"])){player.vx += player.ax;}
        for(var ps=0; ps<walls.length; ps++){
            player.collides(walls[ps]);
        }
    },
};