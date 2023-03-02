class SoundManager
{
    constructor(_soundNodes)
    {             
        for(let i=0; i<_soundNodes.length; i++)
        {
             this[_soundNodes[i].getAttribute(`name`)]=_soundNodes[i]
        }
    }
    play(_sound, _start=0, _loop=false, _vol=.5)
    {
        try
        {
            this[_sound].currentTime=_start
            this[_sound].loop = _loop
            this[_sound].volume = _vol
            this[_sound].play();
        }
        catch
        {
           throw new Error(`Sound is not loaded`)
        }
    }
    manualLoop(_sound,_startVal,_endVal)
    {
        try
        {
            if(this[_sound].currentTime>=_endVal){
                this[_sound].currentTime=_startVal;
            }
        }
        catch
        {
           throw new Error(`Sound is not loaded`)
        }
    }
    fade(_sound,_vol,_rate){
        try
        {
            if(this[_sound].volume>=_vol&&_rate<0){
                this[_sound].volume+=_rate;
            }
            if(this[_sound].volume<=_vol&&_rate>0){
                this[_sound].volume+=_rate;
            }
        }
        catch
        {
           throw new Error(`Sound is not loaded`)
        }
    }
}
let soundNodes=document.querySelectorAll(`audio`)
if(soundNodes.length>0) var sounds=new SoundManager(soundNodes)
soundNodes=null






//document.addEventListener(`click`, ()=>  sounds.play(`splode`,.5))