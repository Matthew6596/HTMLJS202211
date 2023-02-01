/*----------------------------------------------
This file contains the data used to render the player's sprites
Properties:
	Object: info | information about the sprite file
		String: info.src | The location of the spritesheet
	Object: states | contains the data for each animation state
		Object: [`state name`] | The data used to render the idle state
			Number: fps | The frame rate in which to render the animation
			Boolean: cycle | Whether or not the animation will loop
			Array: frames| Contains objects with geometric data for each frame of animtati.
					Must contain at least one frame object.
					The animation will run for however many frame objects are added to the array
				Object: [index number] | A frame of animation
					Number: width | the actual 1/1 horizontal size of the portion of image file to be rendered
					Number: height | the actual 1/1 vertical size of the portion of image file to be rendered
					Number: startX | the horizontal starting point of the portion of image file to be rendered
					Nunber: startY | the vertical starting point of the portion of image file to be rendered
/*----------------------------------------------*/
var playerData ={
	info:{
		src:`images/ray.png`
	},
	states:{
		//The idle animation 
    	idle:
		{
			fps:5,
			cycle:true,
			frames:
			[
				{width:256, height:768, startX:3*256, startY:0},//stand
				{width:256, height:768, startX:0*256, startY:0},//blink
				{width:256, height:768, startX:3*256, startY:0},//stand
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},//end
				{width:256, height:768, startX:4*256, startY:0},//wind
				{width:256, height:768, startX:5*256, startY:0},
				{width:256, height:768, startX:6*256, startY:0},
				{width:256, height:768, startX:7*256, startY:0},
				{width:256, height:768, startX:6*256, startY:0},
				{width:256, height:768, startX:8*256, startY:0},
				{width:256, height:768, startX:9*256, startY:0},
				{width:256, height:768, startX:7*256, startY:0},
				{width:256, height:768, startX:10*256, startY:0},
				{width:256, height:768, startX:11*256, startY:0},
				{width:256, height:768, startX:12*256, startY:0},
				{width:256, height:768, startX:13*256, startY:0},
				{width:256, height:768, startX:14*256, startY:0},//end
				{width:256, height:768, startX:3*256, startY:0},//stand
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},//end
				{width:256, height:768, startX:0*256, startY:0},//blink
				{width:256, height:768, startX:3*256, startY:0},//stand
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},//end
				{width:256, height:768, startX:0*256, startY:0},//blink
				{width:256, height:768, startX:2*256, startY:0},//look down
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},//end
				{width:256, height:768, startX:1*256, startY:0},//blink down
				{width:256, height:768, startX:3*256, startY:0},//stand
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},//end
			]
		},
		idle2:
		{
			fps:5,
			cycle:true,
			frames:
			[
				{width:256, height:768, startX:3*256, startY:0},//stand
				{width:256, height:768, startX:0*256, startY:0},//blink
				{width:256, height:768, startX:3*256, startY:0},//stand
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},//end
				{width:256, height:768, startX:4*256, startY:768},//wind
				{width:256, height:768, startX:5*256, startY:768},
				{width:256, height:768, startX:6*256, startY:768},
				{width:256, height:768, startX:7*256, startY:768},
				{width:256, height:768, startX:6*256, startY:768},
				{width:256, height:768, startX:8*256, startY:768},
				{width:256, height:768, startX:9*256, startY:768},
				{width:256, height:768, startX:7*256, startY:768},
				{width:256, height:768, startX:10*256, startY:768},
				{width:256, height:768, startX:11*256, startY:768},
				{width:256, height:768, startX:12*256, startY:768},
				{width:256, height:768, startX:13*256, startY:768},//end
				{width:256, height:768, startX:3*256, startY:0},//stand
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},//end
				{width:256, height:768, startX:0*256, startY:0},//blink
				{width:256, height:768, startX:3*256, startY:0},//stand
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},//end
				{width:256, height:768, startX:0*256, startY:0},//blink
				{width:256, height:768, startX:2*256, startY:0},//look down
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},
				{width:256, height:768, startX:2*256, startY:0},//end
				{width:256, height:768, startX:1*256, startY:0},//blink down
				{width:256, height:768, startX:3*256, startY:0},//stand
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},
				{width:256, height:768, startX:3*256, startY:0},//end
			]
		},
		//The walwidth:128, height:128,
		walk:
		{
			fps:2,
			cycle:true,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:2*768},
                {width:256, height:768, startX:1*256, startY:2*768},
                {width:256, height:768, startX:2*256, startY:2*768},
                {width:256, height:768, startX:3*256, startY:2*768},
                {width:256, height:768, startX:4*256, startY:2*768},
                {width:256, height:768, startX:5*256, startY:2*768},
                {width:256, height:768, startX:6*256, startY:2*768},
                {width:256, height:768, startX:7*256, startY:2*768},
                {width:256, height:768, startX:8*256, startY:2*768},
                {width:256, height:768, startX:9*256, startY:2*768},
                {width:256, height:768, startX:10*256, startY:2*768},
                {width:256, height:768, startX:11*256, startY:2*768}
			]
		},
		//The jump animation 
		jump:
		{
			fps:5,
			cycle:true,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:0},
			]
		},
		jumpPeak:
		{
			fps:5,
			cycle:false,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:0},
			]
		},
		fall:
		{
			fps:5,
			cycle:true,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:0},
			]
		},
		//The crouch animation 
		crouch:
		{
			fps:1,
			cycle:false,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:768},
				{width:256, height:768, startX:1*256, startY:768},
			]
		},
		//The attack animation 
		startUp:
		{
			fps:3,
			cycle:false,
			//width:300,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:0},
			]
		},
		charging:
		{
			fps:3,
			cycle:false,
			//width:300,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:0},
			]
		},
		attack:
		{
			fps:3,
			cycle:false,
			//width:300,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:0},
			]
		},
		//Landing while still
		land:
		{
			fps:3,
			cycle:false,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:0},
			]
		},
		//Landing while walking
		walkLand:
		{
			fps:3,
			cycle:false,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:0},
			]
		},
		//Animation for the projectile
		projectile:
		{
			fps:3,
			cycle:true,
			frames:
			[
				{width:256, height:768, startX:0*256, startY:0},
			]
		}
	}
	
		
}