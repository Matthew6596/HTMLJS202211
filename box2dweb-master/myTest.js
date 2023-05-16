var world;
      
      function init() {
         var   b2Vec2 = Box2D.Common.Math.b2Vec2 //need for grav

         	,	b2BodyDef = Box2D.Dynamics.b2BodyDef //need for shapes
         	,	b2Body = Box2D.Dynamics.b2Body //needed for bodyDef Type
         	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef //needed for properties
         	,	b2Fixture = Box2D.Dynamics.b2Fixture
         	,	b2World = Box2D.Dynamics.b2World //needed for world i guess?

         	,	b2MassData = Box2D.Collision.Shapes.b2MassData
         	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape //polygon shape (only collision thingy needed for class)
         	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape //circle shape <<wont need for class

         	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw //do draw thing
            ; //ah hell nah the commas are one thing but the semicolon too?!
         
         world = new b2World(
               new b2Vec2(0, 100)    //gravity (xgrav, ygrav)
            ,  true                 //allow sleep
         );

         var fixDef = new b2FixtureDef; //definitions for the fixture...
         fixDef.density = 1.0;
         fixDef.friction = 0.5;
         fixDef.restitution = 0.2; //<<<fancy word that i dont know :(
         
         var bodyDef = new b2BodyDef; //...and the body
         
         //create ground
         bodyDef.type = b2Body.b2_staticBody; //keeps static ground
         bodyDef.position.x = 20; //set position
         bodyDef.position.y = 19.5; //set position
         fixDef.shape = new b2PolygonShape; //give fixture polygon shape
         fixDef.shape.SetAsBox(20, 0.5); //set shape and size
         world.CreateBody(bodyDef).CreateFixture(fixDef); //create shape
         
         //create some objects
         bodyDef.type = b2Body.b2_dynamicBody;
         for(var i = 0; i < 10; ++i) {
            if(Math.random() > 0.5) {
               fixDef.shape = new b2PolygonShape;
               fixDef.shape.SetAsBox(
                     Math.random() + 0.1 //half width
                  ,  Math.random() + 0.1 //half height
               );
            } else {
               fixDef.shape = new b2CircleShape(
                  Math.random() + 0.1 //radius
               );
            }
            bodyDef.position.x = Math.random() * 10;
            bodyDef.position.y = Math.random() * 10;
            //world.CreateBody(bodyDef).CreateFixture(fixDef);
         }

         //the waffle
         //bodyDef.type = b2Body.b2_dynamicBody; <<< make box move and stuff
         fixDef.shape = new b2PolygonShape;
         fixDef.shape.SetAsBox(4,4);
         bodyDef.position.x = 13; //see above for this stuff
         bodyDef.position.y = 00;
         bodyDef.angle = 45.000000000000005*(Math.PI/180);
         world.CreateBody(bodyDef).CreateFixture(fixDef);
         
         //setup debug draw
         var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(document.getElementById("canvas").getContext("2d")); //set the canvas
			debugDraw.SetDrawScale(30.0); //size or somehting
			debugDraw.SetFillAlpha(1.0); //alpha
			debugDraw.SetLineThickness(1.0); //hmm idk
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit); //idk important
			world.SetDebugDraw(debugDraw); //draw
         
         window.setInterval(update, 1000 / 60); //guess :3
      }; //endInit
      
      function update() { //main
         world.Step(
               1 / 60   //frame-rate           <<bruh just do:
            ,  10       //velocity iterations    world.Step(1/60,10,10);
            ,  10       //position iterations
         );
         world.DrawDebugData();
         world.ClearForces();
      };