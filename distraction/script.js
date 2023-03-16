var canvas = document.getElementById("canvas");
var header = document.getElementById("header");
var ctx = canvas.getContext("2d");

var interval = 1000/140;
var timer = setInterval(main, interval);

var r,g,b;

function main(){
    r = randNum(0,255);
    g = randNum(0,255);
    b = randNum(0,255);
    document.body.style.backgroundColor = 'rgb('+r+','+g+','+b+')';
    r = randNum(0,255);
    g = randNum(0,255);
    b = randNum(0,255);
    header.style.color = 'rgb('+r+','+g+','+b+')';

}

function randNum(low, high){return Math.random()*(high-low)+low;}