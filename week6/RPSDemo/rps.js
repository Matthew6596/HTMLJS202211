var c = document.getElementById("c");
var ctx = c.getContext("2d");

ctx.font = "40px Arial";
ctx.fillStyle = "blue";
ctx.strokeStyle = "green";
ctx.fillText("Welcome to the RPS Game!", 140, 280);
ctx.strokeText("Welcome to the RPS Game!", 140, 280);

//alert("Select rock, paper, or scissors!");
var rps = ["rock","paper","scissors"];
//console.log(rps[0]);

document.getElementById("rock").addEventListener('click',function(e){alert("You picked "+rps[0]); playGame(rps[0])});
document.getElementById("paper").addEventListener('click',function(e){alert("You picked "+rps[1]); playGame(rps[1])});
document.getElementById("scissors").addEventListener('click',function(e){alert("You picked "+rps[2]); playGame(rps[2])});

function playGame(playerChoice){
    var rigged = (Math.floor(Math.random()*2.9999999)==1) //33% chance for cpu to be rigged
    var cpuChoice = 0
    if(!rigged){cpuChoice = Math.floor(Math.random()*2.9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999);}
    console.log(rps[cpuChoice], playerChoice);
    if(rps[cpuChoice]==playerChoice && !rigged){alert("CPU chose "+playerChoice+", you tied");} //normal outputs

    if(!rigged){
        switch(playerChoice){ //normal outputs
            case "rock":
                if(cpuChoice==1){alert("CPU chose paper, you lost!");}
                else if(cpuChoice==2){alert("CPU chose scissors, you won!");}
            break;
            case "paper":
                if(cpuChoice==0){alert("CPU chose rock, you won!");}
                else if(cpuChoice==2){alert("CPU chose scissors, you lost!");}
            break;
            case "scissors":
                if(cpuChoice==0){alert("CPU chose rock, you lost!");}
                else if(cpuChoice==1){alert("CPU chose paper, you won!");}
            break;
        }
    }
    else{
        console.log("rigged");
        switch(playerChoice){ //rigged outputs
            case "rock":
                alert("CPU chose paper, you lost!");
            break;
            case "paper":
                alert("CPU chose scissors, you lost!");
            break;
            case "scissors":
                alert("CPU chose rock, you lost!");
            break;
        }
    }
}