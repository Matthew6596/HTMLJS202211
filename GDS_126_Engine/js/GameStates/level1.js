/*
List of things to do:

=====Art=====
-Player death animation
-Game over image
-Improve cave/building*
-Environmental Hazards*
-Walkland Animation*

=====Code=====
-Platforms/level layout
-multiple enemies*
-Improve cave/building*
-Game win state*
-Environmental Hazards*

*/
/*------------Use this if you want to implement States---------------*/
var gravity = 1;
var friction = {x:.85,y:.97};

var stage = new GameObject({width:canvas.width, height:canvas.height});

//Avatar
var wiz = new GameObject({y:canvas.height/2-48,width:64, height:192, spriteData:playerData}).makeSprite(playerData);
wiz.force=1;
var alive = true;
var enemy = new GameObject({y:canvas.height-96, x:1024, width:64, height:128, color:"orange"});
enemy.force=0.5;
enemy.img.src=`characterDrafts/sprites/enemy.png`;

//The ground
var ground = new GameObject({width:canvas.width*10, x:(canvas.width*10/2)-32,height:32,y:canvas.height-16, color:"green"});
ground.img.src=`tiles/tileIMGs/ground.png`;

//A platform
var plat = new GameObject({width:256, height:32,y:canvas.height-200, color:"green"});
var plat2 = new GameObject({width:128, height:32,y:canvas.height-200, color:"green", x:2440});
var plat3 = new GameObject({width:128, height:32,y:canvas.height-200, color:"green", x:2912});
var wall = new GameObject({width:64, height:320,y:canvas.height-192, x:2680, color:"grey"});
wall.img.src=`tiles/tileIMGs/brickwall.png`;
plat.img.src=`tiles/tileIMGs/platform.png`

//A level object when it is moved other objects move with it.
var level = new GameObject({x:0,y:0});
ground.world = level;
plat.world = level;
plat2.world = level;
plat3.world = level;
wall.world = level;

//Cave foreground Tile Grid
var cave = new Grid(caveData, {world:level, x:4016, tileHeight:32, tileWidth:32});
//Cave background Tile Grid
var caveBack = new Grid(caveBackData, {world:level, x:4016, tileHeight:32, tileWidth:32});
//cave hitbox grid
var caveHit = new Grid(caveHitData, {world:level, x:4016, tileHeight:32, tileWidth:32});

var leftBorder = new GameObject({x:-56, height:canvas.height, world:level});

//This is a group used for collisions
var g1 = new Group();
g1.color= `rgb(251,0,254)`;

//Adds items to a group
g1.add([ground,leftBorder, caveHit.grid, wall]);

//removes items from a group
//g1.remove([plat, cave.grid])

//Used to draw the rectangles
var rects = new Group();
rects.add([ground,plat,wall,plat2,plat3]);

//used to render the sprites
var sprites = new Group();
sprites.add([caveBack.grid]);

var front = new Group();
front.add([cave.grid]);

//list of items to be rendered in the level
var levelItems=new Group();
levelItems.add([caveBack.grid, ground, plat, wall, cave.grid, plat2, plat3]);

//Very back background
var sky = new GameObject({width:canvas.width*4, height:canvas.height, color:"cyan", x:100});
sky.img.src = `tiles/SkyBackground.png`;

/*
 	//Not used, unless you want a 4th level of paralax
	var clouds = new GameObject({x:level.x,y:level.y})
	clouds.img.src=`images/ground.png`
*/

//repeating background
var rbg = new GameObject({x:level.x, y:level.y, width:1024, height:512});
rbg.img.src=`tiles/RepeatBackground.png`;

//middleground
var bg = new GameObject({x:level.x,y:level.y, width:canvas.width*4, height:canvas.height});
bg.img.src=`tiles/middleground1.png`;

/*------------------vvBULLET STUFFvv----------------------*/

var bullets=[];
var canShoot=true;
var shotTimer = 0;
var shotDelay = 21;
var currentBullet = 0;

for(let i=0; i<100; i++)
{
	bullets[i] = new GameObject({width:2, height:2});
	//bullets[i].img.src="images/mrt.jpg"
	bullets[i].makeSprite(playerData);
	bullets[i].y=-10000;
	bullets[i].changeState(`projectile`);
}

//console.log(bullets)

/*------------------^^BULLET STUFF^^----------------------*/

var enemyMoveCount = 120;
var rand3 = Math.round(rand(0,1))==0;

function enemyAI()
{
	var randNum1 = rand(20,100);
	var randNum2 = rand(20,140);
	
	if(enemyMoveCount>=randNum1){
		rand3 = Math.round(rand(0,1))==0;
		enemyMoveCount=-randNum2;
	}
	else if(enemyMoveCount<0){
		if(rand3){enemy.vx += -enemy.force; enemy.dir=1;}
		else{enemy.vx += enemy.force; enemy.dir=-1;}
	}
	enemyMoveCount++;
}

function gameOver(){

}

/*------------------------vv-Player Gamestates-vv------------------------*/
var landTimer = 6;
var attCool = -1;
var size;
var chargeTime = 0;
var chargin;
var initIdle = true;
var wasAttack = false;
var volFadeCheck = false;
var volFadeCheck2 = false;
var volFadeCheck3 = false;
var volFadeCheck4 = false;
var soundPlaying = [false,false,false,false];

gameStates[`level1`] = function()
{
	sounds.manualLoop(`lvlMusic`,56,112);
	if(wiz.currentState==`startUp`||wiz.currentState==`charging`){
		
		if(!soundPlaying[0]){sounds.play(`s_charge`,0,false,0.5);}
		sounds.manualLoop(`s_charge`,0,11);
		volFadeCheck3=true;
		soundPlaying[0] = true;
	}else if(volFadeCheck3){
		soundPlaying[0] = false;
		sounds.fade(`s_charge`,0.1,-0.1);
	}
	if(wiz.currentState==`walk`){
		//sounds.fade(`s_walk`,0.1,0.1);
		sounds.manualLoop(`s_walk`,0,0.2415);
	}else if(volFadeCheck4){
		soundPlaying[3] = false;
		//sounds.fade(`s_walk`,0.1,-0.1);
	}
	if(!alive){
		volFadeCheck = true;
		sounds.fade(`lvlMusic`,0.12,-0.1);
		wiz.changeState(`dead`);
	}
	else{
		sounds.fade(`gameOverMusic`,0.05,-0.02);
		if(volFadeCheck){
			sounds.fade(`lvlMusic`,0.5,0.01);
		}
		/*if(volFadeCheck2){
			sounds.fade(`gameOverMusic`,0.14,-0.01);
		}*/
		
		if(initIdle){
			wiz.canJump=true;
			wiz.changeState(`idle`);
			initIdle=false;
		}
		if(wiz.currentState==`land`||wiz.currentState==`walkLand`){landTimer--;}
		else{landTimer=3;}

		if(chargin&&!keys[` `]&&chargeTime>=20){
			var blastVol = 0.00009*Math.pow(bullets[currentBullet].width,2);
			sounds.play(`s_blast`,0,false,blastVol);
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
			wasAttack = true;
		}

		if(((!keys[`W`] && !keys[`S`] && !keys[`D`] && !keys[`A`] && !keys[` `])||(keys[`A`]&&keys[`D`])) && canShoot && wiz.canJump && attCool<0 && wiz.currentState!=`charging`)
		{
			if((wiz.currentState==`fall`|| wiz.currentState==`land`||wiz.currentState==`jumpPeak`)&&landTimer>0&&wiz.vy==0){
				wiz.changeState(`land`);
				if(!soundPlaying[2]){sounds.play(`s_jump`,0,false,0.03);}
				soundPlaying[2] = true;
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
			wiz.changeState(`crouch`);
			if(!soundPlaying[1]){sounds.play(`s_crouch`,0,false,0.4);}
			soundPlaying[1] = true;
		}
		else
		{
			soundPlaying[1] = false;
			wiz.top={x:0,y:-wiz.hitBoxHeight/2};
		}

		if(keys[`D`] && !chargin && attCool<0&&!keys[`A`])
		{
			wiz.dir=1;
			if(!keys[`S`]) 
			{
				if(wiz.canJump){
					if((wiz.currentState==`fall`|| wiz.currentState==`walkLand`||wiz.currentState==`jumpPeak`)&&landTimer>0&&wiz.vy==0){
						wiz.changeState(`walkLand`);
						//if(!soundPlaying[2]){sounds.play(`s_jump`,0,false,0.03);}
						//soundPlaying[2] = true;
					}else{
						wiz.changeState(`walk`);
						if(!soundPlaying[3]){sounds.play(`s_walk`,0,false,0.04); volFadeCheck4=true;}
						soundPlaying[3] = true;
					}
				}
				wiz.vx += wiz.force;
				
			}
			
		}
		if(keys[`A`]&& !chargin && attCool<0&&!keys[`D`])
		{
			wiz.dir=-1;
			if(!keys[`S`]) 
			{
				if(wiz.canJump){
					if((wiz.currentState==`fall`|| wiz.currentState==`walkLand`||wiz.currentState==`jumpPeak`)&&landTimer>0&&wiz.vy==0){
						wiz.changeState(`walkLand`);
						//if(!soundPlaying[2]){sounds.play(`s_jump`,0,false,0.03);}
						//soundPlaying[2] = true;
					}else{
						wiz.changeState(`walk`);
						if(!soundPlaying[3]){sounds.play(`s_walk`,0,false,0.04); volFadeCheck4=true;}
						soundPlaying[3] = true;
					}
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
		if(((wiz.vy>0&&wiz.canJump) || wiz.vy>8)&& !chargin && attCool<0 && !wasAttack){
			wiz.changeState(`fall`);
		}
		if(!wiz.canJump&& !chargin && attCool<0){
			if(Math.abs(wiz.vy)<8){
				wiz.changeState(`jumpPeak`);
			}
			else if(wiz.vy<0){
				wiz.changeState(`jump`);
				if(!soundPlaying[2]){sounds.play(`s_jump`,0,false,0.06);}
				soundPlaying[2] = true;
			}
		}
		if(wiz.currentState!=`jump`&&wiz.currentState!=`land`&&wiz.currentState!=`walkLand`){
			soundPlaying[2] = false;
		}
		shotTimer--;
		if(shotTimer <=0)
		{
			canShoot=true;
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
				bullets[currentBullet].y = wiz.y - 12; //player ypos
				bullets[currentBullet].dir = wiz.dir; //direction
				
				//sounds.play(`splode`,1)

				
				if(currentBullet>=bullets.length)
				{
					currentBullet=0;
				}

			}
			if(chargin){
				//ADD PROJECTILE CHARGE
				bullets[currentBullet].vy = 0;
				bullets[currentBullet].y = wiz.y - 12; //player ypos
				if(size<80){
					bullets[currentBullet].width ++;
					bullets[currentBullet].height ++;
					size++;
				}
				chargeTime++;
				if(chargeTime>=20){
					wiz.changeState(`charging`);
				}
			}
		}
		else
		{
			shotTimer=0;
		}
		if(wiz.currentState!=`attack`){
			wasAttack = false;
		}
	}
	//console.log(wiz.currentState);
	
	//-----Player movement-----///
	wiz.vy+= gravity;
	wiz.vy *= friction.y;
	if(chargin){gravity=0.02;}
	else if(attCool>=0){gravity=0.4;}
	else{gravity=1;}
	wiz.y += Math.round(wiz.vy);
	if(alive){
		wiz.vx *= friction.x;
		wiz.x += Math.round(wiz.vx);
	}else{
		gameOver();
	}

	let offset = {x:Math.round(wiz.vx), y:Math.round(wiz.vy)}
	
	wiz.canJump = false;

	while ((plat.overlap(wiz.bottom)||plat2.overlap(wiz.bottom)||plat3.overlap(wiz.bottom)) && wiz.vy>=0)
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


	//---Enemy Movement && Collision---//

	if(enemy.x<5600)
	{
		enemy.vy += gravity;
		enemy.vx *= friction.x;
		if(enemy.health<95){enemy.vx *= 0.8;}
		enemy.vy *= friction.y;
		enemy.x += Math.round(enemy.vx);
		enemy.y += Math.round(enemy.vy);
		enemyAI();
	}
	else{enemy.x=5600}

	while(g1.collide(enemy.bottom) && enemy.vy>=0)
	{
		enemy.canJump = true;
			enemy.vy=0;
			enemy.y--;
	}
	while(g1.collide(enemy.top) && enemy.vy<=0 )
	{
			enemy.vy=0;
			enemy.y++;
	}
	while(g1.collide(enemy.left) && enemy.vx<=0 )
	{
			
			enemy.vx=0;
			enemy.x++;
	}
	while(g1.collide(enemy.right) && enemy.vx>=0 )
	{
			
			enemy.vx=0;
			enemy.x--;
	}

	//Enemy Player Collision
	if(enemy.overlap(wiz)){
		if(alive){sounds.play(`gameOverMusic`,0,false,0.5); sounds.play(`s_crouch`,0,false,1);}
		alive=false;
		wiz.vx = 0;
		gameStates.changeState(`gameOver`);
	}
	
	

	//Makes the level move
	var atLeftEdge = false;
	var atRightEdge = false;


	atLeftEdge = level.x>0;
	atRightEdge = level.x<-4096;

	while(level.x>=2){level.x--; wiz.x--; enemy.x--;}//12
	while(level.x<=-4098){level.x++; wiz.x++; enemy.x++;}//4108

	if(!atLeftEdge&&!atRightEdge){wiz.x -= offset.x;}
	if((wiz.x<524&&wiz.x>500)){level.x -= offset.x; enemy.x-=offset.x}

	//moves repeating background
	rbg.x = level.x*.5;

	//moves the middleground
	bg.x = level.x*.75;

	sky.x = level.x*0.1;
	//moves the clouds
	//clouds.x = level.x*.25;
	
	if(rbg.x < -rbg.width || rbg.x > rbg.width)
	{
		rbg.x+=rbg.width;
	}

	//Sets up pattern for the ground
	var groundPattern = context.createPattern(ground.img, `repeat`);
	var platPattern = context.createPattern(plat.img, `repeat`);
	//Applies pattern to ground and platform
	ground.color = groundPattern;
	plat.color = platPattern;
	plat2.color = platPattern;
	plat3.color = platPattern;
	wall.color = context.createPattern(wall.img, `repeat`);

	//Sets up pattern for the sky
	var skyPattern = context.createPattern(sky.img, `repeat`);
	//Applies pattern to sky
	sky.color = skyPattern;

	//renders the sky
	sky.drawStaticImage([-1680]);
	
	//Renders the repeating background
	rbg.drawStaticImage([0,0]);
	rbg.drawStaticImage([-rbg.width,0]);
	rbg.drawStaticImage([rbg.width,0]);

	//renders the midground
	bg.drawStaticImage([-8,-32]);

	//enemy render
	enemy.drawStaticImage();
	
	//alternate methd for rendering the repeating background
	//rbg.render(`drawStaticImage`, [0,0])

	//renders the objects in the rect group
	rects.render(`drawRect`, [0,0,100,100]);
	
	/*----Used for debugging----*/
	/*context.beginPath()
	context.moveTo(0,wiz.bottom.y)
	context.lineTo(canvas.width,wiz.bottom.y)
	context.stroke();*/

	//Renders sprites group
	sprites.play().render(`drawSprite`);

	//renders player
	wiz.play(function(){return}).drawSprite();
	
	//Moves, checks collision and renders projectiles.
	for(let i=0; i<bullets.length; i++)
	{
		//if(bullets[i].overlap(stage)) bullets[i].vy+=1;
		bullets[i].move();
		bullets[i].play(function(){return}).drawSprite();
		//bullets[i].angle+=10

		if(bullets[i].overlap(enemy)){//Enemy Hit By Projectile!!!!
			sounds.play(`s_eHit`,0,false,0.05);
			enemy.health-=bullets[i].width*1.5;
			bullets[i].y=-128
		}

		while(g1.collide(bullets[i].bottom) && bullets[i].vy>=0)//Projectile hits wall
		{
			
			bullets[i].vy=0;
			bullets[i].y=-128;
			
		}
	}
	if(enemy.health<=0){enemy.x=5600;}
	//console.log(wiz.x);
	
	
	//Renders front of cave
	front.play().render(`drawSprite`);
	

}