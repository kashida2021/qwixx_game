import GameBoard from "./GameBoardTemp";
export default class Player{
    private _name; 
    private _scoreCard: GameBoard; 

    constructor(name: string, scoreCard: GameBoard){
        this._name = name; 
        this._scoreCard = scoreCard; 
    }

    get name(){
        return this._name; 
    }    

    //Using a getter for scoreCard for now to allow quicker protoyping
    //Likely needs refactoring in the future for looser coupling with the ScoreCard class
    get scoreCard(): GameBoard{
        return this._scoreCard
    }
}