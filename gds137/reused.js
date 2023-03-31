function Obj(name="Unnamed :(",x=canvas.width/2,y=canvas.height/2,width=80,height=80,shape="rect",vx=4,vy=2){
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = this.width/2
    this.color = "green";
    this.force = 0;
    this.vx = vx;
    this.vy = vy;
    this.shape = shape;
    this.bouncy = 1;
    this.bounded = true;
    this.hit = false;

    this.draw = function(){
        switch(this.shape){
            case "circle":
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.translate(this.x,this.y);
                ctx.arc(0,0,this.radius,0,Math.PI/180,true)
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;
            case "rect":
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.translate(this.x,this.y);
                ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
                ctx.restore();
                break;
        }
        
    }

    this.move = function(){
        this.x+=this.vx;
        this.y+=this.vy;

        if(this.bounded){this.bounceIn(0,0,canvas.width,canvas.height);}
    }

    this.bounceIn = function(x1,y1,x2,y2){
        if(this.x+this.radius>x2||this.x-this.radius<x1){
            if(this.x+this.radius>x2){this.x=x2-this.radius;}
            else{this.x=x1+this.radius;}
            this.vx*=-this.bouncy;
            this.hit = true;
        }
        else if(this.y+this.height/2>y2||this.y-this.height/2<y1){
            if(this.y+this.height/2>y2){this.y=y2-this.height/2;}
            else{this.y=y1+this.height/2;}
            this.vy*=-this.bouncy;
            this.hit = true;
        }
        else{this.hit=false;}
    }
    this.bounceOut = function(x1,y1,x2,y2){
        //bruh
    }
}

function funnyFunction(){
    while(true){
        console.log("Poptartsus");
    }
}