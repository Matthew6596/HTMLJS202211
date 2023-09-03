//Creating a player
var player = new Obj(["shape-render","movement","state-manager","collision","collision-points","collider"],{x:300,y:200,width:40,height:40,color:"lime",currentState:"default",friction:0.8});

//Creating the player states
player.states = {
    "default":function(){
        //Basic top-down movement
        if(getKey("keyA")){player.vx-=1;}
        if(getKey("keyD")){player.vx+=1;}
        if(getKey("keyS")){player.vy+=1;}
        if(getKey("keyW")){player.vy-=1;}
        player.move();
        player.collides(wall);
        borders.forEach(element => {
            player.collides(element);
        });
    }
};

//Creating a Wall
var wall = new Obj(["shape-render","collision"],{x:0,y:canvas.height/2,height:300,width:100,color:"grey"});

//Creating some text and a small background
var testTxt = new Text([],{x:canvas.width/2,y:canvas.height/2,text:"[P] - Plant animation   [F] - State transition",priority:1});
var bg = new Obj(["image-render","collision"],{width:500,height:500,x:canvas.width/2,y:canvas.height/2,priority:-1});
//Setting the background's image
bg.img.src = "../miniJam-Fusion/images/spritesheet.png";
bg.setImgData({y:126,width:1000,height:1000});

//Creating an animated object
var animBox = new Obj(["image-render","animation"],{width:100,height:100,priority:1,
    animData:{
        "default":{delay:16,loops:true,frames:[{x:0,y:0,width:64,height:64},{x:64},{x:128}]},
        "stretch":{delay:4,loops:true,frames:[{x:0,y:0,width:64,height:64},{x:4,width:56},{x:8,width:48},{x:12,width:40},{x:16,width:32},{x:20,width:24},{x:24,width:16},{x:28,width:8},{x:32,width:1}]}
    }
});
animBox.img.src = "../miniJam-Fusion/images/spritesheet.png";
animBox.setImgData({width:64,height:64});

//Set camera to follow player
setCameraTarget(player);

//Creating a button
var testBtn = new Btn([],{x:canvas.width-90,y:50,stroke:"black",lineWidth:2,width:120,height:60,priority:2,
pressed:function(){ //When the button is pressed/clicked...
    //Swap camera between the player and background objects
    setCameraTarget((camTarget==player)?(bg):(player));
}});
//Changing the text within the button
testBtn.textObj.text = "Cam Btn";

//Imported Objects from level creator
importObjs = [new Paragraph([],{x:605,y:230,width:100,height:50,angle:0,tag:'importPG',priority:1,show:true,color:'#00ffe1',stroke:'rgba(0,0,0,0)',lineWidth:1,shape:'paragraph',text:'Press [E] to lock camera on to wall',align:'center',font:'24px Monospace',spacing:24,maxCharPerLine:20,}),new Obj(['shape-render',],{x:635,y:185,width:282,height:6,angle:7.125016348901798,tag:'',priority:0,show:true,color:'#3cb823',stroke:'rgba(0,0,0,0)',lineWidth:1,shape:'rect',}),];

//Objects in this array will be drawn
drawObjs = [bg,testTxt,wall,player,testBtn,animBox];
pushArray(importObjs,drawObjs);
//Objects in this array will be animated
animObjs = [animBox];
//Objects in this array will collide with camera
borders = [new Obj(["collision"],{x:canvas.width+400,width:200,height:10000,y:canvas.height/2}),
new Obj(["collision"],{x:-800,width:200,height:10000,y:canvas.height/2}),
new Obj(["collision"],{x:canvas.width/2,width:10000,height:200,y:canvas.height+400}),
new Obj(["collision"],{x:canvas.width/2,width:10000,height:200,y:-600})];

//These objects will be affected by the camera (push anything that's not UI)
pushArray([bg,testTxt,wall,player,animBox],worldObjs);
pushArray(importObjs,worldObjs);
pushArray(borders,worldObjs);

//While in the "default" state the following code will be executed once every frame
gamestates = {
    "default":[function(){player.x-=100;player.color="lime";},function(){
        myMain("scrn2");
    }],
    "scrn2":[function(){player.x+=100;player.color="purple";},function(){
        myMain("default");
    }]
};

function myMain(_scrnChange){
    //Btn to change state
    if(getKeyPress("keyF")){changeState(_scrnChange,[1000,1000],"default");}
    //Sets camera target to the wall
    if(getKeyPress("keyE")){setCamera(wall);}
    //Allows camera movement
    moveCamera();
    //Runs the player state (player state created above)
    player.doState();
    //Allows button functionality
    testBtn.doState();
    //Update paragraphs
    findTag(drawObjs,"importPG").updateLines();
    //Toggles plant animation
    if(getKeyPress("keyP")){
        animBox.setAnimState((animBox.animState=="default")?("stretch"):("default"));
    }
}

transitions = {
    "default":[
        function(){
            drawObjs.push(new Obj(["shape-render","movement"],{x:canvas.width/2,y:-canvas.height/2,width:canvas.width,height:canvas.height,priority:5,tag:"curtain"}));
        },
        function(){
            let curtain = findTag(drawObjs,"curtain");
            follow(curtain,{x:curtain.x,y:canvas.height/2},0.15);
            curtain.move();
        },
        function(){
            let curtain = findTag(drawObjs,"curtain");
            follow(curtain,{x:curtain.x,y:canvas.height*(3/2)},0.15);
            curtain.move();
            setCameraPosition(camTarget);
            player.doState();
        },
        function(){
            drawObjs.splice(drawObjs.indexOf(findTag(drawObjs,"curtain")),1);
        }
    ]
};