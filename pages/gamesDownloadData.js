class Game{
    constructor(name, href, size, itchinfo={embedId:-1,gameLinkName:"",gameTitle:""}) {
        this.name = name;
        this.href = href;
        this.size = size;
        this.itchinfo = itchinfo;
    }
    getHref(){
        return `../zips/${this.href}.zip`;
    }
    getItch(){
        if(this.itchinfo.embedId==-1)return "";
        return `<iframe frameborder="0" src="https://itch.io/embed/${this.itchinfo.embedId}?border_width=4&amp;link_color=a4c7a2" width="558" height="173"><a href="https://mattonmat.itch.io/${this.itchinfo.gameLinkName}">${this.itchinfo.gameTitle}</a></iframe>`;
    }
}

const games = [
    new Game("Bark of the 90's","Barkof90sBuild1","idk size"),
    new Game("Epic Meal Slime","epicmealslimeBuild", "~40mb",{embedId:2737713,gameLinkName:"epic-meal-slime",gameTitle:"Epic Meal Slime"})
];

//Game itch.io embed
//<iframe frameborder="0" src="https://itch.io/embed/3237501?border_width=4&amp;link_color=a4c7a2" width="558" height="173"><a href="https://mattonmat.itch.io/agent-h-and-the-golden-hat">Agent H and The Golden Hat by MattonMat</a></iframe>

//<iframe frameborder="0" src="https://itch.io/embed/2737713?border_width=4&amp;link_color=a4c7a2" width="558" height="173">
// <a href="https://mattonmat.itch.io/epic-meal-slime">Epic Meal Slime by MattonMat</a>
// </iframe>