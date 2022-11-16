//These vars
var c = document.getElementById("c");
var ctx = c.getContext("2d");
//

//Key vars
var space = false;
//

//State vars
var gameOver = true;
var results = "Select rock, paper, scissors above.";
//

//RPS vars
var rockImg = new Image(); //Rock
rockImg.src = "images/rock.jpg";
var paperImg = new Image(); //Paper
paperImg.src = "images/paper.jpg";
var scissorsImg = new Image(); //Scissors
scissorsImg.src = "images/scissors.jpg";
var hrockImg = new Image(); //Highlighted Rock
hrockImg.src = "images/rock2.jpg";
var hpaperImg = new Image(); //HJighlighted Paper
hpaperImg.src = "images/paper2.jpg";
var hscissorsImg = new Image(); //Highlighted Scissors
hscissorsImg.src = "images/scissors2.jpg";
var rps = ["rock","paper","scissors"];
var cpuChoice = 0;
//
/*Audio vars
var bruh = new Audio();
bruh.src = "../../assignment4/music/P4.mp3";
*/

hscissorsImg.onload = function(){draw(rockImg,paperImg,scissorsImg,rockImg,paperImg,scissorsImg);} //Load

//listeners
document.addEventListener("keydown",onKeyDown);
document.addEventListener("keyup",onKeyUp);
document.addEventListener("mousemove", function(e){console.log("ok");})
//
document.getElementById("rock").addEventListener('click',function(e){playGame(rps[0]);})
document.getElementById("paper").addEventListener('click',function(e){playGame(rps[1])});
document.getElementById("scissors").addEventListener('click',function(e){playGame(rps[2])});
//

//functions
function onKeyDown(e){
    console.log(e.keyCode);
    if(e.keyCode==32){
        space = true;
        console.log("Spacebar Down");
        gameOver = false;
        draw(rockImg,paperImg,scissorsImg,rockImg,paperImg,scissorsImg);
    }
}
function onKeyUp(e){
    console.log(e.keyCode);
    if(e.keyCode==32){space = false; console.log("Spacebar Up");}
}
//
function draw(rock,paper,scissors,crock,cpaper,cscissors){
    if(gameOver){
        ctx.textAlign = "center";
        ctx.font = "40px Arial";
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "green";
        ctx.fillText("Welcome to the RPS Game!", c.width/2, 280);
        ctx.strokeText("Welcome to the RPS Game!", c.width/2, 280);
        ctx.font = "28px Arial";
        ctx.fillText("Press Space to Start", c.width/2, 320);
        ctx.strokeText("Press Space to Start", c.width/2, 320);
    }else{
        ctx.save();
        ctx.clearRect(0,0,c.width,c.height);
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "pink";
        ctx.fillText("Player Choice", c.width/2, 100); //Player Choice
        ctx.drawImage(rock, c.width/2 - 100 - rockImg.width/2, 150);
        ctx.drawImage(paper, c.width/2 - paperImg.width/2, 150);
        ctx.drawImage(scissors, c.width/2 + 100 - scissorsImg.width/2, 150);
        ctx.fillText("Computer Choice", c.width/2, 325); //CPU Choice
        ctx.drawImage(crock, c.width/2 - 100 - rockImg.width/2, 375);
        ctx.drawImage(cpaper, c.width/2 - paperImg.width/2, 375);
        ctx.drawImage(cscissors, c.width/2 + 100 - scissorsImg.width/2, 375);
        ctx.fillText(results, c.width/2, 525);//Results
        ctx.restore();
    }
}
//
function lost(){results = "CPU chose "+rps[cpuChoice]+", you lost!";}
function win(){results = "CPU chose "+rps[cpuChoice]+", you win!";}
//
function playGame(playerChoice){
    if(gameOver){return;}else{
        ctx.clearRect(0,0,c.width,c.height);
        var rigged = (Math.floor(Math.random()*2.9999999)==1); //33% chance for cpu to be rigged
        if(!rigged){cpuChoice = Math.floor(Math.random()*2.99999999999999);}
        console.log(rps[cpuChoice], playerChoice);
        if(rigged){//Change cpuChoice if rigged
            console.log("rigged");
            switch(playerChoice){
                case "rock":
                    cpuChoice = 1;
                    draw(hrockImg,paperImg,scissorsImg,rockImg,hpaperImg,scissorsImg);
                break;
                case "paper":
                    cpuChoice = 2;
                    draw(rockImg,hpaperImg,scissorsImg,rockImg,paperImg,hscissorsImg);
                break;
                case "scissors":
                    cpuChoice = 0;
                    draw(rockImg,paperImg,hscissorsImg,hrockImg,paperImg,scissorsImg);
                break;
            }
        }
        if(rps[cpuChoice]==playerChoice && !rigged){
            results = "CPU chose "+rps[cpuChoice]+", you tied!"
            if(cpuChoice == 0){draw(hrockImg,paperImg,scissorsImg,hrockImg,paperImg,scissorsImg);}
            if(cpuChoice == 1){draw(rockImg,hpaperImg,scissorsImg,rockImg,hpaperImg,scissorsImg);}
            if(cpuChoice == 2){draw(rockImg,paperImg,hscissorsImg,rockImg,paperImg,hscissorsImg);}
        }//tied
        if(!rigged){
            console.log("legit");
            switch(playerChoice){ //normal outputs
                case "rock":
                    if(cpuChoice==1){lost(); draw(hrockImg,paperImg,scissorsImg,rockImg,hpaperImg,scissorsImg);}
                    else if(cpuChoice==2){win(); draw(hrockImg,paperImg,scissorsImg,rockImg,paperImg,hscissorsImg);}
                break;
                case "paper":
                    if(cpuChoice==0){win(); draw(rockImg,hpaperImg,scissorsImg,hrockImg,paperImg,scissorsImg);}
                    else if(cpuChoice==2){lost(); draw(rockImg,hpaperImg,scissorsImg,rockImg,paperImg,hscissorsImg);}
                break;
                case "scissors":
                    if(cpuChoice==0){lost(); draw(rockImg,paperImg,hscissorsImg,hrockImg,paperImg,scissorsImg);}
                    else if(cpuChoice==1){win(); draw(rockImg,paperImg,hscissorsImg,rockImg,hpaperImg,scissorsImg);}
                break;
            }
        }else{lost();}
    }
    }
    
/*function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //code

    timer = requestAnimationFrame(main);
}*/