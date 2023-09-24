var mainTxt = new Paragraph([],{text:"The Rebecca Compliment Generator 2000!               I love you Pumpkin!",x:canvas.width/2,y:80+canvas.height,font:"28px Calibri",maxCharPerLine:24,spacing:32});
var mainBtn = new Btn([],{x:canvas.width/2,y:canvas.height/2+40+canvas.height,width:280,height:80,
stroke:"black",lineWidth:2,colors:{default:"#58d2d6",hover:"#429b9e",down:"#1e6b63",pressed:"#1e6b63"},
pressed:function(){
    mainTxt.text = getRandElement(sentenceStructures)();
}});
mainBtn.set({text:"Generate Becca Compliment!",font:"bold 18px Arial"});

canvas.style.background = "rgb(186, 225, 230)";
var bg = new Obj(["image-render"],{x:canvas.width/2,y:canvas.height/2,width:canvas.width,height:canvas.height,priority:-2});
bg.img.src = "images/quackqt_bg.png";
bg.setImgData({width:canvas.width,height:canvas.height});
var fg = new Obj(["image-render"],{x:canvas.width/2,y:canvas.height/2,width:canvas.width,height:canvas.height,priority:2});
fg.img.src = "images/quackqt_fg.png";
fg.setImgData({width:canvas.width,height:canvas.height});

var cam = new Obj([],{x:canvas.width/2,y:canvas.height/2-40+canvas.height});

setCameraTarget(cam);

drawObjs = [mainTxt,mainBtn,bg,fg];
pushArray([mainTxt,mainBtn,cam],worldObjs);

gamestates = {
    "default":[function(){},
    function(){
        mainTxt.updateLines();
        mainBtn.doState();
        moveCamera();
    }]
};

const sentenceStructures = [
    function(){return ("I "+getRandElement(ferb)+" your "+getRandElement(adjs)+" "+getRandElement(thingsILikeAboutRebecca)[0]+"!");},
    function(){return ("I "+getRandElement(ferb)+" you!");},
    function(){return ("You are so "+getRandElement(adjs)+"!");},
    function(){let _t=getRandElement(thingsILikeAboutRebecca); return ("Your "+getRandElement(adjs)+" "+_t[0]+" "+_t[1]+" so "+getRandElement(adjs)+"!");},
    function(){return (getRandElement(customCompliments))},
];

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
];

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
    "want to feel",
];

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
];

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
    "I love when your voice gets all soft, it's adorable!",
    "I love holding your hand!",
    "I love hugging you so much!",
];