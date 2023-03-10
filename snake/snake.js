var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var interval = 60;
var timer = setInterval(main,interval)

document.addEventListener("keydown",keyDown);

function keyDown(e){
    if(e.key=="w"&&!down){up=true; left=false; down=false; right=false;}
    if(e.key=="a"&&!right){left=true; up=false; right=false; down=false;}
    if(e.key=="s"&&!up){down=true; left=false; right=false; up=false;}
    if(e.key=="d"&&!left){right=true; left=false; up=false; down=false;}
}

var left = false;
var right = false;
var up = false;
var down = false;

const gridSize = 20;
const gridWidth = canvas.width/gridSize;

var player = new Snake();
var apple = new Apple();

function Snake(){
    this.length = 3; //head index 0
    this.segments = [[5,6],[4,6],[3,6]];
    this.direction = 0;
    this.alive = true;

    this.draw = function(){
        for(var i=0; i<this.length; i++){
            ctx.save();
            ctx.translate(this.segments[i][0]*gridSize,this.segments[i][1]*gridSize);
            var col = "rgb(0, "+(255-((i+1)*(160/this.length)))+", 0)"
            ctx.fillStyle = col;
            if(i==0){ctx.fillStyle = "rgb(0, 255, 0)";}
            ctx.fillRect(1,1,gridSize-3,gridSize-3);
            ctx.restore();
        }
    }

    this.move = function(){
        var head = this.segments[0];
        if((left||right||up||down)&&this.alive){
            var tempSeg = [];
            var lastSeg = this.segments[this.segments.length-1];
            if(left){tempSeg[0]=[head[0]-1,head[1]]}
            else if(right){tempSeg[0]=[head[0]+1,head[1]]}
            else if(up){tempSeg[0]=[head[0],head[1]-1]}
            else if(down){tempSeg[0]=[head[0],head[1]+1]}
            for(var i=1; i<this.length; i++){
                if(head[0]==this.segments[i][0]&&head[1]==this.segments[i][1]){this.alive=false; winCheck(); console.log("bruh");}
                tempSeg[i] = this.segments[i-1];
            }
            //console.log(tempSeg);
            this.segments = tempSeg;
        }
        if(head[0]>gridWidth-1||head[0]<0||head[1]>gridWidth-1||head[1]<0){this.alive=false; winCheck();}
        if(head[0]==apple.x&&head[1]==apple.y){
            apple = new Apple();
            this.length++;
            this.segments.push(lastSeg);
        }
    }
}

function Apple(){
    this.x = 5;
    this.y = 6;

    for(var ap=0; ap<player.length; ap++){
        while(player.segments[ap][0]==this.x&&player.segments[ap][1]==this.y&&player.alive){
            this.x = randInt(0,gridWidth-1);
            this.y = randInt(0,gridWidth-1);
        }
    }

    this.draw = function(){
        ctx.save();
        ctx.translate(this.x*gridSize,this.y*gridSize);
        ctx.fillStyle = "red";
        ctx.fillRect(1,1,gridSize-3,gridSize-3);
        ctx.restore();
    }
}

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //
    player.move();
    player.draw();
    apple.draw();

}

function randInt(lo, hi){return Math.round(Math.random()*(hi-lo)+lo)}

function winCheck(){
    var failed = false;
    for(var w=0; w<gridWidth; w++){
        for(var h=0; h<gridWidth; h++){
            for(var ap=0; ap<player.length; ap++){
                if(player.segments[ap][0]==w&&player.segments[ap][1]==h){
                    failed = true;
                    break;
                }
            }
        }
    }
    console.log(failed);
}