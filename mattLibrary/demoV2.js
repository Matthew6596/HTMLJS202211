//Creating a player
var player = new Obj(["shape-render","movement","state-manager","collision","old-collider"],{x:200,y:200,width:40,height:40,color:"lime",currentState:"default",friction:0.8});
//Creating a Wall
var wall = new Obj(["shape-render","collision"],{x:0,y:canvas.height/2,height:300,width:100,color:"grey"});

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
    }
};

//Creating some text and a small background
var testTxt = new Text([],{x:canvas.width/2,y:canvas.height/2,text:"Test Text!"});
var bg = new Obj(["image-render"],{width:500,height:500,x:canvas.width/2,y:canvas.height/2});
//Setting the background's image
bg.img.src = "../miniJam-Fusion/images/spritesheet.png";
bg.setImgData({y:126,width:1000,height:1000});

//Set camera to follow player
setCameraTarget(player);

//Creating a button
var testBtn = new Btn([],{x:canvas.width-90,y:50,stroke:"black",lineWidth:2,width:120,height:60,
pressed:function(){ //When the button is pressed/clicked...
    //Swap camera between the player and background objects
    setCameraTarget((camTarget==player)?(bg):(player));
}});
//Changing the text within the button
testBtn.textObj.text = "Cam Btn";

//Objects in this array will be drawn
drawObjs = [bg,testTxt,wall,player,testBtn];

//These objects will be affected by the camera (push anything that's not UI)
pushArray([bg,testTxt,wall,player],worldObjs);

//While in the "default" state the following code will be executed once every frame
gamestates = {
    "default":function(){
        //Runs the player state (player state created above)
        player.doState();
        //Allows button functionality
        testBtn.doState();
        //Allows camera movement
        moveCamera();

        //playSound("testAudio");
    }
}

