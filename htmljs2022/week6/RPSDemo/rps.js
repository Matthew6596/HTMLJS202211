var c = document.getElementById("c");
var ctx = c.getContext("2d");
//var timer = requestAnimationFrame(main)

var rockImg = new Image(); //Rock
rockImg.src = "images/dwayneDaRock.webp";
var paperImg = new Image(); //Paper
paperImg.src = "images/PaperMario.webp";
var scissorsImg = new Image(); //Scissors
scissorsImg.src = "images/DerekScissors.jpg";

ctx.font = "40px Arial";
ctx.fillStyle = "blue";
ctx.strokeStyle = "green";
ctx.fillText("Welcome to the RPS Game!", 140, 280);
ctx.strokeText("Welcome to the RPS Game!", 140, 280);

//alert("Select rock, paper, or scissors!");
var rps = ["rock","paper","scissors"];
//console.log(rps[0]);

document.getElementById("rock").addEventListener('click',function(e){playGame(rps[0]);})
document.getElementById("paper").addEventListener('click',function(e){playGame(rps[1])});
document.getElementById("scissors").addEventListener('click',function(e){playGame(rps[2])});

function lost(){ctx.fillText("You Lost!",320,450); ctx.strokeText("You Lost!",320,450);}
function win(){ctx.fillText("You Win!",320,450); ctx.strokeText("You Win!",320,450);}

function playGame(playerChoice){
    ctx.clearRect(0,0,c.width,c.height);
    var rigged = (Math.floor(Math.random()*2.9999999)==1); //33% chance for cpu to be rigged
    var cpuChoice = 0;
    //player rps image
    if(playerChoice=="rock"){ctx.drawImage(rockImg,0,0,c.width/2,c.height-200); ctx.fillText("You chose rock...",45,520); ctx.strokeText("You chose rock...",45,520);}
    if(playerChoice=="paper"){ctx.drawImage(paperImg,0,0,c.width/2,c.height-200); ctx.fillText("You chose paper...",30,520); ctx.strokeText("You chose paper...",30,520);}
    if(playerChoice=="scissors"){ctx.drawImage(scissorsImg,0,0,c.width/2,c.height-200); ctx.fillText("You chose scissors...",10,520); ctx.strokeText("You chose scissors...",10,520);}

    if(!rigged){cpuChoice = Math.floor(Math.random()*2.9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999);}
    console.log(rps[cpuChoice], playerChoice);
    if(rigged){//Change cpuChoice if rigged
        switch(playerChoice){
            case "rock":
                cpuChoice = 1;
            break;
            case "paper":
                cpuChoice = 2;
            break;
            case "scissors":
                cpuChoice = 0;
            break;
        }
    }
    //cpu rps image
    if(cpuChoice==0){ctx.drawImage(rockImg,c.width/2,0,c.width/2,c.height-200); ctx.fillText("CPU chose rock...",45+c.width/2,520); ctx.strokeText("CPU chose rock...",45+c.width/2,520);}
    if(cpuChoice==1){ctx.drawImage(paperImg,c.width/2,0,c.width/2,c.height-200); ctx.fillText("CPU chose paper...",30+c.width/2,520); ctx.strokeText("CPU chose paper...",30+c.width/2,520);}
    if(cpuChoice==2){ctx.drawImage(scissorsImg,c.width/2,0,c.width/2,c.height-200); ctx.fillText("CPU chose scissors...",10+c.width/2,520); ctx.strokeText("CPU chose scissors...",10+c.width/2,520);}

    //Results Text Display

    if(rps[cpuChoice]==playerChoice && !rigged){ctx.fillText("You Tied!",320,450); ctx.strokeText("You Tied!",320,450);}//tied
    if(!rigged){
        switch(playerChoice){ //normal outputs
            case "rock":
                if(cpuChoice==1){lost();}
                else if(cpuChoice==2){win();}
            break;
            case "paper":
                if(cpuChoice==0){win();}
                else if(cpuChoice==2){lost();}
            break;
            case "scissors":
                if(cpuChoice==0){lost();}
                else if(cpuChoice==1){win();}
            break;
        }
    }else{lost();}
}
/*function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //code

    timer = requestAnimationFrame(main);
}*/