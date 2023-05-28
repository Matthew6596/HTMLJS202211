//Demo code using mattLibrary

//Creating the Player rectangle
var joe = new Obj({x:canvas.width/2,y:canvas.height/2,width:40,height:40,color:"blue",shape:"rect",ax:1,ay:1,friction:0.9,lineWidth:2,stroke:"black"});

var wall1 = new Obj({x:100,y:300,width:40,height:200,color:"grey",shape:"rect"});

//Creating the Instruction & End Text
var text1 = new Text({x:canvas.width/2,y:90,font:"24px monospace",text:"Press space to switch between spinning and moving!",angle:-4});
var text2 = new Text({x:40,y:canvas.height-40,font:"20px monospace",text:"Press E to end",align:"left"});

//Setting camera and levelObjs
setCameraTarget(joe);
levelObjs = [joe,wall1,text1];

//The Game-States
gamestates = {
    "default":function(){
        //If E is pressed, The End!
        if(getKeyPress("keyE")){
            //Changing text for The End
            text1.text = "The End";
            text1.angle = 0;
            text1.font = "32px monospace";
            text1.stroke = "blue";
            text1.lineWidth = 1;
            //Preparing text position and camera
            text1.x = canvas.width/2;
            text1.y = 0;
            camTarget = {x:canvas.width/2,y:canvas.height/2};
            camera.x = canvas.width/2;
            camera.y = canvas.height/2;
            levelObjs = [text1];
            //Switching gamestate to the end
            currentState = "end";
        }
        //Doing the player state
        joe.doState();

        //Wall Collision
        joe.collides(wall1);

        //Moving player
        joe.move();

        //Camera
        moveCamera(0.5);

        //Drawing player and text
        draw([joe,text1,text2,wall1]);
    },
    "end":function(){
        //Tweening text to center of screen
        follow(text1,{x:canvas.width/2,y:canvas.height/2},0.1);

        //Moving Text
        text1.move();

        //Camera
        moveCamera(0.5);

        //Drawing text
        text1.draw();
    }
};

//The Player-States
joe.states = {
    "default":function(){
        //Giving player WASD movement while in "default" state
        if(getKey("keyA")){joe.vx -= joe.ax;}
        if(getKey("keyD")){joe.vx += joe.ax;}
        if(getKey("keyW")){joe.vy -= joe.ay;}
        if(getKey("keyS")){joe.vy += joe.ay;}
        //If player presses space, change player state to spinning
        if(getKeyPress("space")){joe.currentState="spin"; camTarget = wall1;}
    },
    "spin":function(){
        //If space is pressed, return to default state
        if(getKeyPress("space")){joe.currentState="default"; camTarget = joe;}
        //spin
        joe.angle++;
    }
}