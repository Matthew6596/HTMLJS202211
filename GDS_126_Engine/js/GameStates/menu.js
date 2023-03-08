/*---------------------------------
This file contains all of the code for the Main Menu
----------------------------------*/

/*<<<<<---------------BUTTON-DATA------------------->>>>>*/

var buttonData = {
	info:{
		src:`tiles/spritesheets/btnSpritesheet.png`
	},
	states:{
		sNorm:
		{
			fps:1,
			cycle:false,
			frames:[{width:200, height:100, startX:0*200, startY:0}]
		},
		sHover:
		{
			fps:1,
			cycle:false,
			frames:[{width:200, height:100, startX:1*200, startY:0}]
		},
		rNorm:
		{
			fps:1,
			cycle:false,
			frames:[{width:200, height:100, startX:2*200, startY:0}]
		},
		rHover:
		{
			fps:1,
			cycle:false,
			frames:[{width:200, height:100, startX:3*200, startY:0}]
		}
	}
}


/*<<<---------------MAIN-MENU----------------->>>*/

var startButton = new GameObject({width:200,y:canvas.height*(3/4)});

startButton.spriteData = buttonData;
startButton.changeState(`sNorm`);
startButton.img.src = startButton.spriteData.info.src;
startButton.counter = startButton.spriteData.states[startButton.currentState].fps;

startButton.hitBoxWidth=800;
//console.log(startButton.collisionPoints.right);

var menuBackground = new GameObject();
menuBackground.img.src = "tiles/titleScreen.png";
menuBackground.width=canvas.width;
menuBackground.height=canvas.height;

gameStates[`menu`] =function(){

	//Makes the button clickable
	if(startButton.overlap(mouse))
	{
		if(mouse.pressed)
		{
			sounds.play(`s_btn`,0,false,0.5);
			sounds.play(`lvlMusic`,56,false,0.5);
			//Changes to the game state
			gameStates.changeState(`level1`);
		}

		//Hover Effect Graffic
		//startButton.color = `yellow`;
		startButton.changeState(`sHover`);
	}
	else
	{
		//Default Button Graphic
		//startButton.color = `red`;
		startButton.changeState(`sNorm`);
	}
	
	menuBackground.drawStaticImage();
	startButton.play(function(){return}).drawSprite();
}



//--------------------GAME-OVER-STATE------------------------//



var gameOverMessage = new GameObject({width:400,height:180,y:100});
gameOverMessage.img.src="tiles/gameOverScrn.png";

var restartButton = new GameObject({width:200});

restartButton.spriteData = buttonData;
restartButton.changeState(`rNorm`);
restartButton.img.src = restartButton.spriteData.info.src;
restartButton.counter = restartButton.spriteData.states[restartButton.currentState].fps;

restartButton.hitBoxWidth=800;

gameStates[`gameOver`] = function(){

	volFadeCheck2 = true;

	gameStates[`level1`]();
	if(restartButton.overlap(mouse))
	{
		if(mouse.pressed)
		{
			sounds.play(`s_btn`,0,false,0.5);
			//Changes to the game state
			resetLvl();
			gameStates.changeState(`level1`);
		}

		//Hover Effect Graffic
		//startButton.color = `yellow`;
		restartButton.changeState(`rHover`);
	}
	else
	{
		//Default Button Graphic
		//startButton.color = `red`;
		restartButton.changeState(`rNorm`);
	}
	gameOverMessage.drawStaticImage();
	restartButton.play(function(){return}).drawSprite();
}	





//<<<----------------------LEVEL RESET---------------------->>>//





function resetLvl(){
	gravity = 1;
	friction = {x:.85,y:.97};

	stage = new GameObject({width:canvas.width, height:canvas.height});

	//Avatar
	vwiz = new GameObject({y:canvas.height/2-48, width:64, height:192, spriteData:playerData}).makeSprite(playerData);
	wiz.force=1;
	alive = true;
	enemy = new GameObject({y:canvas.height-96, x:1024, width:64, height:128, color:"orange"});
	enemy2 = new GameObject({y:canvas.height-96, x:3096, width:64, height:128, color:"orange"});
	enemy.force=0.5;
	enemy2.force=0.5;
	enemy.img.src=`characterDrafts/sprites/enemy.png`;
	enemy2.img.src=`characterDrafts/sprites/enemy.png`;

	enemies = [enemy,enemy2];

	//The ground
	ground = new GameObject({width:canvas.width*10, x:(canvas.width*10/2)-32,height:32,y:canvas.height-16, color:"green"});
	ground.img.src=`tiles/tileIMGs/ground.png`;

	//A platform
	plat = new GameObject({width:256, height:32,y:canvas.height-200, color:"green"});
	plat2 = new GameObject({width:128, height:32,y:canvas.height-200, color:"green", x:2440});
	plat3 = new GameObject({width:128, height:32,y:canvas.height-200, color:"green", x:2912});
	wall = new GameObject({width:64, height:320,y:canvas.height-192, x:2680, color:"grey"});
	wall.img.src=`tiles/tileIMGs/brickwall.png`;
	plat.img.src=`tiles/tileIMGs/platform.png`;

	//A level object when it is moved other objects move with it.
	level = new GameObject({x:0,y:0});
	ground.world = level;
	plat.world = level;
	plat2.world = level;
	plat3.world = level;
	wall.world = level;

	//Cave foreground Tile Grid
	cave = new Grid(caveData, {world:level, x:4016, tileHeight:32, tileWidth:32});
	//Cave background Tile Grid
	caveBack = new Grid(caveBackData, {world:level, x:4016, tileHeight:32, tileWidth:32});
	//cave hitbox grid
	caveHit = new Grid(caveHitData, {world:level, x:4016, tileHeight:32, tileWidth:32});

	leftBorder = new GameObject({x:-56, height:canvas.height, world:level});

	//This is a group used for collisions
	g1 = new Group();
	g1.color= `rgb(251,0,254)`;

	//Adds items to a group
	g1.add([ground,leftBorder, caveHit.grid, wall]);

	//removes items from a group
	//g1.remove([plat, cave.grid])

	//Used to draw the rectangles
	rects = new Group();
	rects.add([ground,plat,wall,plat2,plat3]);

	//used to render the sprites
	sprites = new Group();
	sprites.add([caveBack.grid]);

	front = new Group();
	front.add([cave.grid]);

	//list of items to be rendered in the level
	levelItems=new Group();
	levelItems.add([caveBack.grid, ground, plat, wall, cave.grid, plat2, plat3]);

	//Very back background
	sky = new GameObject({width:canvas.width*4, height:canvas.height, color:"cyan", x:100});
	sky.img.src = `tiles/SkyBackground.png`;

	/*
		//Not used, unless you want a 4th level of paralax
		var clouds = new GameObject({x:level.x,y:level.y})
		clouds.img.src=`images/ground.png`
	*/

	//repeating background
	rbg = new GameObject({x:level.x, y:level.y, width:1024, height:512});
	rbg.img.src=`tiles/RepeatBackground.png`;

	//middleground
	bg = new GameObject({x:level.x,y:level.y, width:canvas.width*4, height:canvas.height});
	bg.img.src=`tiles/middleground1.png`;

	/*------------------vvBULLET STUFFvv----------------------*/

	bullets=[];
	canShoot=true;
	shotTimer = 0;
	shotDelay = 21;
	currentBullet = 0;

	for(let i=0; i<5; i++)
	{
		bullets[i] = new GameObject({width:2, height:2});
		//bullets[i].img.src="images/mrt.jpg"
		bullets[i].makeSprite(playerData);
		bullets[i].y=-10000;
		bullets[i].changeState(`projectile`);
	}

	//console.log(bullets)

	/*------------------^^BULLET STUFF^^----------------------*/

	enemyMoveCount = [120,120];
	rand3 = Math.round(rand(0,1))==0;

	/*------------------------vv-Player Gamestates-vv------------------------*/
	landTimer = 6;
	attCool = -1;
	size;
	chargeTime = 0;
	chargin;
	initIdle = true;
	wasAttack = false;

    wiz.x = 512;
	wiz.y = canvas.height/2-64
	wiz.vy = 0;
	wiz.vx = 0;
	wiz.changeState(`idle`);

	console.log("level reset");
}
