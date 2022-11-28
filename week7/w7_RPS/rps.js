//Code copied from personal project started during this class, edited to fit assignment better and added stuff

//Listeners
document.addEventListener("click",onClick);
document.addEventListener("keypress",start);

//VARIABLES - V A R I A B L E S
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var timer = requestAnimationFrame(main);

//


//Screens
var currentScrn = "title";
var text = ["","","","",""];
var textS = [];
var seqBool = [];
var buttons = [];
var bars = [];

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

var player = new Battler(100,3,8,"neutral",0,1,2,3,100);
var statPoints = 10;

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
        console.log("");
    }
}

function Battler(hp,df,at,ty,m1,m2,m3,m4,maxHp){
    this.hp = hp;
    this.maxHp = maxHp;
    this.df = df;
    this.at = at;
    this.type = ty;

    this.moves = [-1,-1,-1,-1];
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
function start(e){
    if(e.which==32){
        changeScrn("main");
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
function changeScrn(scrn){
    //for all scrn changes
    for(i=0;i<3;i++){seqBool[i]=false;}
    for(i=0;i<text.length;i++){text[i]="";}
    for(i=0;i<buttons.length;i++){buttons[i] = new Button(-10,-10,1,1,"red","red",debugB,debugB,"0");}
    for(i=0;i<bars.length;i++){bars[i] = new Bar(-10,-10,10,10,"red","red","red",1,1);}
    typeCounter=0;
    currentScrn = scrn;

    //Screen Set-ups ----- Screen Set-ups ----- Screen Set-ups -----
    if(scrn=="title"){typewriter("Rock Paper Scissors: Part 2!",10,text[0]);}
    else if(scrn=="main"){
        bars[0] = new Bar(400,400,200,40,"grey","black","green","100",player.hp);
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
function moves(num){
    if(num==0){
        
    }
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

    if(currentScrn=="title"&&e.which==1){console.log("noooo press space")}
    else if(currentScrn=="main"&&e.which==1){
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
        textS = ["Rock Paper Scissors: Part 2!","Matthew Satterfield","Press space to start!"];
        drawText(0,canvas.width/2,canvas.height/3,"black","32px Arial","center",true,true,2,1,10);
        if(seqBool[0]){
            drawText(2,canvas.width/2,canvas.height/3+30,"blue","20px Arial","center",true,false);
        }
        drawText(1,canvas.width-10,canvas.height-10,"black","12px Arial","right",false,false);
    }
    if(currentScrn=="main"){
        bars[0].draw();
    }

    if(typeActive){
        if(typeDelay>0){typeDelay--;}
        else{typeCounter++; typewriter(typeSText,typeSDelay,typeString); typeDelay = typeSDelay;}
    }
    timer = requestAnimationFrame(main);
}
changeScrn("title");