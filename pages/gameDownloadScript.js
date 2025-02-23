const downloadLink = document.getElementById("download");
const gameTitle = document.getElementById("h1");
const itchbox = document.getElementById("itchbox");

const parseSearch = ()=>{
    let search = window.location.search; //ex: ?gameid=22
    return search.substring(search.indexOf("gameid=")+7);
}
const gameid=parseSearch();

//Load Game data into html page
let game = games[gameid];

gameTitle.innerText = game.name+" Download";
downloadLink.href = game.getHref();
downloadLink.innerText = game.name+" - "+game.size;
itchbox.innerHTML = game.getItch();