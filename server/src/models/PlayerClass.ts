import GameBoard from "./GameBoardTemp";
export default class Player{
    private _name; 
    private _gameCard: GameBoard; 

    constructor(name: string, gameCard: GameBoard){
        this._name = name; 
        this._gameCard = gameCard; 
    }

    get name(){
        return this._name; 
    }    

    //Using a getter for gameCard for now to allow quicker protoyping
    //Likely needs refactoring in the future for looser coupling with the gameCard class
    get gameCard(): GameBoard{
        return this._gameCard
    }
}