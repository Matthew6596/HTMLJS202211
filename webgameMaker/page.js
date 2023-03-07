//JS Script for Page Functionality
var canvas = document.getElementById("canvas"); //Main stuff I guess
var objsBox = document.getElementById("objsCanv");
var propertiesBox = document.getElementById("properties");
var codeBox = document.getElementById("codeInpBox");
var lineNums = document.getElementById("lineNums");
var runBtn = document.getElementById("runBtn");

var nameInp = document.getElementById("nameInp"); //Property Inputs
var xInp = document.getElementById("xInp");
var yInp = document.getElementById("yInp");
var wInp = document.getElementById("wInp");
var hInp = document.getElementById("hInp");
var fillInp = document.getElementById("fillInp");
var strokeInp = document.getElementById("strokeInp");
var lineWInp = document.getElementById("lwInp");
var boundInp = document.getElementById("boundInp");

var ctx = canvas.getContext("2d"); //Contexts
var ctx2 = objsBox.getContext("2d");

document.addEventListener("mousemove",function(e){updateMousePos(e); movePickedObj();}); //MousePos

document.addEventListener("input",codeBoxAdjust); //Listeners for adjusting codeBox size
document.addEventListener("paste",multiLineRemovalCheck);
document.addEventListener("cut",multiLineRemovalCheck);
document.addEventListener("dblclick", multiLineRemovalCheck);
document.addEventListener("selectionchange", function(){if(document.getSelection().toString().length>1){multiLineRemovalCheck();}});

document.addEventListener("mousedown", objPickUp); //Listeners for drag/drop objects
document.addEventListener("dragstart", movePickedObj); 
document.addEventListener("mouseup", objDrop);

document.addEventListener("click",getSelectedObj); //Listener for selecting objects

codeBox.contentEditable = true;

var interval = 1000/140; //1000/140
var timer = setInterval(pageMain, interval);

var prevCodeBoxHeight = 81;
var lineCount;
var prevLineCount = 1;
var multilineCheck = false;

var running = false;
var code = "";
var mainCode = "";
var functions = "";

var a_libraryObjs = [new Rectangle(objsBox.width/2-25,10,"rectangle1",ctx2)];
var a_libraryPos = [[objsBox.width/2-25,10]];
var pickedObj;
var pickedObjInd;
var mxOff;
var myOff;

var selectedObject = undefined;
var selectedObjectInd = -1;

var a_propertyInpIDs = ["nameInp","xInp","yInp","wInp","hInp","fillInp","strokeInp","lwInp","boundInp"];

function pageMain(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx2.clearRect(0,0,objsBox.width,objsBox.height);

    if(!running){
        if(a_propertyInpIDs.includes(document.activeElement.id)){
            writeObjProperties();
        }else{
            readObjProperties();
        }
    }
    drawObjs(a_libraryObjs,getPickObjContext(a_libraryObjs));
    drawObjs(a_Objects,getPickObjContext(a_Objects,"ctx"));
    
    if(running&&!mainCode.includes("//none")){eval(functions); eval(mainCode);}

}

function swapEditable(){
    if(codeBox.contentEditable=="true"){
        codeBox.contentEditable = false;
        runBtn.value = "End";
        runBtn.style.backgroundColor = "rgb(238, 103, 103)";
        code = codeBox.innerText;
        mainCode = getMain();
        functions = getFunctions();
        setObjs();
    }else{
        codeBox.contentEditable = true;
        runBtn.value = "Run";
        runBtn.style.backgroundColor = "lightgreen";
        a_arrays = [];
        a_variables = [];
        resetObjs();
    }
    a_KeysPressed = [];
    onClick = function(){console.log("User has clicked.\nSet onClick = function(){//Your Code} to replace this message.");}
}

function getMain(){
    var mainInd;
    var openBrackCount = 0;
    var mainEndInd;
    var firstBrackCheck = false;
    var mainOut;
    if(code.includes("main{")){
        mainInd = code.indexOf("main{");
        for(var getMainVar=mainInd; getMainVar<code.length; getMainVar++){
            if(code.charAt(getMainVar)=='{'){openBrackCount++; firstBrackCheck=true;}
            if(code.charAt(getMainVar)=='}'){openBrackCount--;}
            if(openBrackCount==0&&firstBrackCheck){mainEndInd=getMainVar; break;}
        }
        mainOut = code.substring(mainInd+6,mainEndInd-1);
        code = code.substring(0,mainInd)+code.substring(mainEndInd+1,code.length);
    }else{
        return "//none";
    }
    return mainOut;
}

function getFunctions(){
    var funcInd;
    var openBrackCount = 0;
    var funcEndInd = -1;
    var firstBrackCheck;
    var funcOut = "/*functions*/";
    while(code.includes("function",funcEndInd)){
        firstBrackCheck = false;
        funcInd = code.indexOf("function",funcEndInd);
        for(var getFuncVar=funcInd; getFuncVar<code.length; getFuncVar++){
            if(code.charAt(getFuncVar)=='{'){openBrackCount++; firstBrackCheck=true;}
            if(code.charAt(getFuncVar)=='}'){openBrackCount--;}
            if(openBrackCount==0&&firstBrackCheck){funcEndInd=getFuncVar+1; break;}
        }
        funcOut += code.substring(funcInd,funcEndInd);
    }
    return funcOut;
}

function multiLineRemovalCheck(){
    if(document.activeElement.id=="codeInpBox"){
        multilineCheck=true;
    }
}

function codeBoxAdjust(){
    if(document.activeElement.id=="codeInpBox"&&codeBox.clientHeight!=prevCodeBoxHeight){
        lineCount = Math.round((codeBox.clientHeight)/16);
        
        if(multilineCheck){
            lineNums.innerText = " ";
            lineCount = Math.round((codeBox.clientHeight)/16);
            for(var cba=0; cba<lineCount; cba++){
                lineNums.innerText += "    "+(cba+1);
            }
            multilineCheck = false;
        }else{
            var lnText = lineNums.innerText;
            if(lnText.includes(""+lineCount)&&lineCount<=prevLineCount){
                lineNums.innerText = lnText.substring(0,lnText.indexOf(""+lineCount)-1);
                if((codeBox.clientHeight-2)%16==0){
                    lineNums.innerText += " "+lineCount;
                }
            }else{
                lineNums.innerText += " "+lineCount;
            }
        }

        prevLineCount = lineCount;
        prevCodeBoxHeight = codeBox.clientHeight+1;
        codeBox.clientHeight++;
    }
}

function updateMousePos(e){
    var rect = canvas.getBoundingClientRect();
    mousex = Math.round(e.clientX - rect.left);
    mousey = Math.round(e.clientY - rect.top);
    var rect2 = objsBox.getBoundingClientRect();
    mous2x = Math.round(e.clientX - rect2.left);
    mous2y = Math.round(e.clientY - rect2.top);
}

function getPickObjContext(arr,bias){
    if(bias=="ctx"){
        if(mousex<=0&&arr.includes(pickedObj)){
            return ctx2;
        }else{
            return ctx;
        }
    }else{
        if(mousex>0&&arr.includes(pickedObj)){
            return ctx;
        }else{
            return ctx2;
        }
    }
}

function drawObjs(arr,context){
    var ind = -1;
    if(arr.includes(pickedObj)){ind = pickedObjInd;}
    for(var dlo=0; dlo<arr.length; dlo++){
        if(dlo==ind){
            arr[dlo].draw(context);
        }else{
            arr[dlo].draw(arr[dlo].ctx);
        }
    }
}

function objPickUp(){
    if(!running){
        for(var opu=0; opu<a_libraryObjs.length; opu++){
            if(mouseInsideObj(a_libraryObjs[opu],"ctx2")){
                pickedObj = a_libraryObjs[opu];
                pickedObjInd = opu;
                mxOff = 0;
                myOff = 0;
                break;
            }
        }
        for(var opu=0; opu<a_Objects.length; opu++){
            if(mouseInsideObj(a_Objects[opu],"ctx")){
                pickedObj = a_Objects[opu];
                pickedObjInd = opu;
                mxOff = mousex - pickedObj.x;
                myOff = mousey - pickedObj.y;
                break;
            }
        }
    }
}

function movePickedObj(){
    var mx,my;
    if(a_libraryObjs.includes(pickedObj)){
        if(getPickObjContext(a_libraryObjs)==ctx){
            mx = mousex; 
            my = mousey;
        }else{mx = mous2x; my = mous2y}
        //mx -= mxOff;
        //my -= myOff;
        pickedObj.moveTo(mx-10,my-10);
    }
    else if(a_Objects.includes(pickedObj)){
        if(getPickObjContext(a_Objects)==ctx){
            mx = mousex; 
            my = mousey;
        }else{mx = mous2x; my = mous2y}
        mx -= mxOff;
        my -= myOff;
        pickedObj.moveTo(mx,my);
    }
}

function objDrop(){
    if(a_libraryObjs.includes(pickedObj)){
        if(getPickObjContext(a_libraryObjs)==ctx){
            a_Objects.push(makeNewObj(pickedObjInd));
        }
        pickedObj.moveTo(a_libraryPos[pickedObjInd][0],a_libraryPos[pickedObjInd][1]);
    }
    else if(a_Objects.includes(pickedObj)){
        if(getPickObjContext(a_Objects)==ctx2){
            a_Objects.splice(pickedObjInd,1);
        }
    }
    pickedObj = undefined;
}

function makeNewObj(ind){
    switch (ind){
        case 0: return new Rectangle(mousex-10,mousey-10,"object"+a_Objects.length,ctx);
    }
}

function stringCtxToReal(c){
    if(c=="ctx"){return ctx;}
    else{return ctx2;}
}

function resetObjs(){
    for(var ro=0; ro<a_Objects.length; ro++){
        a_Objects[ro].x = a_Objects[ro].sX;
        a_Objects[ro].y = a_Objects[ro].sY;
        a_Objects[ro].size = a_Objects[ro].sSize;
        a_Objects[ro].width = a_Objects[ro].sWidth;
        a_Objects[ro].height = a_Objects[ro].sHeight;
        a_Objects[ro].fill = a_Objects[ro].sFill;
        a_Objects[ro].stroke = a_Objects[ro].sStroke;
        a_Objects[ro].lineWidth = a_Objects[ro].sLineWidth;
        a_Objects[ro].bound = a_Objects[ro].bounded;
    }
}

function setObjs(){
    for(var ro=0; ro<a_Objects.length; ro++){
        a_Objects[ro].sX = a_Objects[ro].x;
        a_Objects[ro].sY = a_Objects[ro].y;
        a_Objects[ro].sSize = a_Objects[ro].size;
        a_Objects[ro].sWidth = a_Objects[ro].width;
        a_Objects[ro].sHeight = a_Objects[ro].height;
        a_Objects[ro].sFill = a_Objects[ro].fill;
        a_Objects[ro].sStroke = a_Objects[ro].stroke;
        a_Objects[ro].sLineWidth = a_Objects[ro].lineWidth;
        a_Objects[ro].bounded = a_Objects[ro].bound;
        a_Objects[ro].changeSize();
    }
}

function setObj(ro){
    a_Objects[ro].sX = a_Objects[ro].x;
    a_Objects[ro].sY = a_Objects[ro].y;
    a_Objects[ro].sSize = a_Objects[ro].size;
    a_Objects[ro].sWidth = a_Objects[ro].width;
    a_Objects[ro].sHeight = a_Objects[ro].height;
    a_Objects[ro].sFill = a_Objects[ro].fill;
    a_Objects[ro].sStroke = a_Objects[ro].stroke;
    a_Objects[ro].sLineWidth = a_Objects[ro].lineWidth;
    a_Objects[ro].bounded = a_Objects[ro].bound;
    a_Objects[ro].changeSize();
}

function resetObj(ro){
    a_Objects[ro].x = a_Objects[ro].sX;
    a_Objects[ro].y= a_Objects[ro].sY;
    a_Objects[ro].size = a_Objects[ro].sSize;
    a_Objects[ro].width = a_Objects[ro].sWidth;
    a_Objects[ro].height = a_Objects[ro].sHeight;
    a_Objects[ro].fill = a_Objects[ro].sFill;
    a_Objects[ro].stroke = a_Objects[ro].sStroke;
    a_Objects[ro].lineWidth = a_Objects[ro].sLineWidth;
    a_Objects[ro].bound = a_Objects[ro].bounded;
}

function getSelectedObj(){
    selectedObject = a_Objects[pickedObjInd];
    selectedObjectInd = pickedObjInd;
    for(var rop=0; rop<a_Objects.length; rop++){
        if(mouseInsideObj(a_Objects[rop],"ctx")){
            selectedObject = a_Objects[rop];
            selectedObjectInd = rop;
            break;
        }
    }
}

function readObjProperties(){
    if(a_Objects.includes(selectedObject)){
        setObj(selectedObjectInd);
        //Display this Object to properties panel
        nameInp.value = selectedObject.name;
        xInp.value = selectedObject.sX;
        yInp.value = selectedObject.sY;
        wInp.value = selectedObject.sWidth;
        hInp.value = selectedObject.sHeight;
        fillInp.value = selectedObject.sFill;
        strokeInp.value = selectedObject.sStroke;
        lineWInp.value = selectedObject.sLineWidth;
        boundInp.checked = selectedObject.bounded;
        //console.log(selectedObject.left+", "+selectedObject.right+", "+selectedObject.top+", "+selectedObject.bottom);
    }else{
        nameInp.value = null;
        xInp.value = null;
        yInp.value = null;
        wInp.value = null;
        hInp.value = null;
        fillInp.value = "#000000";
        strokeInp.value = "#000000";
        lineWInp.value = null;
        boundInp.checked = false;
    }
}

function writeObjProperties(){
    if(a_Objects.includes(selectedObject)){
        selectedObject.name = nameInp.value;
        selectedObject.sX = xInp.value;
        selectedObject.sY = yInp.value;
        selectedObject.sWidth = wInp.value;
        selectedObject.sHeight = hInp.value;
        selectedObject.sFill = fillInp.value;
        selectedObject.sStroke = strokeInp.value;
        selectedObject.sLineWidth = lineWInp.value;
        selectedObject.bounded = boundInp.checked;
        resetObj(selectedObjectInd);
    }
}