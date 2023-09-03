var mainTxt = new Paragraph([],{text:"The Rebecca Compliment Generator 2000!               I love you Rebecca!",x:canvas.width/2,y:80+canvas.height,font:"32px Calibri",maxCharPerLine:30});
var mainBtn = new Btn([],{x:canvas.width/2,y:canvas.height/2+40+canvas.height,width:360,height:100,
stroke:"black",lineWidth:2,colors:{default:"rgb(235, 54, 229)",hover:"rgb(49, 235, 225)",down:"rgb(50, 71, 252)",pressed:"rgb(234, 237, 66)"},
pressed:function(){
    mainTxt.text = getRandElement(sentenceStructures)();
}});
mainBtn.textObj.set({text:"Generate Becca Compliment!",font:"bold 24px Arial"});

canvas.style.background = "rgb(186, 225, 230)";

var cam = new Obj([],{x:canvas.width/2,y:canvas.height/2-40+canvas.height});

setCameraTarget(cam);

drawObjs = [mainTxt,mainBtn];
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
    function(){return ("I "+getRandElement(ferb)+" your "+getRandElement(adjs)+" "+getRandElement(thingsILikeAboutRebecca)+"!");},
    function(){return ("I "+getRandElement(ferb)+" you!");},
    function(){return ("You are so "+getRandElement(adjs)+"!");},
    function(){return ("Your "+getRandElement(adjs)+" "+getRandElement(thingsILikeAboutRebecca)+" is so "+getRandElement(adjs)+"!");},
    function(){return (getRandElement(customCompliments))},
];

const thingsILikeAboutRebecca = [
    "sense of humor",
    "hair",
    "cuteness",
    "smell",
    "beauty",
    "voice",
    "kind heart",
    "fashion sense",
    "brown glasses",
    "overalls",
    "lips",
    "brown eyes",
    "warm hugs",
    "soft cheeks",
    "body",
    "face",
    "personality",
    "rubber ducky collection",
    "smile",
    "interests",
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
];