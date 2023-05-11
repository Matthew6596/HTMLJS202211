var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var fps = 4;
var res = canvas.width/8;
var code = "1111000100000010";

var timer = setInterval(main,1000/fps);

//Set rom & ram stuff

var sprites = {};
//sprites["$0000"][0] <-- gets 1 or 0
var audio = {};
var rom = {};

var registers = {a:"00000000",b:"00000000",x:"00000000",y:"00000000"};
var ram = {};
//filling ram with 0's
for(var i=0; i<32; i++){ //***Idea - Add input section to ram
    var address = "$"+(toByte(i).substring(3));
    ram[address] = "00000000";
}

function toByte(num){
    var returnVal = "";
    if(num/128>=1){returnVal+="1"; num-=128;}else{returnVal+="0";}
    if(num/64>=1){returnVal+="1"; num-=64;}else{returnVal+="0";}
    if(num/32>=1){returnVal+="1"; num-=32;}else{returnVal+="0";}
    if(num/16>=1){returnVal+="1"; num-=16;}else{returnVal+="0";}
    if(num/8>=1){returnVal+="1"; num-=8;}else{returnVal+="0";}
    if(num/4>=1){returnVal+="1"; num-=4;}else{returnVal+="0";}
    if(num/2>=1){returnVal+="1"; num-=2;}else{returnVal+="0";}
    if(num>=1){returnVal+="1";}else{returnVal+="0";}
    return returnVal;
}

function readCode(){
    var sSize = 32;
    var aSize = 132;
    var rSize = 256;

    var address = "$";
    var byte = "00000000";

    for(var rr=0; rr<sSize; rr++){ //Sprites
        address = "$"+(toByte(rr).substring(3));
        byte = code.substring(rr*8,(rr+1)*8);
        sprites[address] = byte;
    }

    for(var rr=sSize; rr<sSize+aSize; rr++){ //Audio
        address = "$"+(toByte(rr-sSize));
        byte = code.substring(rr*8,(rr+1)*8);
        audio[address] = byte;
    }
    
    for(var rr=sSize+aSize; rr<sSize+aSize+rSize; rr++){ //ROM
        address = "$"+toByte(rr-sSize-aSize);
        byte = code.substring(rr*8,(rr+1)*8);
        rom[address] = byte;
    }
}
readCode();

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //

    //read & execute rom
}


//Opcodes
var opcodes = {
    $00000000:function $00(){ //End Program
        
    },
    $00000001:function $01(){
        
    },
    $00000010:function $02(){
        
    },
    $00000011:function $03(){
        
    },
    $00000100:function $04(){ 
        
    },
    $00000101:function $05(){
        
    },
    $00000110:function $06(){
        
    },
    $00000111:function $07(){
        
    },
    $00001000:function $08(){ //Load -A- w/ Value
        
    },
    $00001001:function $09(){ //Load -A- w/ Address
        
    },
    $00001010:function $0A(){ //Load -B- w/ Value
        
    },
    $00001011:function $0B(){ //Load -B- w/ Address
        
    },
    $00001100:function $0C(){ //Load -X- w/ Value
        
    },
    $00001101:function $0D(){ //Load -X- w/ Address
        
    },
    $00001110:function $0E(){ //Load -Y- w/ Value
        
    },
    $00001111:function $0F(){ //Load -Y- w/ Address
        
    },
}
/*
opcodes["$00000000"](); <-- calling opcode

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
OPCODES REFERENCE: http://www.6502.org/tutorials/6502opcodes.html
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
_________________________________
Opcodes to sort:
-Jump (JMA, JMB, JMX, JMY, *JMV <-- Jumptovalue)
-Return from jump (maybe)
-Draw Tile/BG Sprite
-Draw Object Sprite
-Register Transfers
-Register Sends (to RAM)
-Math
-Equals zero + other comparisons
-
_________________________________
*/