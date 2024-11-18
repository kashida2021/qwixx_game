import qwixxBaseGameCard from "./QwixxBaseGameCard";
import { rowColour } from "../enums/rowColours";
import { SerializeGameCard } from "./QwixxBaseGameCard";

export interface SerializePlayer {
  gameCard: SerializeGameCard;
  hasSubmittedChoice: boolean;
}

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

  // TODO: can remove this and just call the method from game card class directly
  public addPenalty() {
    this._gameCard.addPenalty();
  }

  serialize(): SerializePlayer {
    return {
      gameCard: this._gameCard.serialize(),
      hasSubmittedChoice: this._hasSubmittedChoice,
    };
  }
}
