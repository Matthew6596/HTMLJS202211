//Listeners
document.addEventListener("click",onClick);
document.addEventListener("keypress",keyPress);

//VARIABLES - V A R I A B L E S
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);
var bMusic = document.getElementById("bMusic");

bMusic.volume = 0.3;

//Screens
var currentScrn = "title";
var text = ["","","","",""];
var textS = [];
var seqBool = [];
var buttons = [];
var bars = [];
var barBool = [];
var gameOver = false;
var pUsed = "";
var eUsed = "";

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
var txtDly = 3;
var textBoxText = "Welcome to Rock Paper Scissors: Part 2!...Press Space to continue...";

var mousex = 0;
var mousey = 0;

var player = new Battler(100,3,8,"neutral",0,1,2,3,100);
var opponent = new Battler(1,1,1,"neutral",-1,-1,-1,-1,1)
var statPoints = 0;

//OBJECTS - O B J E C T S

function Bar(x,y,w,h,bFill,stroke,mFill,ival,maxVal){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.backgroundFill = bFill;
    this.stroke = stroke;
    this.mainFill = mFill;
    this.value = ival;
    this.maxVal = maxVal;

    this.draw = function(){
        ctx.strokeStyle = this.stroke;
        ctx.fillStyle = this.backgroundFill;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.fillStyle = this.mainFill;
        ctx.fillRect(this.x,this.y,((this.width/this.maxVal)*this.value),this.height);
        ctx.strokeRect(this.x,this.y,this.width,this.height);
    }
    this.change = function(){
        barBool = true;
    }
}

function Battler(hp,df,at,ty,m1,m2,m3,m4,maxHp){
    this.hp = hp;
    this.maxHp = maxHp;
    this.df = df;
    this.at = at;
    this.type = ty;

    this.moves = [m1,m2,m3,m4];
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
function keyPress(e){
    if(e.which==32&&currentScrn=="title"){bMusic.play();}
    if(e.which==32&&(currentScrn=="title"||gameOver)){
        changeScrn("main");
    }
    else if(e.which==32&&currentScrn=="main"){
        if(typeActive){typeActive=false;typeCounter=0;text[0]=textS[0]}
        else if(statPoints==0){
            typeCounter=0;
            statPoints=10;
            textS[0] = "Choose either Rock, Paper, or Scissors!";
            text[0] = "";
            typewriter(textS[0],txtDly,text[0]);
        }else if(!btnConditions("35")){
            gameOver = true;
            var result = "won!";
            if(player.hp<=0){result="lost!";}
            typeCounter=0;
            textS[0] = "You "+result+"...Press Space to restart.";
            text[0] = "";
            typewriter(textS[0],txtDly,text[0]);
        }
    }
}
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
function barChange(num,changeTo){
    if(barBool[num]){
        if(bars[num].value!=changeTo&&bars[num].value>changeTo){bars[num].value--;}
        else if(bars[num].value!=changeTo&&bars[num].value<changeTo){bars[num].value++;}
        else{barBool[num]=false;}
    }
}
function changeScrn(scrn){
    //for all scrn changes
    for(i=0;i<3;i++){seqBool[i]=false;}
    for(i=0;i<text.length;i++){text[i]="";}
    for(i=0;i<buttons.length;i++){buttons[i] = new Button(-10,-10,1,1,"red","red",debugB,debugB,"0");}
    for(i=0;i<bars.length;i++){bars[i] = new Bar(-10,-10,10,10,"red","red","red",1,1);}
    for(i=0;i<barBool.length;i++){barBool[i]=false;}
    typeCounter=0;
    currentScrn = scrn;

    //Screen Set-ups ----- Screen Set-ups ----- Screen Set-ups -----
    if(currentScrn=="title"){typewriter("Rock Paper Scissors: Part 2!",10,text[0]);}
    else if(currentScrn=="main"){
        gameOver = false;
        textS = [textBoxText,"Rock","Paper","Scissors","Volume","Text Speed","+","-"];
        var ohp = randNum(120,80);
        var oat = randNum(10,6);
        var odf = randNum(5,1);
        player.hp = player.maxHp;
        opponent = new Battler(ohp,odf,oat,"neutral",-1,-1,-1,-1,ohp)
        bars[0] = new Bar(350,460,300,30,"grey","black","green",100,player.maxHp);
        bars[1] = new Bar(350,30,300,30,"grey","black","red",opponent.hp,opponent.maxHp);
        buttons[0] = new Button(280, (canvas.height-180),100,40,"lightblue","black",function(){moves(player.moves[0],opponent)},debugB,"0356");
        buttons[1] = new Button((canvas.width/2)-50, (canvas.height-180),100,40,"lightblue","black",function(){moves(player.moves[1],opponent)},debugB,"0356");
        buttons[2] = new Button(canvas.width-380, (canvas.height-180),100,40,"lightblue","black",function(){moves(player.moves[2],opponent)},debugB,"0356");
        buttons[3] = new Button(20,20,20,20,"lightgreen","grey",function(){bMusic.volume+=0.05},debugB,"8");
        buttons[4] = new Button(20,40,20,20,"lightgreen","grey",function(){bMusic.volume-=0.05},debugB,"9");
        buttons[5] = new Button(20,80,20,20,"lightgreen","grey",function(){txtDly-=2},debugB,"7");
        buttons[6] = new Button(20,100,20,20,"lightgreen","grey",function(){txtDly+=2},debugB,"-");
        typewriter(textS[0],txtDly,text[0]);
        statPoints = 0;
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
    }if(nums.includes("5")){
        if(opponent.hp==0){returnBool=false;}
    }if(nums.includes("6")){
        if(typeActive){returnBool=false;}
    }if(nums.includes("7")){
        if(txtDly<=1){returnBool=false;}
    }if(nums.includes("8")){
        if(bMusic.volume==1){returnBool=false;}
    }if(nums.includes("9")){
        if(bMusic.volume==0){returnBool=false;}
    }if(nums.includes("-")){
        if(txtDly>=31){returnBool=false;}
    }
    return returnBool;
}
function moves(num,other){
    var eMove = randNum(2,0)
    var pModifier = 0;
    var pDmg = 0;
    var eDmg = 0;
    var eff = 2.5;
    var ine = 0.75;
    pUsed = "";
    eUsed = "";
    if(eMove==0){eUsed="rock";}
    if(eMove==1){eUsed="paper";}
    if(eMove==2){eUsed="scissors";}
    if(num==0){//rock
        if(eMove==0){pModifier=1;}//r
        if(eMove==1){pModifier=ine;}//p
        if(eMove==2){pModifier=eff;}//s
        pUsed = "rock";
    }if(num==1){//paper
        if(eMove==0){pModifier=eff;}//r
        if(eMove==1){pModifier=1;}//p
        if(eMove==2){pModifier=ine;}//s
        pUsed = "paper";
    }if(num==2){//scissors
        if(eMove==0){pModifier=ine;}//r
        if(eMove==1){pModifier=eff;}//p
        if(eMove==2){pModifier=1;}//s
        pUsed = "scissors";
    }
    pDmg = Math.round((player.at*pModifier)-other.df);
    eDmg = Math.round((other.at*(1/pModifier))-player.df);
    if(pDmg<=0){pDmg=1;}
    if(eDmg<=0){eDmg=1;}
    other.hp -= pDmg;
    player.hp -= eDmg;
    if(player.hp<0){player.hp=0;}
    if(other.hp<0){other.hp=0;}
    barBool[0] = true;
    barBool[1] = true;
    typeCounter = 0;
    textS[0] = "You used "+pUsed+" and dealt "+pDmg+" damage!"+"...Opponent used "+eUsed+" and dealt "+eDmg+" damage!";
    text[0] = "";
    typewriter(textS[0],txtDly,text[0]);
}
function randNum(high, low){
    return Math.round((Math.random()*(high-low))+low);
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
function drawImage(img,x,y){
    ctx.strokeStyle = "black";
    if(img=="rock"){ctx.drawImage(rImg,x,y);}
    if(img=="paper"){ctx.drawImage(pImg,x,y);}
    if(img=="scissors"){ctx.drawImage(sImg,x,y);}
    if(img!=""){ctx.strokeRect(x,y,50,50);}
}
function musicLoop(){
    if(bMusic.currentTime>=23.22){bMusic.currentTime=0;}
}
function onClick(e){
    var rect = canvas.getBoundingClientRect();
    mousex = Math.round(e.clientX - rect.left)
    mousey = Math.round(e.clientY - rect.top)

    if(currentScrn=="title"&&e.which==1){console.log("noooo press space")}
    else if(currentScrn=="main"&&e.which==1){
        buttonClicked(mousex,mousey);
    }
}
function drawText(index,x,y,fill,font,align,type,next,nInd,bNum,nSpd){
    if(fill=="bbox"){
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = "24px Calibri";
        ctx.textAlign = "left";
        ctx.fillRect(40, canvas.height-120, canvas.width-80, 100);
        ctx.strokeRect(42, canvas.height-118, canvas.width-84, 96);
        ctx.fillStyle = "white";
        if(typeActive&&typeSText==textS[index]){text[index] = typeString;}
        ctx.fillText(text[index],52,canvas.height-92,canvas.width-102);
    }else{
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
        textS = ["Rock Paper Scissors: Part 2!","Matthew Satterfield","Press space to start!"];
        drawText(0,canvas.width/2,canvas.height/3,"black","32px Arial","center",true,true,2,1,10);
        if(seqBool[0]){
            drawText(2,canvas.width/2,canvas.height/3+30,"blue","20px Arial","center",true,false);
        }
        drawText(1,canvas.width-10,canvas.height-10,"black","12px Arial","right",false,false);
    }
    if(currentScrn=="main"){
        bars[0].draw();
        bars[1].draw();
        drawText(0,0,0,"bbox");
        drawBtns();
        drawText(1,buttons[0].x+(buttons[0].width/2),buttons[0].y+(buttons[0].height/1.6),"black","18px Arial","center",false,false);
        drawText(2,buttons[1].x+(buttons[1].width/2),buttons[1].y+(buttons[1].height/1.6),"black","18px Arial","center",false,false);
        drawText(3,buttons[2].x+(buttons[2].width/2),buttons[2].y+(buttons[2].height/1.6),"black","18px Arial","center",false,false);
        drawText(6,buttons[3].x+(buttons[3].width/2),buttons[3].y+(buttons[3].height/1.3),"black","18px Arial","center",false,false);
        drawText(6,buttons[5].x+(buttons[5].width/2),buttons[5].y+(buttons[5].height/1.3),"black","18px Arial","center",false,false);
        drawText(7,buttons[4].x+(buttons[4].width/2),buttons[4].y+(buttons[4].height/1.6),"black","18px Arial","center",false,false);
        drawText(7,buttons[6].x+(buttons[6].width/2),buttons[6].y+(buttons[6].height/1.6),"black","18px Arial","center",false,false);
        drawText(4,50,45,"black","18px Arial","left",false,false);
        drawText(5,50,105,"black","18px Arial","left",false,false);
        for(i=0;i<buttons.length;i++){btnGrey(i);}
        barChange(0,player.hp);
        barChange(1,opponent.hp);
        drawImage(pUsed,(canvas.width/2)-25,(canvas.height/2)-25);
        drawImage(eUsed,(canvas.width/2)-25,(canvas.height/2)-200);
        musicLoop();
    }

    if(typeActive){
        if(typeDelay>0){typeDelay--;}
        else{typeCounter++; typewriter(typeSText,typeSDelay,typeString); typeDelay = typeSDelay;}
    }
    timer = requestAnimationFrame(main);
}
changeScrn("title");