//JS Script for Page Functionality
var objsBox = document.getElementById("objsCanv"); //Main stuff I guess
var propertiesBox = document.getElementById("properties");
var codeBox = document.getElementById("codeInpBox");
var lineNums = document.getElementById("lineNums");
var runBtn = document.getElementById("runBtn");
var exportBtn = document.getElementById("exportBtn");
document.getElementById("downloadBtn").href = makeTextFile("Nothing! Press code refresh btn!");

var nameInp = document.getElementById("nameInp"); //Property Inputs
var xInp = document.getElementById("xInp");
var yInp = document.getElementById("yInp");
var wInp = document.getElementById("wInp");
var hInp = document.getElementById("hInp");
var fillInp = document.getElementById("fillInp");
var strokeInp = document.getElementById("strokeInp");
var lineWInp = document.getElementById("lwInp");
var boundInp = document.getElementById("boundInp");
var CLInp = document.getElementById("CLInp");
var CRInp = document.getElementById("CRInp");
var CTInp = document.getElementById("CTInp");
var CBInp = document.getElementById("CBInp");

var ctx2 = objsBox.getContext("2d");
var timer = setInterval(pageMain, interval);

document.addEventListener("mousemove",function(e){updateMousePos2(e); movePickedObj();}); //MousePos

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

var prevCodeBoxHeight = 81;
var lineCount;
var prevLineCount = 1;
var multilineCheck = false;

var running = false;
var code = ""; //All Box Code
var mainCode = ""; //code inside main{}
var functions = ""; //functions
var libraryCode = ""; //Copy&Paste Library file
var staticCode = ""; //stuff like main and stuff
var variableCode = ""; //Code for set but unwritten elements (such as a_Objects)
var jsCode = ""; //string to be exported

var a_libraryObjs = [new Rectangle(objsBox.width/2-25,10,"rectangle1",ctx2)];
var a_libraryPos = [[objsBox.width/2-25,10]];
var pickedObj;
var pickedObjInd;
var mxOff;
var myOff;

var selectedObject = undefined;
var selectedObjectInd = -1;

var a_propertyInpIDs = ["nameInp","xInp","yInp","wInp","hInp","fillInp","strokeInp","lwInp","boundInp","CLInp","CRInp","CTInp","CBInp"];
var a_propertyInps = [nameInp,xInp,yInp,wInp,hInp,fillInp,strokeInp,lineWInp,boundInp,CLInp,CRInp,CTInp,CBInp];

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
        toggleProperties(true);
        exportBtn.disabled = true;
    }else{
        codeBox.contentEditable = true;
        runBtn.value = "Run";
        runBtn.style.backgroundColor = "lightgreen";
        a_arrays = [];
        a_variables = [];
        resetObjs();
        toggleProperties(false);
        exportBtn.disabled = false;
    }
    a_KeysPressed = [];
    onClick = function(){console.log("User has clicked.\nSet onClick = function [name](){//Your Code} to replace this message.");}
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

function updateMousePos2(e){
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
        case 0: return new Rectangle(mousex-10,mousey-10,"object"+a_Objects.length);
    }
}

function stringCtxToReal(c){
    if(c=="ctx"){return ctx;}
    else{return ctx2;}
}

function resetObjs(){
    for(var ro=0; ro<a_Objects.length; ro++){
        a_Objects[ro].reset();
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
    a_Objects[ro].reset();
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
        CLInp.value = selectedObject.collL;
        CRInp.value = selectedObject.collR;
        CTInp.value = selectedObject.collT;
        CBInp.value = selectedObject.collB;
        //console.log(selectedObject.left+", "+selectedObject.right+", "+selectedObject.top+", "+selectedObject.bottom);
        toggleProperties(false);
    }else{
        for(var rop=0; rop<5; rop++){
            a_propertyInps[rop].value = null;
        }
        fillInp.value = "#000000";
        strokeInp.value = "#000000";
        lineWInp.value = null;
        boundInp.checked = false;
        for(var rop=9; rop<13; rop++){
            a_propertyInps[rop].value = null;
        }
        toggleProperties(true);
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
        selectedObject.collL = CLInp.value;
        selectedObject.collR = CRInp.value;
        selectedObject.collT = CTInp.value;
        selectedObject.collB = CBInp.value;
        resetObj(selectedObjectInd);
    }
}

function toggleProperties(disable){
    for(var tp=0; tp<a_propertyInps.length; tp++){
        a_propertyInps[tp].disabled = disable;
    }
}

function selectExportCode() {
    setVariableCode();
    setJsCode();

    //window.getSelection().selectAllChildren(document.getElementById("exportCode"));
    navigator.clipboard.writeText(document.getElementById("exportCode").innerText); //writes to clipboard

    document.getElementById("downloadBtn").href = makeTextFile(jsCode);
}

function setJsCode(){
    libraryCode = getLibraryCode();

    staticCode = `
    var timer = setInterval(pageMain, interval);

    function pageMain(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        `+mainCode+`
        drawObjs(a_Objects,ctx);
    }
    `+code;

    jsCode = libraryCode+variableCode+staticCode;

    document.getElementById("exportCode").innerText = jsCode;
}

function setVariableCode(){
    for(var svc=0; svc<a_Objects.length; svc++){
        variableCode = "makeObj('"+a_Objects[svc].name+"', '"+a_Objects[svc].type+`');
        a_Objects[`+svc+"].sX = "+a_Objects[svc].sX+`;
        a_Objects[`+svc+"].sY = "+a_Objects[svc].sY+`;
        a_Objects[`+svc+"].sSize = "+a_Objects[svc].sSize+`;
        a_Objects[`+svc+"].sWidth = "+a_Objects[svc].sWidth+`;
        a_Objects[`+svc+"].sHeight = "+a_Objects[svc].sHeight+`;
        a_Objects[`+svc+"].sFill = '"+a_Objects[svc].sFill+`';
        a_Objects[`+svc+"].sStroke = '"+a_Objects[svc].sStroke+`';
        a_Objects[`+svc+"].sLineWidth = "+a_Objects[svc].sLineWidth+`;
        a_Objects[`+svc+"].collL = "+a_Objects[svc].collL+`;
        a_Objects[`+svc+"].collR = "+a_Objects[svc].collR+`;
        a_Objects[`+svc+"].collT = "+a_Objects[svc].collT+`;
        a_Objects[`+svc+"].collB = "+a_Objects[svc].collB+`;
        a_Objects[`+svc+"].bounded = "+a_Objects[svc].bounded+`;
        a_Objects[`+svc+"].reset(); ";
    }
}


var textFile = null; //Woah! I copy pasted this code!
function makeTextFile(text) {
    var data = new Blob([text], {type: 'text/javascript'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
}