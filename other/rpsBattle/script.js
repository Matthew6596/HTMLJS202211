//stat distribution

//cpu gets random stats

//select 4 of multiple moves, physical, special, and status

//different types: rock, paper, scissors, and neutral

//basically pokemon
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);

//
document.addEventListener("click",onClick);

//Screens
var currentScrn = "title";
var text = ["","","","",""];
var textS = [];
var seqBool = [];
var buttons = [];

var rImg = new Image();
rImg.src = "../../week7/day2/images/rock.jpg";
var pImg = new Image();
pImg.src = "../../week7/day2/images/paper.jpg";
var sImg = new Image();
sImg.src = "../../week7/day2/images/scissors.jpg";

var typeCounter = 0;
var typeDelay = -1;
var typeActive = false;
var typeSText = "";
var typeSDelay = 0;
var typeString = "";

var mousex = 0;
var mousey = 0;

var player = new Battler(0,0,0,0,0,0,0,0);
var statPoints = 10;

//OBJECTS - O B J E C T S

function Battler(hp,df,at,ty,m1,m2,m3,m4){
    this.hp = hp;
    this.df = df;
    this.at = at;
    this.type = ty;

    this.move1 = m1;
    this.move2 = m2;
    this.move3 = m3;
    this.move4 = m4;
}

function Button(x,y,w,h,fill,stroke,action1,action2,condition){
    //properties
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.clicked1 = action1;
    this.clicked2 = action2;
    this.fill = fill;
    this.stroke = stroke;
    this.condition = btnConditions(condition);

    //methods
    this.draw = function(){
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.strokeRect(this.x,this.y,this.width,this.height);
    }
    this.cond = function(){
        this.condition = btnConditions(condition);
        return this.condition;
    }
}

//FUNCTIONS - F U N C T I O N S

//
function mouseInside(mousex, mousey, x1,x2,y1,y2){
    if(((mousex>x1)&&(mousex<x2))&&((mousey>y1)&&(mousey<y2))){return true;}
    else{return false;}
}
function buttonClicked(mx,my){
    for(i=0;i<buttons.length;i++){
        if(mouseInside(mx,my,buttons[i].x,(buttons[i].width+buttons[i].x),buttons[i].y,(buttons[i].height+buttons[i].y))&&buttons[i].cond()){
            buttons[i].clicked1();
            buttons[i].clicked2();
            console.log("button clicked: "+i);
        }
    }
}
function changeScrn(scrn){
    //for all scrn changes
    for(i=0;i<3;i++){seqBool[i]=false;}
    for(i=0;i<text.length;i++){text[i]="";}
    for(i=0;i<buttons.length;i++){buttons[i] = new Button(-10,-10,1,1,"red","red",debugB,debugB,"0");}
    typeCounter=0;
    currentScrn = scrn;

    //Screen Set-ups ----- Screen Set-ups ----- Screen Set-ups -----
    if(scrn=="title"){typewriter("Rock Paper Scissors: Battle!",10,text[0]);}
    else if(scrn=="create"){
        typewriter("Choose your stats:",5,text[0]);
        buttons[0] = new Button(200,200,40,40,"lightgrey","blue",function(){changeStat(player,"hp",1);},function(){statPoints--;},"0");
        buttons[1] = new Button(150,200,40,40,"lightgrey","blue",function(){changeStat(player,"hp",-1);},function(){statPoints++;},"3");
        buttons[2] = new Button(200,280,40,40,"lightgrey","blue",function(){changeStat(player,"at",1);},function(){statPoints--;},"0");
        buttons[3] = new Button(150,280,40,40,"lightgrey","blue",function(){changeStat(player,"at",-1);},function(){statPoints++;},"1");
        buttons[4] = new Button(200,360,40,40,"lightgrey","blue",function(){changeStat(player,"df",1);},function(){statPoints--;},"0");
        buttons[5] = new Button(150,360,40,40,"lightgrey","blue",function(){changeStat(player,"df",-1);},function(){statPoints++;},"2");
        buttons[6] = new Button(350,100,100,40,"lightgrey","blue",function(){changeStat(player,"ty","rock");},function(){buttons[6].stroke="red";buttons[7].stroke="blue";buttons[8].stroke="blue";},"");
        buttons[7] = new Button(470,100,100,40,"lightgrey","blue",function(){changeStat(player,"ty","paper");},function(){buttons[6].stroke="blue";buttons[7].stroke="red";buttons[8].stroke="blue";},"");
        buttons[8] = new Button(590,100,100,40,"lightgrey","blue",function(){changeStat(player,"ty","scissors");},function(){buttons[6].stroke="blue";buttons[7].stroke="blue";buttons[8].stroke="red";},"");
        buttons[9] = new Button(820,610,130,50,"lightgreen","green",debugB,function(){changeScrn("intro1");},"4");
    }else if(scrn=="intro1"){
        player.hp++; player.at++; player.df++;
        player.hp*=2; player.at*=2; player.df*=2;
        if(player.type=="rock"){player.hp+=30;player.at+=7;player.df+=6;}
        if(player.type=="paper"){player.hp+=60;player.at+=7;player.df+=3;}
        if(player.type=="scissors"){player.hp+=30;player.at+=14;player.df+=3;}
    }
}
function btnConditions(nums){
    var returnBool = true;
    if(nums.includes("0")){
        if(statPoints<=0){returnBool=false;}
    }if(nums.includes("1")){
        if(player.at==0){returnBool=false;}
    }if(nums.includes("2")){
        if(player.df==0){returnBool=false;}
    }if(nums.includes("3")){
        if(player.hp==0){returnBool=false;}
    }if(nums.includes("4")){
        if(player.type==0){returnBool=false;}
    }
    return returnBool;
}
function changeStat(battler,stat,amount){
    if(stat=="hp"){battler.hp+=amount;}
    else if(stat=="df"){battler.df+=amount;}
    else if(stat=="at"){battler.at+=amount;}
    else if(stat=="ty"){battler.type=amount;}
    else if(stat=="m1"){battler.move1=amount;}
    else if(stat=="m2"){battler.move2=amount;}
    else if(stat=="m3"){battler.move3=amount;}
    else if(stat=="m4"){battler.move4=amount;}
    console.log("changed stat: "+stat+" by amount: "+amount);
}
function btnGrey(btnNum){
    if(!buttons[btnNum].cond()){
        ctx.fillStyle = "rgba(160, 160, 160, 0.70)";
        ctx.fillRect(buttons[btnNum].x,buttons[btnNum].y,buttons[btnNum].width,buttons[btnNum].height);
    }
}
function debugA(){console.log("yup, it worked!");}
function debugB(){console.log("dummy btn function");}
function drawBtns(){
    for(i=0;i<buttons.length;i++){
        buttons[i].draw();
    }
}
function onClick(e){
    var rect = canvas.getBoundingClientRect();
    mousex = Math.round(e.clientX - rect.left)
    mousey = Math.round(e.clientY - rect.top)

    if(currentScrn=="title"&&e.which==1){changeScrn("create");}else if(currentScrn=="create"&&e.which==1){
        buttonClicked(mousex,mousey);
    }else if(currentScrn=="intro1"&&e.which==1){
        buttonClicked(mousex,mousey);
    }
}
function drawText(index,x,y,fill,font,align,type,next,nInd,bNum,nSpd){
    ctx.fillStyle = fill;
    ctx.font = font;
    ctx.textAlign = align;
    if(type){
        if(typeActive&&typeSText==textS[index]){text[index] = typeString;}
        ctx.fillText(text[index],x,y);
    }else{ctx.fillText(textS[index],x,y);}
    if(next&&text[index]==textS[index]){
        if(bNum==1&&!seqBool[0]){seqBool[0]=true; typeCounter=0; typewriter(textS[nInd],nSpd,text[nInd]);}
        if(bNum==2&&!seqBool[1]){seqBool[1]=true; typeCounter=0; typewriter(textS[nInd],nSpd,text[nInd]);}
        if(bNum==3&&!seqBool[2]){seqBool[2]=true; typeCounter=0; typewriter(textS[nInd],nSpd,text[nInd]);}
    }
}
function typewriter(text,delay,str){
    typeActive = true;
    typeSText = text;
    typeSDelay = delay;
    if(typeDelay == -1){typeDelay = delay}
    str = str+text.charAt(typeCounter);
    typeString = str;
    if(typeCounter==text.length){typeCounter = 0; typeDelay = -1; typeActive = false; typeString = "";}
}
function main(){ //MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN --- MAIN
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(currentScrn=="title"){
        textS = ["Rock Paper Scissors: Battle!","Matthew Satterfield","Click to Start!"];
        drawText(0,canvas.width/2,canvas.height/3,"black","32px Arial","center",true,true,2,1,10);
        if(seqBool[0]){
            drawText(2,canvas.width/2,canvas.height/3+30,"blue","20px Arial","center",true,false);
        }
        drawText(1,canvas.width-10,canvas.height-10,"black","12px Arial","right",false,false);
    }
    if(currentScrn=="create"){
        textS = ["Choose your stats:","Attack:    -         +       "+player.at,"Defense:    -         +       "+player.df,"Health:    -         +       "+player.hp,player.move1,player.move2,player.move3,player.move4,"Points Left: "+statPoints,"Type:","Rock","Paper","Scissors","Continue"];
        drawText(0,10,40,"black","20px Arial","left",true,false);
        drawBtns();
        drawText(1,89,305,"black","18px Arial","left",false,false);
        drawText(2,72,385,"black","18px Arial","left",false,false);
        drawText(3,87,225,"black","18px Arial","left",false,false);
        drawText(8,80,170,"black","18px Arial","left",false,false);
        drawText(9,520,80,"black","18px Arial","center",false,false);
        drawText(10,400,126,"black","18px Arial","center",false,false);
        drawText(11,520,126,"black","18px Arial","center",false,false);
        drawText(12,640,126,"black","18px Arial","center",false,false);
        drawText(13,885,642,"black","20px Arial","center",false,false);
        btnGrey(9);
        if(player.type=="rock"){ctx.drawImage(rImg,495,180);}
        if(player.type=="paper"){ctx.drawImage(pImg,495,180);}
        if(player.type=="scissors"){ctx.drawImage(sImg,495,180);}
    }
    if(currentScrn=="intro1"){
        textS = ["ok"];
        drawText(0,400,400,"green","32px Arial","center",false,false);
        drawBtns();
    }

    if(typeActive){
        if(typeDelay>0){typeDelay--;}
        else{typeCounter++; typewriter(typeSText,typeSDelay,typeString); typeDelay = typeSDelay;}
    }
    timer = requestAnimationFrame(main);
}
changeScrn("title");