/*---------------------------------
This file contains all of the code for the Main Menu
----------------------------------*/

var startButton = new GameObject({width:200});
startButton.img.src="images/mrt.jpg";
startButton.hitBoxWidth=800;
console.log(startButton.collisionPoints.right);


var menuBackground = new GameObject();
menuBackground.img.src = "images/mrt.jpg";
menuBackground.width=canvas.width;
menuBackground.height=canvas.height;

gameStates[`menu`] =function(){

	//Makes the button clickable
	if(startButton.overlap(mouse))
	{
		if(mouse.pressed)
		{
			sounds.play(`lvlMusic`,56,false,0.5);
			//Changes to the game state
			gameStates.changeState(`level1`);
		}

		//Hover Effect Graffic
		//startButton.color = `yellow`;
		startButton.img.src="images/sky.png";
	}
	else
	{
		//Default Button Graphic
		//startButton.color = `red`;
		startButton.img.src="images/mrt.jpg";
	}
	
	menuBackground.drawStaticImage();
	startButton.drawStaticImage();
}
	
	
