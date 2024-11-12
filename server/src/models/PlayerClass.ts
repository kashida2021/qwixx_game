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

  get gameCard(): qwixxBaseGameCard {
    return this._gameCard;
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
    if (!this._gameCard.markNumbers(colour, num)) {
      return false;
    }

    this._submissionCount++;
    return true;
  }

  public addPenalty() {
    this._gameCard.addPenalty();
  }

  //input: sum of white or sum of white and coloured
  //Output: boolean;
  public hasAvailableMoves(validColouredNumbers: any) {
    const numbers = this.gameCard.getHighestLowestMarkedNumbers();
    let flag = false;

    for (const key in validColouredNumbers) {
      if (key === "red" || key === "yellow") {
        if (
          validColouredNumbers[key][0] > numbers[key] ||
          validColouredNumbers[key][1] > numbers[key]
        ) {
          flag = true;
        }
      }

      if (key === "blue" || key === "green") {
        if (
          validColouredNumbers[key][0] < numbers[key] ||
          validColouredNumbers[key][1] < numbers[key]
        ) {
          flag = true;
        }
      }
    }

    return flag;
  }

  serialize() {
    return {
      gamecard: this._gameCard.serialize(),
      hasSubmittedChoice: this._hasSubmittedChoice,
    };
  }
}
