var x=false;
var caveData ={
	info:{
		layout:[ //Front of cave
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
			[0,0,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[0,0,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[0,0,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[0,0,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[0,0,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[2,2,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0,x,x,x,x,x,x,x,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			
			
		],
		src:`tiles/spritesheets/cave.png`,
	},
	states:
	[		
			{ //Images in layout
				fps:5,
				cycle:false,
				frames:[
					{width:32, height:32, startX:0, startY:0} //animatable
				]
			},
			{
				fps:1,
				cycle:false,
				frames:[{width:32, height:32, startX:32*1, startY:0}]
			},
			{
				fps:1,
				cycle:false,
				frames:[{width:32, height:32, startX:32*2, startY:0}]
			},
			{
				fps:1,
				cycle:false,
				frames:[{width:32, height:32, startX:32*3, startY:0}]
			},
			{
				fps:1,
				cycle:false,
				frames:[{width:32, height:32, startX:32*4, startY:0}]
			},
		]
	}
	var caveBackData ={
		info:{
			layout:[ //Back of cave
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4],
			[4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4],
			[4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
			],
			src:`tiles/spritesheets/cave.png`,
		},
		states:caveData.states //duplicated above spritesheet
		}

		var caveHitData={
			info:{
				layout:[ //Cave hit boxes
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
					[0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[0,0,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[2,2,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,0,0],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
					
					
				],
				src:`tiles/spritesheets/cave.png`,
			},
			states:caveData.states
			
			}