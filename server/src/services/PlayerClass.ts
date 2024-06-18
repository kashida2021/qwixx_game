export default class Player{
    private _name; 
    private _scoreCard: any; 

    constructor(name: string, scoreCard: any){
        this._name = name; 
        this._scoreCard = scoreCard; 
    }

    get name(){
        return this._name; 
    }    

    //Using a getter for scoreCard for now to allow quicker protoyping
    //Likely needs refactoring in the future for looser coupling with the ScoreCard class
    get scoreCard(): any{
        return this._scoreCard
    }
}