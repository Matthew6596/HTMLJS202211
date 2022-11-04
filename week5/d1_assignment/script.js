var canvas = document.getElementById("canvas"); //Defines variable to access properties of Canvas by ID
var ctx = canvas.getContext('2d'); //Defines the drawing context of the Canvas

//Square Start -----
ctx.fillStyle = "yellow";
ctx.strokeStyle = "black";
ctx.lineWidth = "5";

ctx.fillRect(85,302,100,100);
ctx.strokeRect(85,302,100,100);
//Square End -----

//Circle Start -----
ctx.fillStyle = "#ffff00"
ctx.strokeStyle = "red";

ctx.beginPath();
ctx.arc(385, 441, 67, 0, 2*Math.PI);
ctx.closePath();
ctx.fill()
ctx.stroke();
//Circle End -----

//Line Start -----
ctx.strokeStyle = "rgb(255,0,0)"

ctx.beginPath();
ctx.moveTo(85,682);
ctx.lineTo(278,549);
ctx.closePath();
ctx.stroke();
//Line End -----

//Pentagon Start -----
ctx.fillStyle = "#ff00ff";
ctx.strokeStyle = "#00ffff";

ctx.beginPath();
ctx.moveTo(557,308);
ctx.lineTo(667,284);
ctx.lineTo(724,380);
ctx.lineTo(650,464);
ctx.lineTo(548,420);
ctx.closePath();
ctx.fill();
ctx.stroke();
//Pentagon End -----

//Star(t) -----
ctx.fillStyle = "#ffff00";
ctx.strokeStyle = "rgb(32,32,32)";

ctx.beginPath();
ctx.moveTo(636,497);
ctx.lineTo(668,555);
ctx.lineTo(733,567);
ctx.lineTo(688,614);
ctx.lineTo(696,681);
ctx.lineTo(636,653);
ctx.lineTo(575,681);
ctx.lineTo(584,615);
ctx.lineTo(538,567);
ctx.lineTo(604,555);
ctx.closePath();
ctx.fill();
ctx.stroke();
//Star End -----