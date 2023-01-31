/*-------------------------------------
    This class is used to manage game states
-------------------------------------*/

class StateManager
{
    constructor()
    {
        //The game's current state
        this.currentState;   
    }

    //Changes the game's state
    changeState(_newState)
    {
            this.currentState = _newState //Hardcode if(currentState&&newState){currentState==differentthingidk} maybe
    }
}

//Instatiate the state manager.
var gameStates=new StateManager();