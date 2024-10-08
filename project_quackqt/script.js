//Main text
var mainTxt = new Paragraph([],{text:"The Rebecca Compliment Generator 2000!               I love you Pumpkin!",x:canvas.width/2,y:canvas.height*3/2-35,font:"28px Calibri",maxCharPerLine:24,spacing:32,color:"#340d40"});
//Main button
var mainBtn = new Btn([],{x:canvas.width/2,y:canvas.height/2+120+canvas.height,width:280,height:80,
stroke:"#340d40",lineWidth:2,colors:{default:"#d69dec",hover:"#bc66db",down:"#81309c",pressed:"#f1ddf8"},
pressed:function(){
    mainTxt.text = getRandElement(sentenceStructures)();
    readIndex = numRead();
    complimentsRead.push(mainTxt.text);
    readTxt.text = "Total compliments read: "+numRead();
}});
mainBtn.set({text:"Generate Becca Compliment!",font:"bold 18px Arial"});
mainBtn.textObj.color = "#340d40";

//View all compliments stuff ---
//prev btn
var prevBtn = new Btn([],{x:canvas.width/2-80,y:2*canvas.height-30,width:120,height:40
,stroke:"#340d40",lineWidth:2,colors:{default:"#d69dec",hover:"#bc66db",down:"#81309c",pressed:"#f1ddf8"},
pressed:function(){
    readIndex--;
    mainTxt.text = complimentsRead[readIndex];
},condition:function(){return (clicked&&mouseInsideObj(this)&&readIndex>0);}
});
prevBtn.set({text:"< Previous",font:"18px Arial"});
prevBtn.textObj.color = "#340d40";
//next btn
var nextBtn = new Btn([],{x:canvas.width/2+80,y:2*canvas.height-30,width:120,height:40
,stroke:"#340d40",lineWidth:2,colors:{default:"#d69dec",hover:"#bc66db",down:"#81309c",pressed:"#f1ddf8"},
pressed:function(){
    readIndex++;
    mainTxt.text = complimentsRead[readIndex];
},condition:function(){return (clicked&&mouseInsideObj(this)&&readIndex<numRead()-1);}
});
nextBtn.set({text:"Next >",font:"18px Arial"});
nextBtn.textObj.color = "#340d40";
//total num read txt
var readTxt = new Text([],{x:canvas.width/2,y:canvas.height+10,text:"Total compliments read: 0",font:"14px Arial",color:"#340d40"});

//Static decor
canvas.style.background = "#e6c2f3";
var bg = new Obj(["image-render"],{x:canvas.width/2,y:canvas.height/2,width:canvas.width,height:canvas.height,priority:-2});
bg.img.src = "images/quackqt_bg.png";
bg.setImgData({width:canvas.width,height:canvas.height});
var fg = new Obj(["image-render"],{x:canvas.width/2,y:canvas.height/2,width:canvas.width,height:canvas.height,priority:2});
fg.img.src = "images/quackqt_fg.png";
fg.setImgData({width:canvas.width,height:canvas.height});
var tImgOutline = new Obj(["shape-render"],{x:canvas.width/2,y:canvas.height/2-170,width:230,height:230,priority:3,lineWidth:2,stroke:"#84329e",color:"rgba(0,0,0,0)"});
var titleImg = new Obj(["image-render"],{x:canvas.width/2,y:canvas.height/2-170,width:230,height:230,priority:2});
titleImg.img.src = "images/beccaLoveTitle.png";
titleImg.setImgData({width:512,height:512});

//Intro anim
var cam = new Obj([],{x:canvas.width/2,y:canvas.height/2-40+canvas.height});
setCameraTarget(cam);

//Draw objs
drawObjs = [mainTxt,mainBtn,titleImg,tImgOutline,prevBtn,nextBtn,readTxt];
pushArray([mainTxt,mainBtn,cam,prevBtn,nextBtn,readTxt],worldObjs);

//Compliments read
var complimentsRead = [];
var readIndex = -1;
function numRead(){return complimentsRead.length;}

//Gamestates
gamestates = {
    "default":[function(){},
    function(){
        mainTxt.updateLines();
        mainBtn.doState();
        moveCamera();
    }]
};

//Sentence structures
const sentenceStructures = [
    function(){return ("I "+getRandElement(ferb)+" your "+getRandElement(adjs)+" "+getRandElement(thingsILikeAboutRebecca)[0]+"!");},
    function(){return ("I "+getRandElement(ferb)+" you!");},
    function(){return ("You are so "+getRandElement(adjs)+"!");},
    function(){let _t=getRandElement(thingsILikeAboutRebecca); return ("Your "+getRandElement(adjs)+" "+_t[0]+" "+_t[1]+" so "+getRandElement(adjs)+"!");},
    function(){return (getRandElement(customCompliments))},
];

//<3
const thingsILikeAboutRebecca = [
    ["sense of humor","is"],
    ["hair","is"],
    ["cuteness","is"],
    ["smell","is"],
    ["beauty","is"],
    ["voice","is"],
    ["kind heart","is"],
    ["fashion sense","is"],
    ["brown glasses","are"],
    ["overalls","are"],
    ["lips","are"],
    ["brown eyes","are"],
    ["warm hugs","are"],
    ["soft cheeks","are"],
    ["body","is"],
    ["face","is"],
    ["personality","is"],
    ["rubber ducky collection","is"],
    ["smile","is"],
    ["interests","are"],
    ["bucket hat","is"],
];
//<3
const ferb = [
    "like",
    "love",
    "want to hug",
    "want to kiss",
    "abosolutely adore",
    "will never get old of",
    "find so much attraction in",
    "am obsessed with",
    "am enchanted by",
    "can't stop thinking about",
    "want be surrounded by",
    "want to marry",
    "am so grateful for",
    "have the biggest crush on",
];
//<3
const adjs = [
    "kissable",
    "lovely",
    "beautiful",
    "sweet",
    "kind",
    "adorable",
    "cute",
    "amazing",
    "stunning",
    "stellar",
    "enchanting",
    "blissful",
    "huggable",
    "benevolent",
    "endearing",
    "charming",
    "enriching",
    "spectacular",
];
//<3 <3 <3
const customCompliments = [
    "I love you!",
    "I am so glad to have you in my life!",
    "I can't wait to marry you!",
    "Your smile means everything to me!",
    "I love spending time with you!",
    "Words cannot describe how absolutely adorable you are!",
    "I think about you all of the time!",
    "Seeing you happy is the greatest thing in the world!",
    "Nobody is perfect, but you get really close!",
    ";)",
    "❤️",
    "I have such strong feelings for you!",
    "Wow!",
    "I love your voice so much, it's adorable!",
    "I love holding your hand!",
    "I love hugging you so much!",
    "I love kissing you so much!",
    "I love you pumpkin ;)",
    "You mean so much to me!",
    "I believe in you!",
];