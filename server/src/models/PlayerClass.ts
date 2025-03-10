import qwixxBaseGameCard from "./QwixxBaseGameCard";
import { rowColour } from "../enums/rowColours";
import { SerializeGameCard } from "./QwixxBaseGameCard";
import IPlayer from "./IPlayer";
import IQwixxGameCard from "./IQwixxGameCard";

interface MarkNumberSuccess {
  success: true;
}

interface MarkNumberFailure {
  success: false;
  errorMessage: string;
}

export type MarkNumberResult = MarkNumberSuccess | MarkNumberFailure;

export interface SerializePlayer {
  gameCard: SerializeGameCard;
  hasSubmittedChoice: boolean;
}

export default class Player implements IPlayer {
  private _name;
  private _gameCard: IQwixxGameCard;
  private _hasSubmittedChoice;
  private _submissionCount;

  constructor(name: string, gameCard: IQwixxGameCard) {
    this._name = name;
    this._gameCard = gameCard;
    this._hasSubmittedChoice = false;
    this._submissionCount = 0;
  }

  get name(): string {
    return this._name;
  }

  get gameCard(): IQwixxGameCard {
    return this._gameCard;
  }

  public get hasSubmittedChoice(): boolean {
    return this._hasSubmittedChoice;
  }

  public get submissionCount(): number {
    return this._submissionCount;
  }

  public resetSubmission() {
    this._hasSubmittedChoice = false;
    this._submissionCount = 0;
  }

  public markSubmitted() {
    this._hasSubmittedChoice = true;
  }

  public markNumber(colour: rowColour, num: number): MarkNumberResult {
    const res = this.gameCard.markNumbers(colour, num);

    if (!res.success) {
      return { success: res.success, errorMessage: res.errorMessage };
    }

    this._submissionCount++;
    return { success: true };
  }

  public passMove() {
    this._submissionCount++;
  }

  serialize(): SerializePlayer {
    return {
      gameCard: this._gameCard.serialize(),
      hasSubmittedChoice: this._hasSubmittedChoice,
    };
  }
}
