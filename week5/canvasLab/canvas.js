var canvas = document.getElementById("canvas"); //Defines variable to access properties of Canvas by ID
var ctx = canvas.getContext('2d'); //Defines the drawing context of the Canvas

ctx.fillStyle = "rgb(0,0,255)"; //Drawing stuff
ctx.strokeStyle = "green";
ctx.lineWidth = "5";

ctx.fillRect(30,30,200,100); //Rectangle x,y,w,h
ctx.strokeRect(300,30,200,100);

ctx.beginPath(); //Line
ctx.moveTo(0,0);
ctx.lineTo(400,250);
ctx.lineTo(800,0);
ctx.stroke();

ctx.strokeStyle = "red";

ctx.beginPath();
ctx.moveTo(800,600);
ctx.lineTo(400,350);
ctx.lineTo(0,600);
ctx.stroke();

ctx.beginPath(); //Circle x,y,r,startAngle,endAngle
ctx.arc(400,300,50,0,(3*Math.PI)/2);
ctx.lineTo(400,300);
ctx.closePath();
ctx.fill();
ctx.stroke();

ctx.fillStyle = "#55ddef";
ctx.strokeStyle = "yellow";
ctx.lineWidth = "2";

ctx.beginPath(); //Random shape
ctx.moveTo(650,100);
ctx.lineTo(700,140);
ctx.lineTo(675,200);
ctx.lineTo(625,200);
ctx.lineTo(600,140);
ctx.closePath();
ctx.fill();
ctx.stroke();

var mario = new Image(); //Image variable
mario.src = "images/mario.png";

mario.onload = function(){ //Draw image when loaded
    ctx.drawImage(mario,470,200,80,80) //image,x,y,w,h
}