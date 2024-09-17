import qwixxBaseGameCard from "./QwixxBaseGameCard";
import { rowColour } from "../enums/rowColours";
export default class Player {
  private _name;
  private _gameCard: qwixxBaseGameCard;
  private _hasSubmittedChoice;
  private _submissionCount; 

  constructor(name: string, gameCard: qwixxBaseGameCard) {
    this._name = name;
    this._gameCard = gameCard;
    this._hasSubmittedChoice = false;
    this._submissionCount = 0; 
  }

  get name(): string {
    return this._name;
  }

  public get hasSubmittedChoice(): boolean {
    return this._hasSubmittedChoice;
  }

  public resetSubmission() {
    this._hasSubmittedChoice = false;
    this._submissionCount = 0;
  }

  public markSubmitted() {
    this._hasSubmittedChoice = true;
  }

  public get submissionCount(): number {
    return this._submissionCount;
  }

  public markNumber(colour: rowColour, num: number) {
   if(!this._gameCard.markNumbers(colour, num)){
      return false
    }

    this._submissionCount ++
    return true;
  }

  serialize() {
    return this._gameCard.serialize();
  }
}
