import qwixxBaseGameCard from "./QwixxBaseGameCard";
export default class Player {
  private _name;
  private _gameCard: qwixxBaseGameCard;

  constructor(name: string, gameCard: qwixxBaseGameCard) {
    this._name = name;
    this._gameCard = gameCard;
  }

  get name(): string {
    return this._name;
  }

  //Using a getter for gameCard for now to allow quicker protoyping
  //Likely needs refactoring in the future for looser coupling with the gameCard class
  get gameCard(): qwixxBaseGameCard {
    return this._gameCard;
  }

  serialize() {
    return this._gameCard.serialize();
  }
}
