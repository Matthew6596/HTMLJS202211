
/*------------Use this if you want to implement States---------------*/
var gravity = 1;
var friction = {x:.85,y:.97}

var stage = new GameObject({width:canvas.width, height:canvas.height});

//Avatar
var wiz = new GameObject({y:canvas.height/2-64,width:64, height:192, spriteData:playerData}).makeSprite(playerData)
wiz.force=1

//The ground
var ground = new GameObject({width:canvas.width*10, x:canvas.width*10/2,height:64,y:canvas.height-32, color:"green"})
ground.img.src=`images/ground.png`

//A platform
var plat = new GameObject({width:256, height:64,y:canvas.height-200, color:"green"})

//A level object when it is moved other objects move with it.
var level = new GameObject({x:0,y:0});
ground.world = level;
plat.world = level;

//Cave foreground Tile Grid
var cave = new Grid(caveData, {world:level, x:1024, tileHeight:64, tileWidth:64});
//Cave background Tile Grid
var caveBack = new Grid(caveBackData, {world:level, x:1024, tileHeight:64, tileWidth:64});
//cave hitbox grid
var caveHit = new Grid(caveHitData, {world:level, x:1024, tileHeight:64, tileWidth:64});

var leftBorder = new GameObject({x:0, height:canvas.height, world:level})

//This is a group used for collisions
var g1 = new Group();
g1.color= `rgb(251,0,254)`;

//Adds items to a group
g1.add([ground,leftBorder, caveHit.grid])

//removes items from a group
//g1.remove([plat, cave.grid])

//Used to draw the rectangles
var rects = new Group();
rects.add([ground,plat])

//used to render the sprites
var sprites = new Group();
sprites.add([caveBack.grid])

var front = new Group()
front.add([cave.grid])

//list of items to be rendered in the level
var levelItems=new Group();
levelItems.add([caveBack.grid, ground, plat, cave.grid]);

//Very back background
var sky = new GameObject({width:canvas.width, height:canvas.height, color:"cyan"})
sky.img.src = `images/sky.png`

/*
 	//Not used, unless you want a 4th level of paralax
	var clouds = new GameObject({x:level.x,y:level.y})
	clouds.img.src=`images/ground.png`
*/

//repeating background
var rbg = new GameObject({x:level.x, y:level.y, width:1024, height:512})
rbg.img.src=`images/hills.png`

//middleground
var bg = new GameObject({x:level.x,y:level.y, width:canvas.width*4, height:canvas.height})
bg.img.src=`images/bgfull.png`

/*------------------vvBULLET STUFFvv----------------------*/

var bullets=[]
var canShoot=true;
var shotTimer = 0;
var shotDelay = 21;
var currentBullet = 0;

for(let i=0; i<100; i++)
{
	bullets[i] = new GameObject({width:2, height:2})
	//bullets[i].img.src="images/mrt.jpg"
	bullets[i].makeSprite(playerData)
	bullets[i].y=-10000
	bullets[i].changeState(`projectile`)
}

//console.log(bullets)

/*------------------^^BULLET STUFF^^----------------------*/

var landTimer = 6;
var attCool = -1;
var size;
var chargeTime = 0;
var chargin;

gameStates[`level1`] = function()
{
	sounds.manualLoop(`lvlMusic`,56,112);

	if(wiz.currentState==`land`||wiz.currentState==`walkLand`){landTimer--;}
	else{landTimer=6;}

	if(chargin&&!keys[` `]&&chargeTime>=20){
		wiz.changeState(`attack`);
		chargin = false;
		wiz.vy=0;
		attCool=20;
		//ADD RELEASE PROJECTILE
		bullets[currentBullet].vx = 10*wiz.dir; //direction/speed
		bullets[currentBullet].setHitBox({width:size,height:size}); //direction/speed

		currentBullet++;
	}
	if(wiz.currentState==`attack`){
		attCool--;
	}

	if(!keys[`W`] && !keys[`S`] && !keys[`D`] && !keys[`A`] && !keys[` `] && canShoot && wiz.canJump && attCool<0 && wiz.currentState!=`charging`)
	{
		if((wiz.currentState==`fall`|| wiz.currentState==`land`)&&landTimer>0&&wiz.vy==0){
			wiz.changeState(`land`);
		}else{
			if(wiz.dir==-1){
				wiz.changeState(`idle`);
			}else{
				wiz.changeState(`idle2`);
			}
		}
	}
	
	
	if(keys[`S`]&& !chargin && attCool<0 && wiz.canJump)
	{
		wiz.top={x:0,y:0};
		wiz.changeState(`crouch`)
	}
	else
	{
		wiz.top={x:0,y:-wiz.hitBoxHeight/2};
	}

	if(keys[`D`] && !chargin && attCool<0)
	{
		wiz.dir=1;
		if(wiz.currentState != `crouch`) 
		{
			if((wiz.currentState==`fall`|| wiz.currentState==`walkLand`)&&wiz.canJump&&landTimer>0&&wiz.vy==0){
				wiz.changeState(`walkLand`);
			}else{
				wiz.changeState(`walk`);
			}
			wiz.vx += wiz.force
			
		}
		
	}
	if(keys[`A`]&& !chargin && attCool<0)
	{
		wiz.dir=-1;
		if(wiz.currentState != `crouch` ) 
		{
			if((wiz.currentState==`fall`|| wiz.currentState==`walkLand`)&&wiz.canJump&&landTimer>0&&wiz.vy==0){
				wiz.changeState(`walkLand`);
			}else{
				wiz.changeState(`walk`);
			}
			wiz.vx += -wiz.force;
		}
		
	}
	if(keys[`W`] && wiz.canJump &&!chargin && attCool<0)
	{
		wiz.canJump = false;
		wiz.vy = wiz.jumpHeight;
		//sounds.play(`splode`,1)
	}
	if(((wiz.vy>0&&wiz.canJump && attCool<0) || wiz.vy>10)&& !chargin){wiz.changeState(`fall`);}
	if(!wiz.canJump&& !chargin && attCool<0){
		if(Math.abs(wiz.vy)<10){
			wiz.changeState(`jumpPeak`);
		}
		else if(wiz.vy<0){
			wiz.changeState(`jump`);
		}
	}
	shotTimer--;
	if(shotTimer <=0)
	{
		canShoot=true
	}
	else
	{
		canShoot=false;
	}

	if(keys[` `]||(chargeTime<20&&chargin))
	{
		if(canShoot && !chargin && attCool<0)
		{
			wiz.changeState(`startUp`);
			chargin = true;
			wiz.vy=0;
			wiz.vx=0;
			shotTimer = shotDelay;
			size = 2;
			chargeTime = 0;
			//console.log(`Boom`)

			//INSTANTIATE PROJECTILE

			bullets[currentBullet].vx = 0; //direction/speed
			bullets[currentBullet].vy = 0;
			bullets[currentBullet].world = level; //need
			bullets[currentBullet].x = wiz.x-level.x + (wiz.dir * 32) ; //player xpos
			bullets[currentBullet].y = wiz.y + 5; //player ypos
			bullets[currentBullet].dir = wiz.dir; //direction
			
			//sounds.play(`splode`,1)

			
			if(currentBullet>=bullets.length)
			{
				currentBullet=0
			}

		}
		if(chargin){
			//ADD PROJECTILE CHARGE
			bullets[currentBullet].vy = 0;
			bullets[currentBullet].y = wiz.y + 5; //player ypos
			if(size<80){
				bullets[currentBullet].width ++;
				bullets[currentBullet].height ++;
				size++;
			}
			chargeTime++;
			if(chargeTime>=20){
				wiz.changeState(`charging`)
			}
		}
	}
	else
	{
		shotTimer=0
	}
	
	//-----Player movement-----///
	wiz.vy+= gravity
	wiz.vx *= friction.x
	wiz.vy *= friction.y
	wiz.x += Math.round(wiz.vx)
	if(chargin){gravity=0.02;}
	else if(attCool>=0){gravity=0.4;}
	else{gravity=1;}
	wiz.y += Math.round(wiz.vy);

	let offset = {x:Math.round(wiz.vx), y:Math.round(wiz.vy)}
	
	while (plat.overlap(wiz.bottom) && wiz.vy>=0)
	{
		wiz.vy=0;
		wiz.canJump = true;
		wiz.y--;
		offset.y--;
	}

	/*---------Player Collision---------*/
	/*if(wiz.overlap(plat,`bottom`,`x`))
	{
		wiz.vy=-10;
	}*/

	while(g1.collide(wiz.bottom) && wiz.vy>=0)
	{
		wiz.canJump = true;
			wiz.vy=0;
			wiz.y--;
			offset.y--;
	}
	while(g1.collide(wiz.top) && wiz.vy<=0 )
	{
			wiz.vy=0;
			wiz.y++;
			offset.y++;
	}
	while(g1.collide(wiz.left) && wiz.vx<=0 )
	{
		
			wiz.vx=0;
			wiz.x++;
			offset.x++;
	}
	while(g1.collide(wiz.right) && wiz.vx>=0 )
	{
		
			wiz.vx=0;
			wiz.x--;
			offset.x--;
	}
	
	

	//Makes the level move
	wiz.x -= offset.x;
	level.x -= offset.x;

	//moves repeating background
	rbg.x = level.x*.5;

	//moves the middleground
	bg.x = level.x*.75;

	//moves the clouds
	//clouds.x = level.x*.25;
	
	if(rbg.x < -rbg.width || rbg.x > rbg.width)
	{
		rbg.x=0; 
	}

	
	
	//Sets up pattern for the ground
	var groundPattern = context.createPattern(ground.img, `repeat`);
	//Applies pattern to ground and platform
	ground.color = groundPattern
	plat.color = groundPattern

	//Sets up pattern for the sky
	var skyPattern = context.createPattern(sky.img, `repeat`);
	//Applies pattern to sky
	sky.color = skyPattern

	//renders the sky
	sky.render()
	
	//Renders the repeating background
	rbg.drawStaticImage([0,0]);
	rbg.drawStaticImage([-rbg.width,0]);
	rbg.drawStaticImage([rbg.width,0]);

	//renders the midground
	bg.drawStaticImage([0,0]);
	
	//alternate methd for rendering the repeating background
	//rbg.render(`drawStaticImage`, [0,0])

	//renders the objects in the rect group
	rects.render(`drawRect`, [0,0,100,100])
	
	/*----Used for debugging----*/
	/*context.beginPath()
	context.moveTo(0,wiz.bottom.y)
	context.lineTo(canvas.width,wiz.bottom.y)
	context.stroke();*/

	//Renders sprites group
	sprites.play().render(`drawSprite`);

	//renders player
	wiz.play(function(){return}).drawSprite()
	
	//Moves, checks collision and renders projectiles.
	for(let i=0; i<bullets.length; i++)
	{
		//if(bullets[i].overlap(stage)) bullets[i].vy+=1;
		bullets[i].move()
		bullets[i].play(function(){return}).drawSprite()
		//bullets[i].angle+=10
		while(g1.collide(bullets[i].bottom) && bullets[i].vy>=0)
		{
			
			bullets[i].vy=0;
			bullets[i].y--;
			
		}
	}

	
	
	//Renders front of cave
	front.play().render(`drawSprite`);
	

}