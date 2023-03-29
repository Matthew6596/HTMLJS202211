/*--------------UTILITY-FUNCTIONS--------------*/

function randNum(low, high){return Math.random()*(high-low)+low;}
function randInt(lo, hi){return Math.round(randNum(lo, hi))}
function percent(chance){return (randNum(0,100)<=chance)}
function chordEquals(cho){return (cho[0]==chord[0]&&cho[1]==chord[1]);}

//

/*--------------VARIABLE-DEFINITIONS--------------*/

var bpm = 120;
var timeSignature = [4,4];
var keySignature = "c";

var harmonicRhythm = 1;
var phrase = 2;
var period = 4;
var bars = 16;

var notes = ["c","db","d","eb","e","f","gb","g","ab","a","bb","b"];
var scaleDegrees = [];
var qualities = [
    "maj","min","dim","aug",
    "3rds","5ths",
    "maj7","dom7","min7","halfDim7","fullDim7",
    "maj9", "min9", "sus4"
];
var chord = [1,"maj"];

//

/*--------------OBJECT-DEFINITIONS--------------*/

//

/*--------------FUNCTIONS--------------*/

function getChrdTones(qual){
    switch(qual){
        case "maj": return [0,4,7];
    }
}

//

/*--------------CHORD-SELECTION--------------*/

function selectChord(){
    var ch = -1; //Highest ch val thus far: 17

    if(chordEquals([1,"maj"])||chordEquals([1,"3rds"])){ch=0;} //1
    if(chordEquals([1,"min"])){ch=6;}
    if(chordEquals([1,"dim"])){ch=7;}
    if(chordEquals([1,"maj7"])||chordEquals([1,"maj9"])){ch=8;}
    if(chordEquals([1,"min7"])||chordEquals([1,"min9"])){ch=9;}
    if(chordEquals([1,"dom7"])){ch=10;}
    if(chordEquals([1,"5ths"])){ch=11;}
    if(chordEquals([1,"sus4"])){ch=12;}

    if(chordEquals([2,"maj"])||chordEquals([2,"maj7"])){ch=13;} //2
    if(chordEquals([2,"min"])||chordEquals([2,"min7"])){ch=14;}

    //3

    if(chordEquals([4,"maj7"])||chordEquals([4,"maj9"])){ch=1;} //4
    if(chordEquals([4,"maj"])||chordEquals([4,"3rds"])){ch=4;}
    if(chordEquals([4,"min"])||chordEquals([2,"halfDim7"])){ch=5;}
    if(chordEquals([4,"dom7"])){ch=15;}
    if(chordEquals([4,"sus4"])){ch=16;}
    if(chordEquals([4,"min7"])||chordEquals([4,"min9"])){ch=17;}

    if(chordEquals([5,"maj"])||chordEquals([5,"maj7"])){ch=2;} //5

    if(chordEquals([6,"min"])){ch=3;}//6

    //7

    newChord(ch);
}

function newChord(ch){
    switch(ch){
        case 0: 
            if(percent(50)){chord = [4,"maj7"];}
            else{chord = [5,"maj"];}
        break;
        case 1: 
            if(percent(50)){chord = [1,"maj"];}
            else{chord = [5,"maj"];}
        break;
        case 2: 
            if(percent(50)){chord = [4,"maj7"];}
            else{chord = [1,"maj"];}
        break;
    }
}

function makeProgression(startChord=[1,"maj"]){
    var prog = [];
    chord = startChord;
    prog[0] = startChord;
    for(var mp=1; mp<period; mp++){
        selectChord();
        prog[mp] = chord;
    }
    console.log(prog);
}

//

makeProgression();