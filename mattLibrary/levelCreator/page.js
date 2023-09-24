//DOM ELEMENTS
var canvasW = document.getElementById("canvasWInp");
var canvasH = document.getElementById("canvasHInp");
var optionsSection = document.getElementById("options");
var propertiesSection = document.getElementById("properties");
var showSelectInp = document.getElementById("showSelectInp");
var showHiddenInp = document.getElementById("showHiddenInp");
var addObjList = document.getElementById("addObjList");
var addComList = document.getElementById("addComList");
var selColInp = document.getElementById("selectionColorInp");
var hidColInp = document.getElementById("hiddenColorInp");
var tagToArrInp = document.getElementById("tagToArrInp");

//OPTIONS VARIABLES
var showSelected = true;
var showHidden = true;
var tagsToArrays = false;

//Object Arrays
var btns_a = [];
var hidden_a = []; //debug view for hidden objs
var paragraph_a = [];
var objects_a = [];

//Editing Variables
var selection = new Obj(["shape-render"],{width:100,height:100,show:false,tag:"editing-tool",stroke:"blue",color:"rgba(0,0,0,0)",priority:Number.MAX_SAFE_INTEGER,lineWidth:2});
var selectedObj;
var editState = "move";
var resetSelected = true;
var propertyElements = [];
var gridLines = [];
var cam = new Obj(["movement"],{x:canvas.width/2,y:canvas.height/2,friction:0.8});
var camSpd = 2;
var origin = new Obj([],{x:canvas.width/2,y:canvas.height/2});

//Gamestates
gamestates = {
    "default":[function(){
        canvas.height = canvasH.value;
        optionsSection.style.height=canvasH.value+'px';
        propertiesSection.style.height=canvasH.value+'px';
        setCameraTarget(cam);
        drawObjs = [selection];
        pushArray([cam,origin,selection],worldObjs);
        camPrecision = 0.1;
    },function(){
        //Mouse Move Stuff
        if(mouseDown&&mouseInside(0,canvas.width,0,canvas.height)){
            if(resetSelected&&(editState=="select"||selectedObj===undefined)){
                deselectObj();
                for (const element of objects_a) {
                    if(mouseInsideObj(element)){selectObj(element); break;}
                }
            }
            if(selectedObj!==undefined){
                editMode[editState]();
                setPropertiesSection(selectedObj);
            }
        }
        if(selectedObj===undefined){selection.show = false;}
        else{selection.show = true; }
        if(!showSelected){selection.show = false};
        resetSelected = !mouseDown;

        //Key press inputs
        if(getKeyPress("backspace")&&selectedObj!==undefined){
            deleteObj(selectedObj);
        }
        //Camera Movement
        if(getAnyKey(["keyW","arrowup"])){cam.vy -= camSpd;}
        if(getAnyKey(["keyA","arrowleft"])){cam.vx -= camSpd;}
        if(getAnyKey(["keyS","arrowdown"])){cam.vy += camSpd;}
        if(getAnyKey(["keyD","arrowright"])){cam.vx += camSpd;}
        if(getKeyPress("keyE")){setCamera(origin);}
        cam.move();
        moveCamera();

        //Show Button States Option
        btns_a.forEach(element => {
            element.doState();
        });
        //Update Paragraph Lines
        paragraph_a.forEach(element => {
            element.updateLines();
        });
        
        //Update Hidden Objects
        hidden_a.forEach(element => {
            let hObj = findProp(objects_a,"id",element.id);
            element.set({x:hObj.x,y:hObj.y,width:hObj.width,height:hObj.height,angle:hObj.angle,color:hidColInp.value,show:showHidden});
        });
    }]
};

//Functions
function addObj(){
    objects_c[addObjList.value].declare();
    objects_a.push(selectedObj);
    drawObjs.push(selectedObj);
    worldObjs.push(selectedObj);
    selection.set({x:selectedObj.x,y:selectedObj.y,width:selectedObj.width,height:selectedObj.height,angle:selectedObj.angle});
    setPropertiesSection(selectedObj);
}

function addCom(){
    if(selectedObj!==undefined){
        selectedObj.addComponents([addComList.value]);
        setPropertiesSection(selectedObj);

        selectedObj.components.push(addComList.value);

        //Removing hidden obj
        if(addComList.value=="shape-render"||addComList.value=="image-render"){
            hidden_a.splice(hidden_a.indexOf(findProp(hidden_a,"id",selectedObj.id)),1);
            drawObjs.splice(drawObjs.indexOf(findProp(drawObjs,"id",selectedObj.id)),1);
            worldObjs.splice(worldObjs.indexOf(findProp(worldObjs,"id",selectedObj.id)),1);
        }
    }
}

function selectObj(obj){
    selectedObj = obj;
    selection.set({x:selectedObj.x,y:selectedObj.y,width:selectedObj.width,height:selectedObj.height,angle:selectedObj.angle});
    setPropertiesSection(selectedObj);
}

function deselectObj(){
    selectedObj = undefined;
    clearPropertiesSection();
}

function deleteObj(obj){
    deselectObj();
    objects_a.splice(objects_a.indexOf(obj),1);
    if(btns_a.includes(obj)){btns_a.splice(btns_a.indexOf(obj),1);}
    if(hidden_a.includes(obj)){hidden_a.splice(hidden_a.indexOf(obj),1);}
    if(paragraph_a.includes(obj)){paragraph_a.splice(paragraph_a.indexOf(obj),1);}
    drawObjs.splice(drawObjs.indexOf(obj),1);
    worldObjs.splice(worldObjs.indexOf(obj),1);
}

function setPropertiesSection(obj){
    clearPropertiesSection();
    let _props = Object.entries(obj);
    for (const element of _props) {
        if(!ignoreProperties.includes(element[0])){
            createProperty[typeof element[1]](element);
        }
    }
    propertiesSection.style.height=canvasH.value+'px';
}

function clearPropertiesSection(){
    propertyElements.forEach(element => {
        propertiesSection.removeChild(element);
    });
    propertyElements = [];
}

function exportCode(){
    selectedObj = undefined;
    clearPropertiesSection();
    let _code = document.createElement("p");
    if(tagsToArrays){
        let tempArr = [];
        for(let i=0; i<objects_a.length; i++){
            tempArr[i] = objects_a[i];
        }
        while(tempArr.length>0){
            let init = (tempArr[0].tag=="")?("importObjs = ["):("a_"+tempArr[0].tag+" = [");
            _code.innerHTML += init;
            let _tempArr = findTags(tempArr,tempArr[0].tag);
            _tempArr.forEach(element => {
                _code.innerHTML += convertObjToCode(element);
            });
            _code.innerHTML += "];";
            for (const element of _tempArr) {
                if(tempArr.includes(element)){
                    tempArr.splice(tempArr.indexOf(element),1);
                }
            }
        }
    }else{
        _code.innerHTML = "importObjs = [";
        objects_a.forEach(element => {
            _code.innerHTML += convertObjToCode(element);
        });
        _code.innerHTML += "];";
    }
    _code.style.font = "6px Arial";
    propertiesSection.appendChild(_code);
    propertyElements = [_code];
}

function convertObjToCode(obj){
    //return string
    let _objCode = "new " + obj.type+"([";
    //loop through comps
    for (const element of obj.components) {
        _objCode += "'" + element + "',";
    }
    _objCode += "],{";
    //loop through props
    let _props = Object.entries(obj);
    for (const element of _props) {
        if(!ignoreProperties.includes(element[0])&&typeof element[1]!="function"&&typeof element[1]!="object"){
            if(typeof element[1] == "string"){
                _objCode += element[0]+":'"+element[1]+"',";
            }else{
                _objCode += element[0]+":"+element[1]+",";
            }
        }
    }
    _objCode += "}),";
    return _objCode;
}

function setInpPropVal(propName,_inpVal){
    let subObj = selectedObj;
    while(propName.includes(".")){
        subObj = selectedObj[propName.substr(0,propName.indexOf("."))];
        propName = propName.substr(propName.indexOf(".")+1);
    }
    subObj[propName] = _inpVal;
}

//CONST LISTS
var objIDCount = 0;
const objects_c = {
    "Obj":{
        declare:function(){
            let _tempObj = new Obj(["collision"],{x:canvas.width/2,y:canvas.height/2,width:100,height:100});
            _tempObj.id=objIDCount;
            _tempObj.type="Obj";
            _tempObj.components=[];
            selectedObj = _tempObj;
            let _tempGhost = new Obj(["shape-render"],{});
            _tempGhost.id = objIDCount;
            hidden_a.push(_tempGhost);
            drawObjs.push(_tempGhost);
            worldObjs.push(_tempGhost);
            objIDCount++;
        }
    },
    "Text":{
        declare:function(){
            let _tempObj = new Text(["collision"],{x:canvas.width/2,y:canvas.height/2,width:100,height:50});
            _tempObj.id=objIDCount;
            _tempObj.type="Text";
            _tempObj.components=[];
            selectedObj = _tempObj;
            objIDCount++;
        }
    },
    "Paragraph":{
        declare:function(){
            let _tempObj = new Paragraph(["collision"],{x:canvas.width/2,y:canvas.height/2,width:100,height:50});
            _tempObj.id=objIDCount;
            _tempObj.type="Paragraph";
            _tempObj.components=[];
            paragraph_a.push(_tempObj);
            _tempObj.updateLines();
            selectedObj = _tempObj;
            objIDCount++;
        }
    },
    "Bar":{
        declare:function(){
            let _tempObj = new Bar(["collision"],{x:canvas.width/2,y:canvas.height/2,width:100,height:20});
            _tempObj.id=objIDCount;
            _tempObj.type="Bar";
            _tempObj.components=[];
            selectedObj = _tempObj;
            objIDCount++;
        }
    },
    "Toggle":{
        declare:function(){
            let _tempObj = new Toggle([],{x:canvas.width/2,y:canvas.height/2,width:40,height:40});
            _tempObj.id=objIDCount;
            _tempObj.type="Toggle";
            _tempObj.components=[];
            selectedObj = _tempObj;
            objIDCount++;
        }
    },
    "Btn":{
        declare:function(){
            let _tempObj = new Btn([],{x:canvas.width/2,y:canvas.height/2,width:100,height:50});
            _tempObj.id=objIDCount;
            _tempObj.type="Btn";
            _tempObj.components=[];
            btns_a.push(_tempObj);
            _tempObj.doState();
            selectedObj = _tempObj;
            objIDCount++;
        }
    },
};

const editMode = {
    "move":function(){
        //Check for mouse movement and change selected obj Position
        selectedObj.set({x:mousex,y:mousey});

        selection.set({x:selectedObj.x,y:selectedObj.y});
    },
    "scale":function(){
        //Check for mouse movement and change selected obj Scale
        selectedObj.set({width:Math.abs(mousex-selectedObj.x)*2,height:Math.abs(mousey-selectedObj.y)*2});

        selection.set({width:selectedObj.width,height:selectedObj.height});
    },
    "rotate":function(){
        //Check for mouse movement and change selected obj Angle
        selectedObj.set({angle:getAngle(mousex-selectedObj.x,mousey-selectedObj.y)});

        selection.set({angle:selectedObj.angle});
    },
    "select":function(){
        //Do nothing maybe?
    }
};

var propNamePrefix = "";
const createProperty = {
    "boolean":function(_prop){
        let _tempLabel = document.createElement("p");
        _tempLabel.innerHTML = _prop[0];
        _tempLabel.style.margin = "0px";
        let _tempInp = document.createElement("input");
        _tempInp.type = "checkbox";
        _tempInp.checked = _prop[1];
        _tempInp.style.margin = "0px";
        let _tempHr = document.createElement("hr");
        _tempHr.style.borderStyle = "dashed";
        _tempHr.style.borderColor = "rgb(133,133,133)";
        if(_prop[0]=="show"){
            let _prefix = propNamePrefix;
            _tempInp.onchange = function(){setInpPropVal(_prefix+_prop[0],_tempInp.checked); selectObj(selectedObj); 
                if(_tempInp.checked){
                    let _tempGhost = findProp(hidden_a,"id",selectedObj.id);
                    hidden_a.splice(hidden_a.indexOf(_tempGhost),1);
                    drawObjs.splice(drawObjs.indexOf(_tempGhost),1);
                    worldObjs.splice(worldObjs.indexOf(_tempGhost),1);
                }else{
                    let _tempGhost = new Obj(["shape-render"],{});
                    _tempGhost.id = selectedObj.id;
                    hidden_a.push(_tempGhost);
                    drawObjs.push(_tempGhost);
                    worldObjs.push(_tempGhost);
                }
            };
        }else{
            let _prefix = propNamePrefix;
            _tempInp.onchange = function(){setInpPropVal(_prefix+_prop[0],_tempInp.checked); selectObj(selectedObj);};
        }
        propertiesSection.appendChild(_tempLabel);
        propertiesSection.appendChild(_tempInp);
        propertiesSection.appendChild(_tempHr);
        propertyElements.push(_tempLabel);
        propertyElements.push(_tempInp);
        propertyElements.push(_tempHr);
    },
    "number":function(_prop){
        let _tempLabel = document.createElement("p");
        _tempLabel.innerHTML = _prop[0];
        _tempLabel.style.margin = "0px";
        let _tempInp = document.createElement("input");
        _tempInp.type = "number";
        _tempInp.value = _prop[1];
        _tempInp.style.margin = "0px";
        _tempInp.style.width = "80px";
        let _tempHr = document.createElement("hr");
        _tempHr.style.borderStyle = "dashed";
        _tempHr.style.borderColor = "rgb(133,133,133)";
        let _prefix = propNamePrefix;
        _tempInp.onchange = function(){setInpPropVal(_prefix+_prop[0],Number(_tempInp.value)); selectObj(selectedObj);};
        propertiesSection.appendChild(_tempLabel);
        propertiesSection.appendChild(_tempInp);
        propertiesSection.appendChild(_tempHr);
        propertyElements.push(_tempLabel);
        propertyElements.push(_tempInp);
        propertyElements.push(_tempHr);
    },
    "string":function(_prop){
        let _tempLabel = document.createElement("p");
        _tempLabel.innerHTML = _prop[0];
        _tempLabel.style.margin = "0px";
        let _tempInp = document.createElement("input");
        let _tempHr = document.createElement("hr");
        _tempHr.style.borderStyle = "dashed";
        _tempHr.style.borderColor = "rgb(133,133,133)";
        _tempInp.value = _prop[1];
        if(colorProperties.includes(_prop[0])){
            //It's a color! NOT string!
            _tempInp.type = "color";
            _tempInp.value = (_prop[1].includes("#"))?(_prop[1]):(rgbToHex(_prop[1]));
            //ADD OPACITY INPUT
        }else if(Object.keys(dropdownProperties).includes(_prop[0])){
            _tempInp = document.createElement("select");
            for(let i=0; i<dropdownProperties[_prop[0]].length; i++){
                let _option = document.createElement("option");
                _option.value = dropdownProperties[_prop[0]][i];
                _option.innerHTML = dropdownProperties[_prop[0]][i];
                _tempInp.appendChild(_option);
            }
            _tempInp.value = _prop[1];
        }
        let _prefix = propNamePrefix;
        _tempInp.onchange = function(){setInpPropVal(_prefix+_prop[0],_tempInp.value); selectObj(selectedObj);};
        _tempInp.style.margin = "0px";
        propertiesSection.appendChild(_tempLabel);
        propertiesSection.appendChild(_tempInp);
        propertiesSection.appendChild(_tempHr);
        propertyElements.push(_tempLabel);
        propertyElements.push(_tempInp);
        propertyElements.push(_tempHr);
    },
    "object":function(_prop){
        let _tempBrs = [];
        let _tempHr = [];
        for(let i=0; i<4; i++){
            _tempBrs[i] = document.createElement("br");
            if(i<3){_tempHr[i] = document.createElement("hr");}
        }
        propertiesSection.appendChild(_tempBrs[0]);
        propertiesSection.appendChild(_tempBrs[1]);
        _tempHr[1].style.borderStyle = "inset";
        _tempHr[1].style.borderWidth = "2px";
        _tempHr[1].style.borderColor = "rgb(33,33,33)";
        _tempHr[2].style.borderStyle = "inset";
        _tempHr[2].style.borderWidth = "2px";
        _tempHr[2].style.borderColor = "rgb(33,33,33)";
        propertiesSection.appendChild(_tempHr[1]);

        //ADD TITLE OF THE OBJECT
        let _tempLabel = document.createElement("p");
        _tempLabel.innerHTML = _prop[0];
        _tempLabel.style.margin = "0px";
        propertiesSection.appendChild(_tempLabel);
        propertyElements.push(_tempLabel);

        //ADD BOLDED HR
        _tempHr[0].style.borderStyle = "solid";
        _tempHr[0].style.borderColor = "rgb(99,99,99)";
        propertiesSection.appendChild(_tempHr[0]);
        
        let _objProps = Object.entries(_prop[1]);
        //IF is Addative Property: Create the Add btn/features
        if(addativeProperties.includes(_prop[0])){
            //Create ADD element
            if(_objProps[0][0]!="0"){
                //Create KeyName Input
                console.log(_objProps);
                console.log("NOT ARRAY!!");
            }
            //For each property in the Object
            for (let i=0; i<_objProps.length; i++) {
                if(!ignoreProperties.includes(_objProps[i][0])){
                    //Create REMOVE element
                    createProperty[typeof _objProps[i][1]](_objProps[i]);
                }
            }
        }else{
            propNamePrefix += _prop[0]+".";
            for (let i=0; i<_objProps.length; i++) {
                if(!ignoreProperties.includes(_objProps[i][0])){
                    
                    createProperty[typeof _objProps[i][1]](_objProps[i]);
                }
            }
            propNamePrefix = "";
        }
        //ADD BOLDED HR
        propertiesSection.appendChild(_tempHr[2]);
        propertiesSection.appendChild(_tempBrs[2]);
        propertiesSection.appendChild(_tempBrs[3]);
        pushArray(_tempBrs,propertyElements);
        pushArray(_tempHr,propertyElements);
    },
    "function":function(_prop){
        //do nothing!
    }
};

const ignoreProperties = ["currentState","states","lines","btnDown","btnSelected","animState","animCount","animFrame","animPlaying","colliding","id","animData","type","components"];
const colorProperties = ["color","stroke","backColor","onCol","offCol","default","hover","down","pressed"];
const dropdownProperties = {
    "shape":["rect","circle","text","bar","toggle","button","paragraph","image"],
    "align":["left","right","center","justify"]
};
const addativeProperties = ["animData","frames"];

changeState("default");